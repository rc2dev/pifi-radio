require "pifi/lib/config_getter"
require "pifi/lib/streams"
require "sinatra/base"

module PiFi
  class ApplicationController < Sinatra::Base
    set :static, false
    set ConfigGetter.new.config
    set :streams, Streams.new(settings.streams_path, settings.streams_path_priv)
  end
end
