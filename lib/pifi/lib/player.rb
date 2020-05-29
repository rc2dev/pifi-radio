require "ruby-mpd"

module PiFi
  class Player
    class VolNaError < StandardError
      def message
        "Volume is not available"
      end
    end

    CROSSFADE = 5
    DEFAULT_TITLE_LOCAL = "Music"
    DEFAULT_TITLE_STREAM = "Streaming"
    DEFAULT_HOST = "localhost"
    DEFAULT_PORT = "6600"

    def initialize(streams, host=DEFAULT_HOST, port=DEFAULT_PORT, password=nil)
      @streams = streams
      @mpd = MPD.new(host, port, { callbacks: true })
      @mpd.connect
      @mpd.password(password) unless password.to_s.empty?

      define_callbacks
    end

    def state
      { playing: @playing,
        title: @title,
        artist: @artist,
        local: @local,
        elapsed: @elapsed,
        length: @length,
        vol: @vol,
        con_mpd: @con_mpd }
    end

    def play
      # Assigning is quicker than callback
      @playing = true if @mpd.play
    end

    def stop
      # Assigning is quicker than callback
      @playing = false if @mpd.stop
    end

    def change_vol(delta)
      raise ArgumentError, "Invalid argument" unless delta =~ /^[+-]\d{1,2}$/
      raise VolNaError if @vol.nil?

      @mpd.send_command("volume", delta);
      # This is more up-to-date than @vol
      @mpd.volume
    end

    def play_radios(*names)
      raise ArgumentError, "Argument required" if names.empty?

      urls = []
      names.each do |name|
        url = @streams[name]
        # nil: key not found; empty: it's a radio category
        raise ArgumentError, "Invalid radio name: #{name}" if url.nil? || url.empty?

        urls << url
      end

      play_urls(*urls)
    end

    def play_urls(*urls)
      raise ArgumentError, "Argument required" if urls.empty?
      raise ArgumentError, "Empty url given" if urls.any?(&:empty?)

      @mpd.clear
      urls.each { |url| @mpd.add(url) }
      @mpd.random=(false)
      @mpd.play
    end

    def play_random
      if @playing && @local
        @mpd.next
      else
        @mpd.clear
        @mpd.add("/")
        @mpd.random=(true)
        @mpd.crossfade=(CROSSFADE)
        @mpd.play
      end
    end


    private

    def define_callbacks
      @mpd.on(:state, &method(:set_state))
      @mpd.on(:time, &method(:set_time))
      @mpd.on(:song, &method(:set_song))
      @mpd.on(:volume, &method(:set_vol))
      @mpd.on(:connection, &method(:set_con_mpd))
    end

    def set_state(state)
      @playing = (state == :play)
    end

    def set_time(elapsed, length)
      @elapsed = elapsed
      @length = length
    end

    def set_song(*args)
      # Sometimes we receive no arguments, instead of MPD::Song object
      if args.length == 0
        @local = false
        @title = ""
        @artist = ""
        return
      end

      song = args[0]
      if song.file.include?("://")
        set_song_stream(song)
      else
        set_song_local(song)
      end
    end

    def set_song_local(song)
      @local = true
      if song.artist.nil? || song.title.nil?
        @title = DEFAULT_TITLE_LOCAL
        @artist = ""
      else
        @title = song.title
        @artist = song.artist
      end
    end

    def set_song_stream(song)
      @local = false
      @title = @streams.key(song.file) || DEFAULT_TITLE_STREAM
      @artist = ""
    end

    def set_vol(vol)
      # We get @vol=-1 when PulseAudio sink is closed and @vol=nil when MPD output
      # is misconfigured. Let's make it all nil.
      @vol = vol < 0 ? nil : vol
    end

    def set_con_mpd(con_mpd)
      @con_mpd = con_mpd
    end
  end
end
