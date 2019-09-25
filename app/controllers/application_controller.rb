require_relative "../lib/config_getter"
require_relative "../lib/streams_getter"

class ApplicationController < Sinatra::Base
  set ConfigGetter.new.config
  set :streams, StreamsGetter.new(settings.streams_file, settings.streamsp_file).streams

	configure :production do
		set :static, settings.serve_static
	end

	set :root, File.expand_path("../../", __FILE__)
end