module Utils
	def file_to_hash(path)
		file_content = File.read(path)
		JSON.parse(file_content)
	end
end
