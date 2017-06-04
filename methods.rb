#module Methods

NAS_TIME = 10

# Workaround to avoid NAS to sleep
	def nas_ping(path, player)
		if path.nil?
			"Caminho de ping não definido."
		else
			Thread.new do
				loop do
					if player.local
						FileUtils.touch(path)
					end
					sleep NAS_TIME
				end
			end
		end
	end

# Load JSONs
	def load_streams(dir)
		path = File.join(dir, "streams.json")
		path_private = File.join(dir, "streams_private.json")
		[load_json(path), load_json(path_private)]
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





#end
