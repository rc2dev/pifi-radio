require 'sinatra'
require 'ruby-mpd'
load 'methods.rb'
load 'streams.rb'

# Configuration
configure do
	set :bind, '0.0.0.0'
end

# Connect to MPD
mpd = MPD.new '127.0.0.1', 6600
mpd.connect

# Check for DB playlist
pl = mpd.playlists.find { |p| p.name == "dbpl" }
if pl.nil?
    update_db(mpd)
end


# Routes
get '/' do
    status = get_status(mpd)
    name = get_name(mpd)
    erb :main, locals: { name: name, status: status }
end

get '/api/:cmd' do
    cmd = params[:cmd]
    case cmd
    when "play"
		mpd.play
	when "stop"
		mpd.stop
	when "vdown"
		mpd.send_command("volume -5")
	when "vup"
        mpd.send_command("volume +5")
    when "vol"
        mpd.volume.to_s + "%"
    when "state"
        { :status => get_status(mpd), :name => get_name(mpd) }.to_json
    when "playing"
        mpd.playing?.to_s
    when "first_random"
        first_random?(mpd).to_s
    when "play-random" do
        play_random(mpd)
	end
end
    
post '/play-url' do
    play_url(params, mpd)
end

get '/update' do
    load 'streams.rb'
    update_db(mpd)
    "<a href=\"\">DB e playlist DB atualizados, streams.rb recarregado.</a>"
end

error do
  '<h3>Desculpe, ocorreu um erro.</h3><p>Mensagem: ' + \
          env['sinatra.error'].message + '</p><a href="/"><h2>Voltar</h2></a>'
end
