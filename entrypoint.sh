#!/usr/bin/env bash

function replace_env {
  sed -i "s|\${$1}|${!1}|g" $2
}

npm run scrape
npm run build
replace_env "PORT" "/etc/nginx/sites-enabled/default"
nginx -g 'daemon off;'
