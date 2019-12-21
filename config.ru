require "pifi"

map("/") { run PiFi::IndexController }
map("/api/player") { run PiFi::PlayerController }
