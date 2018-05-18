# Load streams to variables
def load_streams(streams_file, streamsp_file)
	streams = load_json(streams_file)
	streamsp = load_json(streamsp_file)
	streams_all = streams.merge(streamsp)
	[streams, streams_all]
end

# Load JSON ignoring keys starting with //
def load_json(path)
	file = File.read(path)
	hash = JSON.parse(file)
	for key in hash.keys
		hash.delete(key) if key.start_with?("//")
	end
	hash
end

# Load config file, checking for errors
def load_config(path, keys)
	file = File.read(path)
	config = JSON.parse(file)

	keys.each do |key|
		raise "Key '#{key}' missing from config file." unless config.include?(key)
	end
	config.each do |key, value|
		raise "Invalid key '#{key}'." unless keys.include?(key)
	end

	config
end

# Determine which language to use, based on HTTP request headers
def set_lang(accept)
	langs = accept.to_s.split(",").map

end
