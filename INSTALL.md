# Installation guide

1. Install Ruby and MPD.

On Raspbian:

```
$ sudo apt install ruby-full mpd
```

2. _If you haven't yet,_ configure MPD, start and enable it:

```
$ sudo -e /etc/mpd.conf
$ sudo systemctl start mpd && sudo systemctl enable mpd
```

3. Install PiFi:

```
$ sudo gem install pifi --no-ri --no-rdoc
```

4. To run PiFi, you'll need a list of the radios you want to listen.

Paste this for now:

```
sudo wget https://raw.githubusercontent.com/rccavalcanti/pifi-radio/master/docs/pifi_streams.json -O /etc/pifi_streams.json
```

Later, you can edit that JSON file [as described here](README.md#list-of-streams).

5. If the MPD server is in other host or a non-default port, you'll need to place a configuration file.

Download a sample and edit [following the documentation](README.md#pifi-configuration):

```
$ sudo wget https://raw.githubusercontent.com/rccavalcanti/pifi-radio/master/docs/pifi.json.sample -O /etc/pifi.json
$ sudo -e /etc/pifi.json
```

**Done!** You can now run PiFi with `pifi` and reach it at `http://DEVICE_IP:3000`. Type `pifi -h` to check the options available.

**Suggestion:** On your mobile browser, tap to add PiFi Radio to your home screen, for easier access.

## Running at system boot and as other user

It makes sense to run PiFi as a less-privileged user (such as `www-data`). You may also want it to autostart on boot. If that's the case, follow these two steps.

1. Download the systemd service and edit it to your needs.

```
$ sudo wget https://raw.githubusercontent.com/rccavalcanti/pifi-radio/master/docs/pifi.service.sample -O /etc/systemd/system/pifi.service
$ sudo -e /etc/systemd/system/pifi.service
```

2. Start and enable it:

```
$ sudo systemctl start pifi
$ sudo systemctl enable pifi
```
