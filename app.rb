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
    erb :main
end

get '/api/:cmd' do
    cmd = params[:cmd]
    case cmd
    when "play"
		    mpd.play unless mpd.playing?
    when "stop"
		    mpd.stop if mpd.playing?
    when "vdown"
		    mpd.send_command("volume -5")
    when "vup"
        mpd.send_command("volume +5")
    when "vol"
        mpd.volume.to_s + '%'
    when "state"
        { :playing => mpd.playing?, :name => get_name(mpd) }.to_json
    when "play-url"
        play_url(params, mpd)
    when "play-random"
        play_random(mpd).to_s   # Retorna se é primeiro random
    end
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
