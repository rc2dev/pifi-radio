# Installation guide

There are many ways to deploy PiFi. This guide describes one of them.

This document targets Linux, but PiFi Radio should work on any system running Ruby and MPD.


## Quick install

1. Clone this repo.

```
$ cd
$ git clone https://github.com/rccavalcanti/pifi-radio.git
```

2. Install Ruby. You can use RVM, if you wish. On Raspbian:
```
$ sudo apt install ruby-full
```

3. As PiFi Radio is a MPD client, you'll have to install, configure and start MPD.

Installing on Raspbian:
```
$ sudo apt install mpd
```

After configuring, start and enable MPD with:
```
$ sudo systemctl start mpd && sudo systemctl enable mpd
```

4. Change directory to this repo. Install Bundler and the needed gems:

```
$ cd ~/pifi-radio
$ gem install bundler
$ bundle install --deployment
```

5. Write a JSON file with your list of streams, [as described here](README.md#list-of-streams).

6. Copy PiFi configuration file to `/etc` and edit the settings according to your needs.

```
$ sudo cp $HOME/pifi-radio/pifi-radio.conf.sample /etc/pifi-radio.conf
```

[Info about that file is on README.](README.md#pifi-configuration)


7. Run PiFi Radio.

```
$ cd ~/pifi-radio
$ bundle exec rackup
```

If everything went well, you should be able to reach it at http://localhost:9292/.


## Improving the deployment

1. Move PiFi Radio to whatever path you find convenient, and deal with the permissions. For example:

```
$ sudo mv ~/pifi-radio /srv/
$ sudo chgrp -R www-data /srv/pifi-radio
```

2. Create a systemd unit to start PiFi Radio as `www-data`.

3. *(Optional)* Set up your webserver to serve PiFi static resources.
