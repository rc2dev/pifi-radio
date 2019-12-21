require_relative "application_controller"
require_relative "../lib/player"

module PiFi
  class PlayerController < ApplicationController
    ALLOWED_METHODS=["play", "stop", "change_vol", "play_radios", "play_urls", "play_random"]

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
      content_type :text

      method = params[:method]
      args = params[:params]
      halt 400, "Invalid method" unless ALLOWED_METHODS.include?(method)

      begin
        result = player.public_send(method, *args)
      rescue ArgumentError, MPD::NotFound => e
        halt 400, e.message.delete_prefix("[] ")
      rescue MPD::PermissionError, MPD::IncorrectPassword => e
        halt 403, e.message.delete_prefix("[] ")
      end
      result.to_s
    end
  end
end
