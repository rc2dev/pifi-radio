require_relative "application_controller"
require_relative "../lib/lang_chooser"

class IndexController < ApplicationController
	def title
		title = "PiFi Radio"
		settings.production? ? title : "[#{settings.environment.capitalize}] #{title}"
	end

	def special_ip?
		# Try to get remote IP if behind reverse-proxy
		ip = env["HTTP_X_FORWARDED_FOR"] || request.ip
		settings.special_ips.include?(ip)
	end

	def streams_set
		special_ip? ? settings.streams[:all] : settings.streams[:pub]
	end

	def lang
		LangChooser.new(env).lang
	end

	def play_local?
		settings.play_local
	end

	get "/" do
		erb :index
	end
end
