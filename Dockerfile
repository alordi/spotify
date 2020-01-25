FROM node:slim

ARG DOMAIN="localhost"

ENV ID1="id1" \
    ID2="id2" \
    CALLBACK="https://${DOMAIN}:8888/callback"

COPY . /app/

WORKDIR /app

RUN apt update -y \
    && apt install -y openssl \
    && npm install \
    && cd client \
    && npm install \
    && npm run build     

RUN cd /app \
    && openssl req -nodes -new -x509 \
        -newkey rsa:2048  \
        -keyout server.key -out server.cert -days 10 \
        -subj "/C=US/ST=Pennsylvania/L=Lansdale/O=Private/OU=IT/CN=${DOMAIN}"


EXPOSE 8888

CMD ["node", "index.js"]
