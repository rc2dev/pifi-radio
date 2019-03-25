# Installation guide

This guide describes one way of deploying PiFi Radio targeting Linux systems.


## Quick start

1. Clone this repo.

```
$ git clone https://github.com/rccavalcanti/pifi-radio.git ~/pifi-radio
```


2. Install Ruby.

On Raspbian:
```
$ sudo apt install ruby-full
```


3. You also (obviously) need MPD up and running, if you haven't it yet.

Installing on Raspbian:
```
$ sudo apt install mpd
```

Configure, start and enable it:
```
$ sudo -e /etc/mpd.conf
$ sudo systemctl start mpd && sudo systemctl enable mpd
```


4. Change directory to this repo. Install Bundler and the needed gems:

```
$ cd ~/pifi-radio
$ sudo gem install bundler
$ bundle install --deployment
```


5. Write a JSON file with your list of streams, [as described here](README.md#list-of-streams).


6. Copy the PiFi configuration file to `/etc` and edit it to your needs.

```
$ sudo cp ~/pifi-radio/pifi-radio.conf.sample /etc/pifi-radio.conf
$ sudo -e /etc/pifi-radio.conf
```

[Documentation about this file is on README.](README.md#pifi-configuration)


7. Run PiFi Radio.

```
$ cd ~/pifi-radio
$ bundle exec rackup --host 0.0.0.0
```

If everything went well, you should be able to reach it at http://DEVICE_IP:9292.



## Improving the deployment

1. Move PiFi Radio to your path of choice, and deal with the permissions. For example:

```
$ sudo mv ~/pifi-radio /srv/
$ sudo chgrp -R www-data /srv/pifi-radio
```


2. Install the systemd service and edit it to your needs.

```
$ sudo cp /path/to/pifi-radio/pifi-radio.service.sample /etc/systemd/system/pifi-radio.service
$ sudo -e pifi-radio.service
```

Change `WorkingDirectory` to your PiFi path and `--port 3000` to whatever port you want.

Start and enable it:

```
$ sudo systemctl start pifi-radio.service && sudo systemctl enable pifi-radio.service
```

Now PiFi runs beautifully on your system boot.



3. *(Optional)* Set up your webserver to serve PiFi static resources.

Configure your webserver accordingly and set `serve_static` on [PiFi configuration](README.md#pifi-configuration) to `false`.

