class ConfigGetter
	attr_reader :config

	@@PATH = "/etc/pifi-radio.conf"
	@@KEYS = ["cache_max_age", "serve_static", "host", "port", "streams_file",
					 "streamsp_file", "special_ips", "play_local"]

	def initialize
		@config = Utils.file_to_hash(@@PATH)
		check_error
	end


	private

	def check_error
		@@KEYS.each do |key|
			raise "Key '#{key}' missing from config file." unless @config.include?(key)
		end
		@config.each do |key, value|
			raise "Invalid key '#{key}'." unless @@KEYS.include?(key)
		end
	end
end
