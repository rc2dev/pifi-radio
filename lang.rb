class Lang

	attr_reader :avail

	def initialize
		get_avail
	end

	def get_avail
		avail = Dir.glob("locales/*.rb")
		avail.map! { |x| File.basename(x, ".*") }
		@avail = avail
	end

	def set_lang(accept)
	end
end
