# Installation guide

1. Install Ruby and MPD.

On Raspberry Pi OS:

```
$ sudo apt install ruby-full mpd
```

2. Start and enable MPD:

```
$ sudo systemctl enable --now mpd
```

_In the case you need to configure MPD, [check its documentation](https://www.musicpd.org/doc/html/user.html#configuration)._

3. Install PiFi:

```
$ sudo gem install pifi --no-document
```

4. You'll need a list of radios at `/etc/pifi/streams.json`. Paste this for now:

```
$ sudo mkdir -p /etc/pifi
$ sudo wget https://raw.githubusercontent.com/rccavalcanti/pifi-radio/master/docs/streams.json.sample -O /etc/pifi/streams.json
```

_Later, you can edit that list [as described here](README.md#list-of-streams)._

5. If the MPD server is on another host or a non-default port, you'll need a configuration file.

Download a sample and edit [following the documentation](README.md#pifi-configuration):

```
$ sudo wget https://raw.githubusercontent.com/rccavalcanti/pifi-radio/master/docs/config.json.sample -O /etc/pifi/config.json
$ sudo -e /etc/pifi/config.json
```

**Done!** You can now run PiFi with `pifi` and reach it at `http://DEVICE_IP:3000`.

## Running at system boot and as other user

It makes sense to run PiFi as a different user, such as `www-data`. You may also want it to autostart on boot. For that you can use a systemd service.

1. Download the service sample.

```
$ sudo wget https://raw.githubusercontent.com/rccavalcanti/pifi-radio/master/docs/pifi.service.sample -O /etc/systemd/system/pifi.service
```

2. Make any changes relevant to your system.

For example, if you leave `User` and `Group` as they are (`www-data`), make sure that both exist in your system.

```
$ sudo -e /etc/systemd/system/pifi.service
```

**Done!** Now you can start PiFi with `sudo systemctl start pifi`. For running at boot, enter `sudo systemctl enable pifi`.

If this doesn't work, `journalctl -u pifi` should tell you what to fix.

## Advanced deployments

If you need something different from this, [check this document](docs/install_tips.md).
