# Installation guide

This guide describes one way of deploying PiFi Radio targeting Linux systems.


## Quick start

1. Install Ruby.

On Raspbian:
```
$ sudo apt install ruby-full
```

2. You also (obviously) need MPD up and running, if you haven't it yet.

Installing on Raspbian:
```
$ sudo apt install mpd
```

Configure, start and enable it:
```
$ sudo -e /etc/mpd.conf
$ sudo systemctl start mpd && sudo systemctl enable mpd
```

3. Install PiFi:

```
$ sudo gem install pifi
```

4. Write a JSON file with your list of streams, [as described here](README.md#list-of-streams).


5. Copy the PiFi configuration file to `/etc` and edit it to your needs.

```
$ sudo wget https://github.com/rccavalcanti/pifi-radio/blob/master/docs/pifi.json.sample -O /etc/pifi.json
$ sudo -e /etc/pifi.json
```

[Documentation about this file is on README.](README.md#pifi-configuration)


6. Run PiFi Radio.

```
$ pifi
```

If everything went well, you should be able to reach it at http://DEVICE_IP:3000.

You can type `pifi -h` to check the options available.


*Suggestion:* On your mobile browser, tap to add PiFi Radio to your home screen, for easier access.


## Running at system boot and as other user

If you want PiFi to autostart at boot and run as a less-privileged user (such as `www-data`):

1. Download the systemd service and edit it to your needs.

```
$ sudo https://github.com/rccavalcanti/pifi-radio/blob/master/docs/pifi.service.sample -O /etc/systemd/system/pifi.service
$ sudo -e /etc/systemd/system/pifi.service
```

2. Start and enable it:

```
$ sudo systemctl start pifi
$ sudo systemctl enable pifi
```
