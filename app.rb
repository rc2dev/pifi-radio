require 'sinatra'
require 'ruby-mpd'
require 'json'
require_relative 'methods'
require_relative 'player'


# Constants
CONFIG_FILE = "/etc/rcradio.conf"
CONFIG_KEYS = ["host", "streams_dir", "play_local"]
CACHE_MAX_AGE = 120

# For cache use
cache_time = Time.now

# User configuration
config = load_config(CONFIG_FILE, CONFIG_KEYS)
streams, streams_all = load_streams(config["streams_dir"])

# Sinatra configuration
configure :development do
	set :bind, '0.0.0.0'
end
configure :production do
	set :static, false
end

# Create player
player = Player.new(config["host"], streams_all)


# Routes
get "/api" do
	content_type :json
	cache_control :no_cache
	{ playing: player.playing,
		song: player.song,
		local: player.local,
		elapsed: player.elapsed,
		length: player.length }.to_json
end

post "/api" do
	case params[:cmd]
	when "play"
		status 204
		player.play

	when "stop"
		status 204
		player.stop

	when "vol_ch"
		status 200
		content_type :text
		halt 400 unless params.include?(:inc)

		inc = params[:inc].to_i
		vol = player.vol_ch(inc)
		vol.to_s + "%"

	when "play_stream"
		status 204
		halt 400 unless params.include?(:type) && params.include?(:value)

		begin
			type = params[:type]
			value = params[:value].strip
			queue = params.include?(:queue) ? params[:queue].strip : nil
			player.play_stream(type, value, queue)
		rescue ArgumentError, MPD::NotFound
			halt 400
		end

	when "play_random"
		status 204
		halt 503 unless config["play_local"]

		player.play_random

	else
		halt 400
	end
end

title = production? ? "Rádio" : "#{settings.environment.capitalize} - Rádio"
get "/" do
	cache_control :public, :max_age => CACHE_MAX_AGE
	last_modified cache_time
	erb :main, locals: { title: title, streams: streams,
		play_local: config["play_local"] }
end

get "/s" do
	cache_control :public, :max_age => CACHE_MAX_AGE
	last_modified cache_time
	erb :main, locals: { title: title, streams: streams_all,
		play_local: config["play_local"] }
end

error do
	"<h3>Desculpe, ocorreu um erro.</h3>" +
		"<p>Mensagem: " + env["sinatra.error"].message + "</p>" +
		"<a href="/"><h2>Voltar</h2></a>"
end
