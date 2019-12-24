require "pifi/controllers/application_controller"

module PiFi
  class StreamsController < ApplicationController
    get "/" do
      content_type :json
      streams_set.to_json
    end

    def special_ip?
      # Try to get remote IP if behind reverse-proxy
      ip = env["HTTP_X_FORWARDED_FOR"] || request.ip
      settings.special_ips.include?(ip)
    end

    def streams_set
      special_ip? ? settings.streams[:all] : settings.streams[:pub]
    end
  end
end
