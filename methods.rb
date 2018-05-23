require 'json'

module Methods
	def self.get_streams(path, path_p)
		streams = file_to_hash(path)
		streams_p = file_to_hash(path_p)
		streams_all = streams.merge(streams_p)

		[streams, streams_all]
	end

	def self.file_to_hash(path)
		file_content = File.read(path)
		JSON.parse(file_content)
	end
end
