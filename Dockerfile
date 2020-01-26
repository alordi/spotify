FROM node:slim

ENV ID1="id1" \
    ID2="id2" \
    CALLBACK="https://stats.austinsapp.com/callback"

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
        -subj "/C=US/ST=Pennsylvania/L=Lansdale/O=Private/OU=IT/CN=austinsapp.com"

EXPOSE 443

SHELL [ "bash", "-c" ]

CMD ["node", "index.js"]

