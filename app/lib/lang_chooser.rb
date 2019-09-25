class LangChooser
	DEFAULT = "en-us"
	LANG_DIR = "app/public/js/lang/*.js"

	def initialize(http_accept_language)
		@http_accept = http_accept_language
	end

	def lang
		lang = accept.find { |e| avail.include?(e) }
		lang || DEFAULT
	end


	private

	def avail
		@@avail ||= Dir.glob(LANG_DIR).map { |file| File.basename(file, ".*") }
	end

	def accept
		return [] if @http_accept.nil?
		@http_accept.split(";")[0].split(",").map(&:downcase)
	end
end
