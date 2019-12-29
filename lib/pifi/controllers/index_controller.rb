require "pifi/controllers/application_controller"

module PiFi
  class IndexController < ApplicationController
    get "/" do
      send_file File.join(settings.public_folder, 'index.html')
    end
  end
end
