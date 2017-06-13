require 'sinatra'
require 'ruby-mpd'
require 'json'
require 'fileutils'					# para workaround de touch no AirPort
require_relative 'methods'
require_relative 'player'

# For thread debugging
Thread::abort_on_exception = true

# Constants
CONFIG_FILE = "config.json"
CONFIG_KEYS = ["streams_dir", "ping_path", "ping_time"]
CACHE_MAX_AGE = 120

# For cache use
start_time = Time.now

# User configuration
config = load_config(CONFIG_FILE, CONFIG_KEYS)
streams, streams_all = load_streams(config["streams_dir"])
hostname = `uname -n`.chop.capitalize

# Sinatra configuration
configure :development do
 	set :bind, '0.0.0.0'
end
configure :production do
  set :static, false
end

# Create player and NAS thread
player = Player.new(streams_all)
nas_ping(config["ping_path"], config["ping_time"], player)


# Routes
get '/api' do
  content_type :json
  cache_control :no_cache
	{ playing: player.playing,
		song: player.song,
		local: player.local,
		elapsed: player.elapsed,
		length: player.length }.to_json
end

post '/api' do
	case params[:cmd]
	when "play"
    status 204
		player.play

	when "stop"
    status 204
		player.stop

	when "vol_down"
    status 200
    content_type :text
    vol = player.vol_ch(-5)
    vol.to_s + "%"

	when "vol_up"
    status 200
    content_type :text
    vol = player.vol_ch(+5)
    vol.to_s + "%"

	when "play_stream"
    status 204
    begin
		  player.play_stream(params[:type], params[:value].strip)
    rescue
      halt 400
    end

	when "play_random"
    status 204
		player.play_random

  else
    halt 400
	end
end

get '/' do
  cache_control :public, :max_age => CACHE_MAX_AGE
  last_modified start_time
	erb :main, locals: { hostname: hostname, streams: streams }
end

get '/s' do
  cache_control :public, :max_age => CACHE_MAX_AGE
  last_modified start_time
	erb :main, locals: { hostname: hostname, streams: streams_all }
end

get '/update' do
	player.update_pl
  streams, streams_all = load_streams(config["streams_dir"])
  start_time = Time.now
  "<a href=\"/\">DB, playlist DB e streams atualizados.</a>"
end

error do
	'<h3>Desculpe, ocorreu um erro.</h3><p>Mensagem: ' + \
		env['sinatra.error'].message + '</p><a href="/"><h2>Voltar</h2></a>'
end
