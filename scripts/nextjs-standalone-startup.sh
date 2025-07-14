#!/bin/bash
ls -la
cp .next/routes-manifest.orig.json .next/routes-manifest.json
# TODO check that BACKEND_URL is set and a url
# https://linuxhint.com/environment-variables-sed-command/
sed -i "s#/__BACKEND_URL__#${BACKEND_URL}#g" .next/routes-manifest.json
exec node server.js