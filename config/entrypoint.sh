#!/usr/bin/env sh
set -eu

envsubst '${API_HOST} ${API_PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

node /usr/share/nginx/html/index.js &

exec "$@"