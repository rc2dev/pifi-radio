require "pifi/controllers/application_controller"
require "pifi/lib/lang_chooser"

module PiFi
  class IndexController < ApplicationController
    def title
      title = "PiFi Radio"
      settings.production? ? title : "[#{settings.environment.capitalize}] #{title}"
    end

    def lang
      LangChooser.new(env["HTTP_ACCEPT_LANGUAGE"]).lang
    end

    def play_local?
      settings.play_local
    end

    get "/" do
      send_file File.join(settings.public_folder, 'index.html')
    end
  end
end
