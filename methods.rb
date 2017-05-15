def get_name(mpd)
    song = mpd.current_song
    if song.nil?
        ""
    elsif ! song.file.include?("://")
        "Coletânea"
    else
        $streams.key(song.file) || song.file
    end
end

def get_status(mpd)
    if mpd.playing?
        return "Tocando"
    elsif mpd.stopped?
        return "Parado"
    elsif mpd.paused?
        return "Pausado"
    else
        return ""
    end
end

def get_volume(mpd)
    mpd.volume.to_s + "%"
end

def first_random?(mpd)
    not_first = mpd.playing? && ! mpd.current_song.file.include?("://")
    ! not_first
end

# Update DB and save it to dbpl playlist
def update_db(mpd)
    mpd.update
    pl = mpd.playlists.find { |p| p.name == "dbpl" }
    if pl.nil?
        mpd.save "dbpl"
        pl = mpd.playlists.find { |p| p.name == "dbpl" } 
    end
    pl.clear
    for song in mpd.songs
        pl.add song
    end
end

def play_url(params, mpd)
    url = params[:url]
    url.strip!
    mpd.clear
    mpd.add url
    mpd.play
end

def play_random(mpd)
    # Se não está tocando música local, carrega toda a
	# biblioteca em modo aleatório e começa a tocar
    if first_random?(mpd)
        mpd.clear
        pl = mpd.playlists.find { |p| p.name == "dbpl" }
        pl.load
        mpd.random= true
		mpd.crossfade= 6
        mpd.play
    # Se está tocando música local, vai para a próxima
    else
        mpd.next
    end
end
