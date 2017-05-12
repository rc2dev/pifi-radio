#load 'streams.rb'

def get_name(path)
   $streams.key(path) || path
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
