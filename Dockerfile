FROM node:slim

ENV ID1="id1" \
    ID2="id2" \
    DOMAIN="stats.austinsapp.com"

COPY . /app/

WORKDIR /app

RUN apt update -y \
    && useradd -M -s /sbin/nologin app \
    && npm install \
    && cd client \
    && npm install \
    && npm run build \
    && chown -R app:app /app \
    && mkdir /certs \
    && chown app:app /certs \
    && chmod +x /app/copyCerts.sh

EXPOSE 8443

USER app

SHELL [ "bash", "-c" ]

CMD ["node", "index.js"]

