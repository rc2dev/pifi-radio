require "pifi/controllers/application_controller"

module PiFi
  class ConfigController < ApplicationController
    get "/" do
      content_type :json
      { "mpd_host": settings.mpd_host,
        "mpd_port": settings.mpd_port,
        "environment": settings.environment,
        "version": VERSION
      }.to_json
    end
  end
end
