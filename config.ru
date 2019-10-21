require "sinatra/base"
Dir.glob("./{app/helpers,app/controllers}/*.rb").each { |file| require file }

map("/") { run IndexController }
map("/api/player") { run PlayerController }