# Austin's Spotify App

# To Run Dev Builds

### Setup the VUE Client / Frontend

In the client directory:
* cd client
* npm install
* npm run build

### Setup the Express Server / Backend

In the root directory:
* npm install

### Run
* Updated envs with export CLIENT_ID and export CLIENT_SECRET
* node index.js
* http://localhost:8888


# To Run Prod Builds
* Using a docker image and a linux machine 
* docker run -d -v certs:/certs -p 443:8443 -e ID1=<<CLIENT ID>> -e ID2=<<CLIENT SECRET>> <<IMAGE NAME>>
* The app will run on port 443(HTTPS) on your domain




