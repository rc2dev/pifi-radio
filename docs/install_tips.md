# Advanced installation tips

Here I list some tips for more advanced PiFi deployments.

## Running on port 80

You may want to access PiFi without typing a port, as in `http://pi.local` or `http://pifi.local`.

For this, you can install a web server, such as Nginx, Apache or Lighttpd, and set up a reverse proxy. As the precise configuration varies for each of them, please check their documentation.

## Serving static resources from your web server

If you set your web server to reverse proxy PiFi, you may also use it to serve PiFi static assets. This possibly brings performance gains.

On PiFi configuration, set `serve_static` to false.

On your web server, the exact steps depend on your configuration. You will probably need to set the root of the virtual server to PiFi's static assets directory. This is `${PIFI_DIR}/lib/pifi/public`. Refer to the next section for tips on how to find your `${PIFI_DIR}` and to the documentation of your web server for details.

## Finding PiFi directory

This largely depends on how you installed PiFi and your distro.

- If you installed it with `sudo gem install pifi` on Raspbian, this should be `/var/lib/gems/*/gems/pifi-*`.
- If you installed with the `gem` command, run `gem environment` and check the paths below "Gem paths".
- If you are completely lost, you can always run `find / -iname "pifi*" 2>/dev/null`

Note that the path contains both the Ruby version and the PiFi version. Thus, it can change whenever you update one of them. Be sure to edit your configuration accordingly.

## Configuring Thin directly

The `pifi` command exposes most Rack CLI options, but you may want to access more advanced configurations from Thin (the application server PiFi uses).

To achieve this, instead of invoking `pifi`, run `thin` and pass PiFi's `config.ru` and the `-e production` flag. The former is located at `${PIFI_DIR}/config.ru`.

For example, if you want to run PiFi on a socket instead of a port:

```
$ thin start -R ${PIFI_DIR}/config.ru -e production --socket /var/run/pifi/pifi.sock
```
