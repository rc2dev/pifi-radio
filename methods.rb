# Workaround to avoid NAS to sleep
def nas_ping(path, time, player)
	Thread.new do
		loop do
			FileUtils.touch(path) if player.local && player.playing
			sleep time
		end
	end
end

# Load streams to variables
def load_streams(dir)
	path = File.join(dir, "streams.json")
	path_private = File.join(dir, "streams_private.json")
	streams = load_json(path)
	streams_private = load_json(path_private)
	streams_all = streams.merge(streams_private)
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
