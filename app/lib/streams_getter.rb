require_relative "utils"

class StreamsGetter
	include Utils

	def initialize(path_pub, path_priv)
		@path_pub = path_pub
		@path_priv = path_priv
	end

	def streams
		@streams ||= parse_streams
	end


	private

	def parse_streams
		pub = file_to_hash(@path_pub)
		priv = @path_priv.empty? ? {} : file_to_hash(@path_priv)
		all = pub.merge(priv)

		{pub: pub, all: all}
	end
end