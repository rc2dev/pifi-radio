require 'sinatra'
require 'ruby-mpd'
require 'json'
require 'fileutils'					# para workaround de touch no AirPort
require_relative 'methods'
require_relative 'player'

# For thread debugging
Thread::abort_on_exception = true


# Constants
CACHE_MAX_AGE = 86400
NAS_TIME = 10		# in seconds

# For cache use
start_time = Time.now

# User configuration
hostname = `uname -n`.chop.capitalize
config = load_json("config.json")
streams, streams_all = load_streams(config["streams_dir"])

# Sinatra configuration
configure :development do
 	set :bind, '0.0.0.0'
#  set :static_cache_control, [:public, :max_age => CACHE_MAX_AGE]
end
configure :production do
  set :static, false
end

# Create player and NAS thread
player = Player.new(streams_all)
nas_ping(config["ping_path"], NAS_TIME, player)

# Cache
before /\/s?/ do 		# for / and /s
	cache_control :public, :max_age => CACHE_MAX_AGE
	last_modified start_time
end
before '/api' do
	cache_control :no_cache
end


# Routes
get '/api' do
  content_type :json
	{ playing: player.playing,
		song: player.song,
		local: player.local,
		elapsed: player.elapsed,
		length: player.length }.to_json
end

post '/api' do
	cmd = params[:cmd]
	case cmd
	when "play"
		player.play
	when "stop"
		player.stop
	when "vdown"
		player.vch(-5).to_s + "%"
	when "vup"
		player.vch(+5).to_s + "%"
	when "play-url"
		url = params[:url].strip
		player.play_url(url)
	when "play-random"
		player.play_random
	end
end

get '/' do
	erb :main, locals: { hostname: hostname, streams: streams }
end

get '/s' do
	erb :main, locals: { hostname: hostname, streams: streams_all }
end


get '/updatedb' do
	player.update_db
	"<a href=\"/\">DB e playlist DB atualizados.</a>"
end

error do
	'<h3>Desculpe, ocorreu um erro.</h3><p>Mensagem: ' + \
		env['sinatra.error'].message + '</p><a href="/"><h2>Voltar</h2></a>'
end
