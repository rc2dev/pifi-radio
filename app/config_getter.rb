class ConfigGetter
	attr_reader :config

	PATH = "/etc/pifi-radio.conf"
	REQ_KEYS = ["mpd_host", "mpd_port", "streams_file"]
	OPT_KEYS = {"cache_max_age" => 120, "serve_static" => true, "mpd_password" => "",
	          	"streamsp_file" => "", "special_ips" => "", "play_local" => false}

	def initialize
		@config = Utils.file_to_hash(PATH)
		check_errors
	end


	private

	def check_errors
		REQ_KEYS.each do |req_key|
			raise "Required key '#{req_key}' missing from config file" \
				unless @config.key?(req_key)
		end

		OPT_KEYS.each do |opt_key, default_value|
			@config[opt_key] = default_value unless @config.key?(opt_key)
 		end

		@config.keys.each do |key|
			warn "Invalid key '#{key}' in config file" \
				unless REQ_KEYS.include?(key) || OPT_KEYS.key?(key)
		end
	end

end
