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
    url.strip!
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

def play_random(mpd)
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
