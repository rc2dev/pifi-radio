class Player
  attr_reader :playing, :song, :local, :elapsed, :length

  def initialize(host, streams)
    @streams = streams

    # Connect to MPD
    @mpd = MPD.new host, 6600, { callbacks: true }
    @mpd.connect

    # Get playlist if exists, create it if not
    @pl = get_pl
    update_pl if @pl.nil?

    # Callbacks
    @mpd.on :state, &method(:set_state)
    @mpd.on :time, &method(:set_time)
    @mpd.on :song, &method(:set_song)
    @mpd.on :volume, &method(:set_vol)
  end


  def play
    # Quicker than callback, good for following API call
    @playing = true if @mpd.play
  end

  def stop
    # Quicker than callback, good for following API call
    @playing = false if @mpd.stop
  end

  def vol_ch(inc)
    new_vol = @vol + inc
    new_vol =
      if new_vol < 0 then 0
      elsif new_vol > 100 then 100
      else new_vol
      end

    @vol = @mpd.volume=(new_vol)  # Writing to @vol avoids race conditions
  end

  def play_stream(type, value)
    url =
      case type
      when "url" then value
      when "name" then @streams[value]
      else raise ArgumentError, "Invalid 'type' value."
      end

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
      begin
			  @pl.load
      rescue
        @pl = get_pl
        update_pl
        @pl.load
      end
			@mpd.random=(true)
			@mpd.crossfade=(5)
			@mpd.play
		end
  end

  # Update/create playlist
  def update_pl
    # Update DB
    @mpd.update
    # Workaround to wait for database update
    sleep 10

    # Update/create playlist
    if @pl.nil?
      @mpd.save "dbpl"
      @pl = get_pl
    end
    @pl.clear
    @mpd.songs.each { |song| @pl.add(song) }
  end


  private
  def set_state(state)
    @playing = (state == :play)
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
        @song = @streams.key(file) || "Streaming"
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
      # If larger than 45, make it 45! 45 - 3 (reticences) = 42. 0-41 is 42.
			name.length > 45 ? name[0..41] + "..." : name
		end
	end

  def get_pl
    @mpd.playlists.find { |p| p.name == "dbpl" }
  end
end
