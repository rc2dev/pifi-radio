require "pifi/controllers/application_controller"

module PiFi
  class StaticController < ApplicationController
    set :root, File.expand_path("../../", __FILE__)
    set :static, true
    configure :production do
      set :static, settings.serve_static
    end

    get "/" do
      send_file File.join(settings.public_folder, 'index.html')
    end
  end
end
