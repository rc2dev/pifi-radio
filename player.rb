#class RcRadio
  class Player
    attr_reader :playing, :song, :local, :elapsed, :length

    def initialize(streams)
      @streams = streams

      # Connect to MPD
      @mpd = MPD.new '127.0.0.1', 6600, { callbacks: true }
      @mpd.connect

      # Check if playlist exists, create it if not
      check_pl

      # Callbacks
      @mpd.on :state, &method(:set_state)
      @mpd.on :time, &method(:set_time)
      @mpd.on :song, &method(:set_song)
      @mpd.on :volume, &method(:set_vol)
    end


    def play
      if @mpd.play
        @playing = true   # Quicker than callback, good for following API call
      end
    end
    def stop
      if @mpd.stop
        @playing = false  # Quicker than callback, good for following API call
      end
    end
    def vch(inc)
      value = @vol + inc
      if value > 100
        value = 100
      elsif value < 0
        value = 0
      end
      @vol = @mpd.volume=(value)  # Writing to @vol avoids race conditions
    end

    def play_url(url)
  		@mpd.clear
  		@mpd.add(url)
  		@mpd.play
  	end

    def play_random
  		# Se está tocando arquivo local, tocar o próximo
  		if @playing && @local
  			@mpd.next
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

    def set_time(elapsed, length)
      @elapsed = elapsed
      @length = length
    end

    def set_song(*args)
      if args.length == 0     # Sometimes it passes no arguments, instead of
        @song = ""            # MPD::Song object
        @local = false
      else
        song = args[0]
        file = song.file
        if file.include?("://")
          @song = @streams.key(file) || file
          @local = false
        else
          @song = local_name(song)
          @local = true
        end
      end
    end

    def set_vol(vol)
     @vol = vol
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
