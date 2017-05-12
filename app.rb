require 'sinatra'
require 'ruby-mpd'
load 'streams.rb'
load 'util.rb'

# TODO:
# get /, redicret 302 mesmo?
# load util mesmo?
# Tratar erros mpd (connection refused0
# servidor em produção

configure do
	set :bind, '0.0.0.0'
    set :environment, 'production'
end


def show_player(mpd)
    status = get_status(mpd)
    name = get_name(mpd.current_song.file)
	erb :player, locals: {name: name, status: status, mpd: mpd}
end

def show_radios(auto)
    erb :radios, locals: {auto: auto}
end

def play(params, mpd)
    url = params[:url]
    mpd.clear
    mpd.add url
    mpd.play
    redirect "/player"
end

def send_cmd(params, mpd)
    cmd = params[:cmd]
    case cmd
    when "play"
		mpd.play
	when "stop"
		mpd.stop
	when "vlow"
		mpd.send_command("volume -5")
	when "vup"
        mpd.send_command("volume +5")
	end
    redirect "/player"
end

mpd = MPD.new '127.0.0.1', 6600
mpd.connect

get '/' do
    if mpd.stopped? || mpd.paused?
		show_radios(true)     # Nenhuma música tocando, escolher rádio.
        #redirect "/radios" 	
	else
		show_player(mpd)      # Música tocando, mostra player.
        #redirect "/player" 		
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

#Testando
error do
  'Sorry there was a nasty error - ' + env['sinatra.error'].message
end
