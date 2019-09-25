require "ruby-mpd"

class Player
	attr_reader :playing, :title, :artist, :local, :elapsed, :length, :vol, :con_mpd

	CROSSFADE = 5
	DEFAULT_TITLE_LOCAL = "Music"
	DEFAULT_TITLE_STREAM = "Streaming"


	def initialize(host, port, password, streams)
		@streams = streams
		@mpd = MPD.new(host, port, { callbacks: true })

		@mpd.connect
		@mpd.password(password) unless password.empty?

		# Callbacks
		@mpd.on(:state, &method(:set_state))
		@mpd.on(:time, &method(:set_time))
		@mpd.on(:song, &method(:set_song))
		@mpd.on(:volume, &method(:set_vol))
		@mpd.on(:connection, &method(:set_con_mpd))
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
		# Check delta
		raise ArgumentError, "'delta' should be a string" unless delta.kind_of?(String)
		raise ArgumentError, "Invalid 'delta'" unless delta =~ /^[+-]\d{1,2}$/
		# We get @vol=-1 when PulseAudio sink is closed
		raise VolNaError if @vol < 0

		@mpd.send_command("volume", delta);
		# This is more up-to-date than @vol
		@mpd.volume
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
		# If not playing local music, load all the
		# music and start playing in shuffle mode
		else
			@mpd.clear
			@mpd.add("/")
			@mpd.random=(true)
			@mpd.crossfade=(CROSSFADE)
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
		# Sometimes it passes no arguments, instead of MPD::Song object
		if args.length == 0
			@local = false
			@title = ""            
			@artist = ""
		else
			song = args[0]
			if song.file.include?("://")
				set_song_stream(song)
			else
				set_song_local(song)
			end
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
		@vol = vol
	end

	def set_con_mpd(con_mpd)
		@con_mpd = con_mpd
	end
end


class VolNaError < StandardError

end
