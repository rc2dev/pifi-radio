require "pifi/controllers/application_controller"

module PiFi
  class IndexController < ApplicationController
    def title
      title = "PiFi Radio"
      settings.production? ? title : "[#{settings.environment.capitalize}] #{title}"
    end

    def play_local?
      settings.play_local
    end

    get "/" do
      send_file File.join(settings.public_folder, 'index.html')
    end
  end
end
