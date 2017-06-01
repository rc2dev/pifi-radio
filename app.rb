require 'sinatra'
require 'ruby-mpd'
require 'json'
require 'fileutils'					# para workaround de touch no AirPort
require_relative 'methods'

# Constants
CACHE_MAX_AGE = 86400
NAS_TIME = 10		# in seconds

# For cache use
start_time = Time.now

# User Configuration
config = load_json("config.json")

# Sinatra configuration
configure do
	set :bind, '0.0.0.0'
	set :static_cache_control, [:public, :max_age => CACHE_MAX_AGE]
end

# Connect to MPD
mpd = MPD.new '127.0.0.1', 6600
mpd.connect

# Workaround to avoid NAS to sleep
if config["ping_path"].nil?
	"Caminho de ping não definido."
else
	Thread.new do
		loop do
			if playing_local?(mpd)
				FileUtils.touch(config["ping_path"])
			end
			sleep NAS_TIME
		end
	end
end


# Check for DB playlist
pl = mpd.playlists.find { |p| p.name == "dbpl" }
if pl.nil?
	update_db(mpd)
end

# Load JSONs
path = File.join(config["streams_dir"], "streams.json")
path_private = File.join(config["streams_dir"], "streams_private.json")
streams, streams_private = load_json(path), load_json(path_private)

# Cache
before /\/s?/ do 		# for / and /s
	cache_control :public, :max_age => CACHE_MAX_AGE
	last_modified start_time
end
before '/api/*' do
	cache_control :no_cache
end

# Routes
get '/' do
	hostname = `uname -n`.chop.capitalize
	erb :main, locals: { hostname: hostname, streams: streams }
end

get '/s' do
	hostname = `uname -n`.chop.capitalize
	erb :main, locals: { hostname: hostname, streams:
		streams_private.merge({"Rio de Janeiro":""}).merge(streams) }
end

get '/api/:cmd' do
	cmd = params[:cmd]
	case cmd
	when "play"
		mpd.play
	when "stop"
		mpd.stop
	when "vdown"
		mpd.send_command("volume -5")
	when "vup"
		mpd.send_command("volume +5")
	when "vol" # tried as return value for vdown/vup, but seemed slower
		mpd.volume.to_s + "%"
	when "state"
		content_type :json
		{ :playing => mpd.playing?,
			:name => get_name(mpd, streams.merge(streams_private)),
			:playing_local => playing_local?(mpd),
			:elapsed => mpd.playing? ? mpd.status[:time][0] : 0,
			:length => mpd.playing? ? mpd.status[:time][1] : 0 }.to_json
	when "play-url"
		play_url(params, mpd)
	when "play-random"
		play_random(mpd)
	end
end

get '/updatedb' do
	update_db(mpd)
	"<a href=\"/\">DB e playlist DB atualizados.</a>"
end

error do
	'<h3>Desculpe, ocorreu um erro.</h3><p>Mensagem: ' + \
		env['sinatra.error'].message + '</p><a href="/"><h2>Voltar</h2></a>'
end
