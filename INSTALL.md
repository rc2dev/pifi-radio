# Installation guide

This app should work on any system running Ruby and MPD, but this guide is designed for Linux.

There are many ways in which you could deploy PiFi Radio. I'll guide you through a quick and simple way of running it and then give you some suggestions for a  more robust deployment.



## Quick and simple guide

1. Clone this repo.

```
$ cd
$ git clone https://github.com/rccavalcanti/pifi-radio.git
```

2. Install Ruby. For Raspbian:

```
$ sudo apt install ruby-full
```

3. As PiFi Radio is a MPD client, you'll have to install, configure and start MPD. On Raspbian:

```
$ sudo apt install mpd
```

After configuring it, start and enable it:

```
$ sudo systemctl start mpd && sudo systemctl enable mpd
```

4. Change directory to this repo. Install Bundle and the needed gems:

```
$ cd ~/pifi-radio
$ gem install bundle
$ bundle install
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
$ rackup
```

If everything went well, you should be able to reach it at http://localhost:??


## Suggestions for more advanced deployment

* Use RVM instead of the package manager to install Ruby
* On RVM, make use of the separate gemset for PiFi Radio
* Use a production app server, like Thin. 
* Set up a systemd service for running Thin.
* Set up your webserver to serve PiFi static resources.
