class Player
	attr_reader :playing, :title, :artist, :local, :elapsed, :length, :vol, :con_mpd

	VOL_LOW = 0
	VOL_UP = 100

	def initialize(host, port, streams)
		@streams = streams
		@mpd = MPD.new(host, port, { callbacks: true })

		@mpd.connect

		# Callbacks
		@mpd.on(:state, &method(:set_state))
		@mpd.on(:time, &method(:set_time))
		@mpd.on(:song, &method(:set_song))
		@mpd.on(:volume, &method(:set_vol))
		@mpd.on(:connection, &method(:set_con_mpd))
	end


	def play
		# Quicker than callback
		@playing = true if @mpd.play
	end

	def stop
		# Quicker than callback
		@playing = false if @mpd.stop
	end

	def vol_ch(inc)
		# We get @vol=-1 when PulseAudio sink is closed
		raise VolNaError if @vol < 0

		new_vol = @vol + inc
		new_vol =
			if new_vol < VOL_LOW then VOL_LOW
			elsif new_vol > VOL_UP then VOL_UP
			else new_vol
			end

		# Quicker than callback, minimizes race conditions
		@vol = @mpd.volume=(new_vol)
	end

	def play_radios(names)
		raise ArgumentError, "Expected an array" unless names.kind_of?(Array)
		raise ArgumentError, "Received an empty array" if names.empty?

		urls = []
		names.each do |name|
			url = @streams[name]
			# nil: key not found; empty: it's a radio category
			raise ArgumentError, "Invalid radio name: #{name}" if url.nil? or url.empty?

			urls << url
		end

		play_urls(urls)
	end

	def play_urls(urls)
		raise ArgumentError, "'urls' should be an array" unless urls.kind_of?(Array)
		raise ArgumentError, "'urls' can't be an empty array" if urls.empty?

		# Perform simple check on urls array
		urls.each do |url|
			raise ArgumentError, "Non-String element in 'urls'" unless url.kind_of?(String)
			raise ArgumentError, "Empty element in 'urls'" if url.empty?
		end

		# Send the URLs to MPD and start playback
		@mpd.clear
		urls.each { |url| @mpd.add(url) }
		@mpd.random=(false)
		@mpd.play
	end

	def play_random
		# If playing local music, play next
		if @playing && @local
			@mpd.next
		# If not playing local music, load all the library
		# and start to play in shuffle mode
		else
			@mpd.clear
			@mpd.add("/")
			@mpd.random=(true)
			@mpd.crossfade=(5)
			@mpd.play
		end
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
			@local = false        # MPD::Song object
			@title = ""            
			@artist = ""
		else
			song = args[0]
			if song.file.include?("://")
				@local = false
				@title = @streams.key(song.file) || "Streaming"
				@artist = ""
			else
				@local = true
				if song.artist.nil? || song.title.nil?
					@title = "Music"
					@artist = ""
				else
					@title = song.title
					@artist = song.artist
				end
			end
		end
	end

	def set_vol(vol)
		@vol = vol
	end

	def set_con_mpd(con_mpd)
		@con_mpd = con_mpd
	end
end


class VolNaError < StandardError

end