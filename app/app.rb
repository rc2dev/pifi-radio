require 'sinatra'
require 'ruby-mpd'
require_relative 'config_getter'
require_relative 'player'
require_relative 'lang_chooser'
require_relative 'utils'


# HTTP error messages
API_ERROR_PARAMS = "Wrong parameters"
API_ERROR_LOCAL = "Local playback is disabled"
API_ERROR_VOLNA = "Volume is not available"
API_ERROR_MPD = "MPD says not found"

# For cache use
cache_time = Time.now

# Configuration
config_getter = ConfigGetter.new
config = config_getter.config

# Streams
streams, streams_all = Utils.get_streams(
	config["streams_file"], config["streamsp_file"])

# Create player
player = Player.new(config["host"], config["port"], streams_all)

# Sinatra configuration
configure :production do
	set :static, config["serve_static"]
end


# Routes
get "/api" do
	content_type :json
	cache_control :no_cache
	{ playing: player.playing,
		title: player.title,
		artist: player.artist,
		local: player.local,
		elapsed: player.elapsed,
		length: player.length,
		vol: player.vol,
		con_mpd: player.con_mpd }.to_json
end

post "/api" do
	case params[:cmd]
	when "play"
		status 204
		player.play

	when "stop"
		status 204
		player.stop

	when "change_vol"
		status 200
		content_type :text
		halt 400, API_ERROR_PARAMS unless params.include?(:delta)

		delta = params[:delta].to_i
		begin
			vol = player.change_vol(delta)
		rescue VolNaError
			halt 503, API_ERROR_VOLNA
		else
			vol.to_s + "%"
		end

	when "play_radios"
		status 204
		halt 400, API_ERROR_PARAMS unless params.include?(:names)

		begin
			player.play_radios(params[:names])
		rescue ArgumentError => e
			halt 400, e.message
		rescue MPD::NotFound
			halt 400, API_ERROR_MPD
		end

	when "play_urls"
		status 204
		halt 400, API_ERROR_PARAMS unless params.include?(:urls)

		begin
			player.play_urls(params[:urls])
		rescue ArgumentError => e
			halt 400, e.message
		rescue MPD::NotFound
			halt 400, API_ERROR_MPD
		end

	when "play_random"
		status 204
		halt 400, API_ERROR_LOCAL unless config["play_local"]

		player.play_random

	else
		halt 400, API_ERROR_PARAMS
	end
end


title = production? ? "PiFi Radio" : "[#{settings.environment.capitalize}] PiFi Radio"
get "/" do
	lang_chooser = LangChooser.new(env)
	lang = lang_chooser.lang

	cache_control :public, :max_age => config["cache_max_age"]
	last_modified cache_time

	is_special = Utils.is_special(env, request, config["special_ips"])
	stream_set = is_special ? streams_all : streams

	erb :main, locals: { title: title, lang: lang, streams: stream_set,
		play_local: config["play_local"] }
end
