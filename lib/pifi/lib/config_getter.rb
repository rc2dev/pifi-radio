require "pifi/lib/utils"

module PiFi
  class ConfigGetter
    include Utils

    PATH = "/etc/pifi/config.json"
    DEFAULT_KEYS = {
      "mpd_host" => "127.0.0.1",
      "mpd_port" => "6600",
      "mpd_password" => "",
      "streams_path" => "/etc/pifi/streams.json",
      "streams_path_priv" => "",
      "special_ips" => "",
      "play_local" => false,
      "serve_static" => true
    }

    def config
      @config ||= parse_config
    end

    private

    def parse_config
      if File.file?(PATH)
        warn "Config found at #{PATH}."
        config = file_to_hash(PATH)
      else
        warn "Config not found. Using defaults."
        config = {}
      end
      config = DEFAULT_KEYS.merge(config)
      check_errors(config)

      config
    end

    def check_errors(config)
      invalid = config.keys.reject { |key| DEFAULT_KEYS.include?(key) }
      warn "Invalid keys in config file: #{invalid}" unless invalid.empty?
    end
  end
end
