def get_name(mpd)
    song = mpd.current_song
    if song.nil?
        "Nada"
    elsif ! song.file.include?("://")
        "Música"
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

def is_local(path)
    ! path.include?("://")
end
