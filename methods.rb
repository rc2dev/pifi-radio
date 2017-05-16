def get_name(mpd, streams)
    song = mpd.current_song
    if song.nil?
        ""
    elsif ! song.file.include?("://")
        "Coletânea"
    else
        streams.key(song.file) || song.file
    end
end

def first_random?(mpd)
    not_first = mpd.playing? && ! mpd.current_song.file.include?("://")
    ! not_first
end

def update_db(mpd)
    # Update DB
    mpd.update

    # Update/create playlist with whole DB
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

# Load JSON ignoring keys starting with //
def load_streams(file_name)
	file = File.read(file_name)
	hash = JSON.parse(file)
  for key in hash.keys
    hash.delete(key) if key.start_with?("//")
  end
  hash
end

def play_url(params, mpd)
    url = params[:url].strip
    mpd.clear
    mpd.add url
    mpd.play
end

def play_random(mpd)
    # Se não está tocando arquivo local, carregar toda a
	  # biblioteca e começa a tocar em modo aleatório
    if first_random?(mpd)
        mpd.clear
        pl = mpd.playlists.find { |p| p.name == "dbpl" }
        pl.load
        mpd.random= true
		    mpd.crossfade= 6
        mpd.play
    # Se está tocando arquivo local, tocar o próximo
    else
        mpd.next
    end
end
