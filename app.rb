require 'sinatra'
require 'ruby-mpd'
require 'json'
load 'methods.rb'

# Configuration
configure do
	set :bind, '0.0.0.0'
end

# Connect to MPD
mpd = MPD.new '127.0.0.1', 6600
mpd.connect

# Check for DB playlist
pl = mpd.playlists.find { |p| p.name == "dbpl" }
if pl.nil?
    update_db(mpd)
end

# Load JSON
streams = load_streams()

# Routes
get '/' do
	  hostname = `uname -n`.chop.capitalize
    erb :main, locals: {hostname: hostname, streams: streams}
end

get '/api/:cmd' do
    cmd = params[:cmd]
    case cmd
    when "play"
		    mpd.play
    when "stop"
		    mpd.stop
    when "vdown"
		    mpd.send_command("volume -5")
    when "vup"
        mpd.send_command("volume +5")
    when "vol" # tried as return value for vdown/vup, but seemed slower
        mpd.volume.to_s + '%'
    when "state"
        { :playing => mpd.playing?, :name => get_name(mpd, streams) }.to_json
    when "play-url"
        play_url(params, mpd)
    when "play-random"
        play_random(mpd)
    end
end

get '/update' do
    streams = load_streams()
    update_db(mpd)
    "<a href=\"\">DB e playlist DB atualizados, streams recarregados.</a>"
end

error do
    '<h3>Desculpe, ocorreu um erro.</h3><p>Mensagem: ' + \
        env['sinatra.error'].message + '</p><a href="/"><h2>Voltar</h2></a>'
end
