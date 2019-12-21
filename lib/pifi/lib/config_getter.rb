require "pifi/lib/utils"

module PiFi
  class ConfigGetter
    include Utils

    PATH = "/etc/pifi-radio.conf"
    REQ_KEYS = ["mpd_host", "mpd_port", "streams_file"]
    OPT_KEYS = {"mpd_password" => "",
                "streamsp_file" => "",
                "special_ips" => "",
                "play_local" => false,
                "serve_static" => true}

    def config
      @config ||= parse_config
    end

    private

    def parse_config
      config = file_to_hash(PATH)
      config = OPT_KEYS.merge(config)
      check_errors(config)

      config
    end

    def check_errors(config)
      missing = REQ_KEYS.reject { |key| config.key?(key) }
      raise "Required keys missing from config file: #{missing}" unless missing.empty?

      invalid = config.keys.reject { |key| REQ_KEYS.include?(key) || OPT_KEYS.key?(key) }
      warn "Invalid keys in config file: #{invalid}" unless invalid.empty?
    end
  end
end
