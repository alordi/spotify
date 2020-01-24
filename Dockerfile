FROM node:slim

ENV ID1="id1" \
    ID2="id2" \
    CALLBACK="http://localhost:8888/callback"

COPY . /app/

WORKDIR /app

RUN npm install \
    && cd client \
    && npm install \
    && npm run build     

EXPOSE 8888

CMD ["node", "index.js"]
