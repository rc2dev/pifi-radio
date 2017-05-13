require 'sinatra'
require 'ruby-mpd'
load 'streams.rb'
load 'util.rb'


configure do
	set :bind, '0.0.0.0'
    set :environment, 'production'
end

# Update DB and save it to dbpl playlist
def update_db(mpd)
    mpd.update
    pl = mpd.playlists.find {|p| p.name == "dbpl" }
    if pl.nil?
        mpd.save "dbpl"
        pl = mpd.playlists.find {|p| p.name == "dbpl" } 
    end
    pl.clear
    for song in mpd.songs
        pl.add song
    end
end
    
def show_player(mpd)
    status = get_status(mpd)
    name = get_name(mpd)
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


# Connect to MPD
mpd = MPD.new '127.0.0.1', 6600
mpd.connect

# Check if DB playlist exists
pl = mpd.playlists.find {|p| p.name == "dbpl" }
if pl.nil?
    update_db(mpd)
end
    
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

get '/radios/u' do
    load 'streams.rb'
    update_db(mpd)
    "<a href=\"/radios\">DB e playlist DB atualizados, streams.rb recarregado.</a>"
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
    # Se está tocando música local, vai para a próxima
    if get_name(mpd) == "Música" && mpd.playing?
        mpd.next
    # Senão, insere toda a biblioteca em modo aleatório e começa a tocar
    else
        mpd.clear
        pl = mpd.playlists.find {|p| p.name == "dbpl" }
        pl.load
        mpd.random= true
        mpd.crossfade= true
        mpd.play
    end
    redirect "/player"
end

#Testando
error do
  '<h3>Desculpe, ocorreu um erro.</h3><p>Mensagem: ' + \
          env['sinatra.error'].message + '</p><a href="/"><h2>Voltar</h2></a>'
end
