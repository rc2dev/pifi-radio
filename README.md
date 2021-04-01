# PiFi Radio

<p align="center">
  <img src="https://raw.githubusercontent.com/rccavalcanti/pifi-radio/master/docs/icon/radio-original.svg?sanitize=true" width=250>
</p>
<p align="center">PiFi Radio: A MPD web client to listen to radio.</p>

## Table of contents

- [Meet PiFi Radio](#meet-pifi-radio)
  - [Some features](#some-features)
  - [Demo](#demo)
- [Installation](#installation)
- [Updating](#updating)
- [Configuration](#configuration)
  - [List of streams](#list-of-streams)
  - [PiFi configuration](#pifi-configuration)
- [Usage](#usage)
- [Help me translate](#help-me-translate)
- [Some projects using PiFi Radio](#some-projects-using-pifi-radio)
- [Credits](#credits)
- [Buy me a coffee](#buy-me-a-coffee)
- [License](#license)

## Meet PiFi Radio

PiFi Radio is a MPD web client to listen to radio.

If you have no idea what this means... You install it on a device such as the Raspberry Pi or anything with a speaker. Then, you open your browser from anywhere (e.g. your phone) to control it and listen to your favorite radio stations.

PiFi is an interface for MPD, so it has some advantages compared to other solutions, e.g. bluetooth or AirPlay. One of them is that the playback is completely independent from your phone. So you can continue to use it normally, play a video, lose connection or even turn it off, and your Pi will still continue to play the radio.

[I started this project in early 2017. At that time, I wanted to configure Raspbian so my parents could listen to radio with ease, but couldn't find any good solution to it.](https://rafaelc.org/blog/the-motivation-for-pifi-radio/)

## Some features

- Responsive interface for phones, tablets and desktops.
- Display stations clearly. No URLs or weird names.
- Dark and light themes.
- Easily search your radios.
- Centralized list of stations. You get the same radios on every device.
- Make some radios to be offered only to certain IPs. A use case for this is if there are tons of stations that only you listen and you don't want to pollute everyone else's list.
- Organize your radios by categories.
- Streaming URLs can be pasted directly from your web browser. Useful if you want to listen to a radio that was not previously added to the list.
- Multi-language.
- Usable by multiple people at the same time.

## Demo

![](docs/demo/mobile-01.png)

![](docs/demo/desktop-01.png)

![](docs/demo/desktop-02.png)

## Installation

While PiFi was imagined for the Pi, it should run on any computer with Ruby and MPD.

[Check the installation guide](INSTALL.md).

## Updating

Run:

```
$ sudo gem update pifi --no-document
```

Restart PiFi. If you are using the systemd service, this is done by:

```
$ sudo systemctl restart pifi
```

## Configuration

### List of streams

PiFi needs a list of the radios you want to listen. [A example is available here](docs/streams.json.sample).

The list is read by default from `/etc/pifi/streams.json`. You can change this path [creating a configuration file](#pifi-configuration).

To keep it simple, the list of streams is just a JSON file with key-value pairs, where the key is the station name, and the value is the streaming URL. For example:

    {
         "Radio 1": "https://example.com/radio1",
         "Radio 2": "https://example.com/radio"
    }

If you want to arrange the stations in categories, add a pair with the category name as the key and empty value, as shown below. This will add the headers "Talk radio" and "Classical" above each group of stations, [such as "Spain" and "Christmas" in the demo](#demo).

    {
         "Talk radio": "",
         "Radio 1": "https://example.com/radio1",
         "Radio 2": "https://example.com/radio2"

         "Classical": "",
         "Radio 3": "https://example.com/radio3",
         "Radio 4": "https://example.com/radio4"
    }

### PiFi configuration

It's now completely optional to have a configuration file for PiFi. You only need one if you want something different from the defaults.

The path is `/etc/pifi/config.json` and these are the options:

| Key                 | Default                    | Description                                                                                                       |
| ------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `mpd_host`          | `"127.0.0.1"`              | MPD host.                                                                                                         |
| `mpd_port`          | `6600`                     | MPD port.                                                                                                         |
| `mpd_password`      | `""` (none)                | MPD password.                                                                                                     |
| `streams_path`      | `"/etc/pifi/streams.json"` | Path to the JSON file containing the streams.                                                                     |
| `streams_path_priv` | `""` (none)                | Path to JSON file containing additional streams. These will be shown only to the devices listed on `special_ips`. |
| `special_ips`       | `[]` (none)                | The IPs of the devices to show additional streams. Example: `["10.0.0.1", "10.0.0.2"]`                            |
| `serve_static`      | `true`                     | If we should serve static resources. Set it to `false` if your web server is already doing it.                    |

If you want to change any of these options, download the sample file and edit it to your needs:

```
$ sudo mkdir -p /etc/pifi
$ sudo wget https://raw.githubusercontent.com/rccavalcanti/pifi-radio/master/docs/config.json.sample -O /etc/pifi/config.json
$ sudo -e /etc/pifi/config.json
```

## Usage

PiFi can be run:

- With the `pifi` command. Check `pifi -h` for the options available.
- [If you installed the systemd service](INSTALL.md#running-at-system-boot-and-as-other-user), with `sudo systemctl start pifi`.
- At boot enabling the systemd service with `sudo systemctl enable pifi`.

On your mobile browser, I suggest you add PiFi Radio to your home screen, for easier access.

## Help me translate

You can help me adding a new language to PiFi or improving an existing translation. [The translation files are placed here.](https://github.com/rccavalcanti/pifi-radio/tree/master/frontend/public/locales)

### Improving an existing translation

The default language for PiFi is English, so you should use it as a reference.

1. Open [the translation file](https://github.com/rccavalcanti/pifi-radio/tree/master/frontend/public/locales) and [the English file](https://github.com/rccavalcanti/pifi-radio/blob/master/frontend/public/locales/en-US/translation.json).
2. Fill empty strings and fix any bad translations.
3. Send a pull request.

### Adding a new language

1. Copy the `en` folder, renaming it to the new language code (e.g. `es-ES`).
2. On `translation.json`, translate the strings. If you aren't sure of some, please make them empty.
3. Send a pull request.

## Some projects using PiFi Radio

- [Internet Radio from broken Bose Dockstation](https://piamble.wordpress.com/2021/01/30/internet-radio-from-broken-bose-dockstation-part-1/)

## Credits

- de-de: [cedege](https://github.com/cedege)
- fr-fr: [Florent Segouin](https://github.com/fsegouin), [Francis Chavanon](https://github.com/rimeno)
- pl-pl: [Struart88](https://github.com/Struart88)
- nl-nl: [Heimen Stoffels](https://github.com/Vistaus)

- Icon made by [iconixar](https://www.flaticon.com/authors/iconixar) from [www.flaticon.com](https://www.flaticon.com/), licensed by [Flaticon Basic License](docs/icon/license.pdf).

## Buy me a coffee

If you find PiFi useful, you can show your support here:

<a href="https://rafaelc.org/coffee" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" width="200" ></a>

## License

Licensed under [GPLv3](LICENSE)

Copyright (C) 2017-2020 [Rafael Cavalcanti](https://rafaelc.org/)
