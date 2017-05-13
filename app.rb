require 'sinatra'
require 'ruby-mpd'
load 'routes.rb'
load 'methods.rb'
load 'streams.rb'
load 'util.rb'

# Configuration
configure do
	set :bind, '0.0.0.0'
    set :environment, 'production'
end

# Connect to MPD
mpd = MPD.new '127.0.0.1', 6600
mpd.connect

# Check for DB playlist
pl = mpd.playlists.find {|p| p.name == "dbpl" }
if pl.nil?
    update_db(mpd)
end


# Routes
get '/' do
    if mpd.playing?
        show_player(mpd)      # Música tocando, mostra player.
	else
		show_radios(true)     # Nenhuma música tocando, escolher rádio.		
	end
end

get '/radios' do
    show_radios(false)
end

get '/player' do
    show_player(mpd)
end

get '/player/:cmd' do
    send_cmd(params, mpd)
end
    
get '/play' do
    play(params, mpd)
end
post '/play' do
    play(params, mpd)
end

get '/radios/custom' do
    erb :custom
end

get '/random' do
    play_random(mpd)
end

get '/update' do
    load 'streams.rb'
    update_db(mpd)
    "<a href=\"/radios\">DB e playlist DB atualizados, streams.rb recarregado.</a>"
end

error do
  '<h3>Desculpe, ocorreu um erro.</h3><p>Mensagem: ' + \
          env['sinatra.error'].message + '</p><a href="/"><h2>Voltar</h2></a>'
end
