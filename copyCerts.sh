#!/bin/bash

cp /etc/letsencrypt/live/${DOMAIN}/* /certs
chown app:app /certs/*

echo "Certs Updated."

exit 0
