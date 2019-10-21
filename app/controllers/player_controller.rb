require_relative "application_controller"
require_relative "../lib/player"

class PlayerController < ApplicationController
  ERROR = {PARAMS: "Wrong parameters",
           LOCAL: "Local playback is disabled",
           VOLNA: "Volume is not available",
           MPD: "MPD says not found"}

  def player
    @@player
  end

  @@player = Player.new(settings.streams[:all],
                        host = settings.mpd_host,
                        port = settings.mpd_port,
                        password = settings.mpd_password)

  get "/" do
    content_type :json
    cache_control :no_cache
    player.state.to_json
  end

  post "/" do
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
      halt 400, ERROR[:PARAMS] unless params.key?(:delta)

      begin
        vol = player.change_vol(params[:delta])
      rescue Player::VolNaError
        halt 503, ERROR[:VOLNA]
      rescue ArgumentError => e
        halt 400, e.message
      else
        vol.to_s + "%"
      end

    when "play_radios"
      status 204
      halt 400, ERROR[:PARAMS] unless params.key?(:names) && params[:names].kind_of?(Array)

      begin
        player.play_radios(params[:names])
      rescue ArgumentError => e
        halt 400, e.message
      rescue MPD::NotFound
        halt 400, ERROR[:MPD]
      end

    when "play_urls"
      status 204
      halt 400, ERROR[:PARAMS] unless params.key?(:urls) && params[:urls].kind_of?(Array)

      begin
        player.play_urls(params[:urls])
      rescue ArgumentError => e
        halt 400, e.message
      rescue MPD::NotFound => e
        halt 400, ERROR[:MPD]
      end

    when "play_random"
      status 204
      halt 400, ERROR[:LOCAL] unless config["play_local"]
  
      player.play_random
  
    else
      halt 400, ERROR[:PARAMS]
    end
  end
end