# Workaround to avoid NAS to sleep
def nas_ping(path, time, player)
	if path.nil?
		"Caminho de ping não definido."
	else
		Thread.new do
			loop do
				if player.local
					FileUtils.touch(path)
				end
				sleep time
			end
		end
	end
end

# Load JSONs
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
