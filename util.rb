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
    "Volume: " + mpd.volume.to_s + "%"
end

def first_random?(mpd)
    not_first = mpd.playing? && ! mpd.current_song.file.include?("://")
    ! not_first
end
