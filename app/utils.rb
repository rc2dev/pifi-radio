module Utils
	def self.is_special(env, request, special_ips)
		# Try to get remote IP if behind reverse-proxy
		ip = env.has_key?("HTTP_X_FORWARDED_FOR") ? env["HTTP_X_FORWARDED_FOR"] : request.ip
		special_ips.include?(ip)
	end

	def self.get_streams(path, path_p)
		streams = file_to_hash(path)
		streams_p = path_p.empty? ? {} : file_to_hash(path_p)
		streams_all = streams.merge(streams_p)

		[streams, streams_all]
	end

	def self.file_to_hash(path)
		file_content = File.read(path)
		JSON.parse(file_content)
	end
end
