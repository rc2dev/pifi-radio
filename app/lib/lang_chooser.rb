class LangChooser

	attr_reader :lang


	def self.set_avail
		avail = Dir.glob("app/public/js/lang/*")
		avail.map! { |x| File.basename(x, ".*") }
		@@avail = avail
	end

	def initialize(env)
		set_accepted(env)
		choose_lang
	end

	def set_accepted(env)
		request = env["HTTP_ACCEPT_LANGUAGE"]
		@accepted = request.split(";")[0].split(",")
	end

	def choose_lang
		@accepted.each do |acc|
			acc = acc.downcase
			if @@avail.include?(acc)
				@lang = acc
				return
			end
		end
		@lang = "en-us"
	end

	self.set_avail
end
