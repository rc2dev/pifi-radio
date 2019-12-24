require "pifi/controllers/application_controller"
require "pifi/lib/lang_chooser"

module PiFi
  class IndexController < ApplicationController
    def title
      title = "PiFi Radio"
      settings.production? ? title : "[#{settings.environment.capitalize}] #{title}"
    end

    def special_ip?
      # Try to get remote IP if behind reverse-proxy
      ip = env["HTTP_X_FORWARDED_FOR"] || request.ip
      settings.special_ips.include?(ip)
    end

    def streams_set
      special_ip? ? settings.streams[:all] : settings.streams[:pub]
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
