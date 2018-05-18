class LangSetter

	attr_reader :lang

	def initialize(env)
		get_avail
		get_accepted(env)
		set_lang
	end

	def get_avail
		avail = Dir.glob("locales/*.rb")
		avail.map! { |x| File.basename(x, ".*") }
		@avail = avail
	end

	def get_accepted(env)
		request = env["HTTP_ACCEPT_LANGUAGE"]
		@accepted = request.split(";")[0].split(",")
	end

	def set_lang
		@accepted.each do |acc|
			acc = acc.downcase
			if @avail.include?(acc)
				@lang = acc
				return
			end
		end
		@lang = "en-us"
	end

end
