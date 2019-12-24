require "pifi"

map("/") { run PiFi::IndexController }
map("/api/player") { run PiFi::PlayerController }
map("/api/streams") { run PiFi::StreamsController }
