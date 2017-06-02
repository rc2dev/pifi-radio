#class RcRadio
  class Player
    attr_reader :playing, :song, :local, :vol, :elapsed, :length

    def initialize(streams)
      @streams = streams

      # Connect to MPD
      @mpd = MPD.new '127.0.0.1', 6600, { callbacks: true }
      @mpd.connect

      # Check if playlist exists, create it
      check_pl

      # Callbacks
      @mpd.on :state, &method(:set_state)
      @mpd.on :time, &method(:set_time)
      @mpd.on :song, &method(:set_song)
      @mpd.on :volume, &method(:set_vol)
    end


    def play
      ! @playing ? @mpd.play : nil
    end
    def stop
      @playing ? @mpd.stop : nil
    end
    def next
      @mpd.next
    end
    def vdown
      @mpd.send_command("volume -5")
    end
    def vup
      @mpd.send_command("volume +5")
    end

    def play_url(url)
  		@mpd.clear
  		@mpd.add url
  		@mpd.play
  	end

    def play_random
  		# Se está tocando arquivo local, tocar o próximo
  		if @playing && @local
  			self.next
  		# Se não está tocando arquivo local, carregar toda a
  		# biblioteca e começa a tocar em modo aleatório
  		else
  			@mpd.clear
  			pl = @mpd.playlists.find { |p| p.name == "dbpl" }
  			pl.load
  			@mpd.random= true
  			@mpd.crossfade= 5
  			@mpd.play
  		end
    end

    # Update/create DB and playlist
    def update_db
      @mpd.update

      # Workaround to wait for database update
      sleep 10

      # Update/create playlist with whole DB
      pl = @mpd.playlists.find { |p| p.name == "dbpl" }
      if pl.nil?
        @mpd.save "dbpl"
        pl = @mpd.playlists.find { |p| p.name == "dbpl" }
      end
      pl.clear
      for song in @mpd.songs
        pl.add song
      end
    end


    private
    def set_state(state)
      @playing = state == :play
    end

    def set_time(elapsed, total)
      @elapsed, @length = elapsed, total
    end

    def set_song(song)
      if song.nil?
        @song = ""
        @local = false
      elsif ! song.file.include?("://")
        @song = local_name(song)
        @local = true
      else
        @song = @streams.key(song.file) || song.file
        @local = false
      end
    end

    def set_vol(vol)
     @vol = vol.to_s + "%"
    end

    def local_name(song)
  		if song.artist.nil? || song.title.nil?
  			"Música local"
  		else
  			name = song.artist + " - " + song.title
  			name.length > 45 ? name[0..42] + "..." : name
  		end
  	end

    # Check for DB playlist
    def check_pl
      pl = @mpd.playlists.find { |p| p.name == "dbpl" }
      if pl.nil?
     	  update_db
      end
    end
  end
#end
