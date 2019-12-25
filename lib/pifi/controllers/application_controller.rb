require "pifi/lib/config_getter"
require "pifi/lib/streams_getter"
require "sinatra/base"

module PiFi
  class ApplicationController < Sinatra::Base
    set ConfigGetter.new.config
    set :streams, StreamsGetter.new(settings.streams_path, settings.streams_path_priv).streams
    set :root, File.expand_path("../../", __FILE__)

    configure :production do
      set :static, settings.serve_static
    end
    configure :development do
      before { response.headers["Access-Control-Allow-Origin"] = "*" }
    end
  end
end
