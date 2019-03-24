# Installation guide

There are many ways to deploy PiFi Radio. This guide has the goal to help you get PiFi up and running as quick and easy as possible. Then, we'll list some suggestions for a more robust installation.

This document targets Linux, but the app should work on any system running Ruby and MPD.


## Quick basic guide

1. Clone this repo.

```
$ cd
$ git clone https://github.com/rccavalcanti/pifi-radio.git
```

2. Install Ruby. On Raspbian:
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

4. Change directory to this repo. Install Bundle and the needed gems:

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

Note this, as previously stated, is a very basic installation. Right now, your app server is running with the same privileges as your user, which may or may not be wise in your particular case.

I encourage you to take a look at the suggestions below for a better, more robust installation.


## Suggestions for more advanced deployment

* Set up a systemd service for Thin and run it as a different user
* Set up your webserver to serve PiFi static resources
