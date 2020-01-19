<template>
  <div class="body">
    <div class="login" v-if="logged_out">
      <h2> Login to Spotify </h2>
      <a href="/login">Login HERE</a>
    </div>
    <div class="main" v-if="logged_in">
      <h1> Welcome, {{username}}. </h1>
      <h3>
      <b-card bg-variant="success" text-variant="white" header="Hipster Score" class="mx-auto" align="center" style="max-width: 16rem;">
        <h1>{{score}}</h1>
      </b-card>
      </h3>
      <b-dropdown right text="Artists shown" variant="success" class="dd">
        <b-dropdown-item v-if="curr_artist_limit==5" active='true'> 5 </b-dropdown-item>
        <b-dropdown-item v-else v-on:click="getArtists(5)"> 5 </b-dropdown-item>
        <b-dropdown-item v-if="curr_artist_limit==10" active='true'> 10 </b-dropdown-item>
        <b-dropdown-item v-else v-on:click="getArtists(10)"> 10 </b-dropdown-item>
        <b-dropdown-item v-if="curr_artist_limit==25" active='true'> 25 </b-dropdown-item>
        <b-dropdown-item v-else v-on:click="getArtists(25)"> 25 </b-dropdown-item>
        <b-dropdown-item v-if="curr_artist_limit==50" active='true'> 50 </b-dropdown-item>
        <b-dropdown-item v-else v-on:click="getArtists(50)"> 50 </b-dropdown-item>
      </b-dropdown>
      <b-dropdown right text="Songs shown" variant="success" class="dd">
        <b-dropdown-item v-if="curr_song_limit==10" active='true'> 10 </b-dropdown-item>
        <b-dropdown-item v-else v-on:click="getSongs(10)"> 10 </b-dropdown-item>
        <b-dropdown-item v-if="curr_song_limit==20" active='true'> 20 </b-dropdown-item>
        <b-dropdown-item v-else v-on:click="getSongs(20)"> 20 </b-dropdown-item>
        <b-dropdown-item v-if="curr_song_limit==30" active='true'> 30 </b-dropdown-item>
        <b-dropdown-item v-else v-on:click="getSongs(30)"> 30 </b-dropdown-item>
        <b-dropdown-item v-if="curr_song_limit==40" active='true'> 40 </b-dropdown-item>
        <b-dropdown-item v-else v-on:click="getSongs(40)"> 40 </b-dropdown-item>
        <b-dropdown-item v-if="curr_song_limit==50" active='true'> 50 </b-dropdown-item>
        <b-dropdown-item v-else v-on:click="getSongs(50)"> 50 </b-dropdown-item>
      </b-dropdown>
      <b-dropdown right text="Time Range" variant="success" class="dd">
        <b-dropdown-item v-if="curr_time=='short_term'" active='true'> Short (~ 4 weeks) </b-dropdown-item>
        <b-dropdown-item v-else v-on:click="changeTime('short_term')"> Short (~ 4 weeks) </b-dropdown-item>
        <b-dropdown-item v-if="curr_time=='medium_term'" active='true'> Medium (~ 6 months) </b-dropdown-item>
        <b-dropdown-item v-else v-on:click="changeTime('medium_term')"> Medium (~ 6 months) </b-dropdown-item>
        <b-dropdown-item v-if="curr_time=='long_term'" active='true'> Long (several years) </b-dropdown-item>
        <b-dropdown-item v-else v-on:click="changeTime('long_term')"> Long (several years) </b-dropdown-item>
      </b-dropdown>
      <div id="artistList">
        <b-table striped small :items="artists" :fields="artist_fields">
          <template v-slot:cell(#)="data">
            {{ data.index + 1}}
          </template>
        </b-table>
      </div>
      <div id="songList">
        <b-table striped small :items="songs" :fields="song_fields">
          <template v-slot:cell(#)="data">
            {{ data.index + 1}}
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Service from '../Service.js'
import axios from 'axios'

export default {
  name: 'home',
  data: () => ({
    logged_in: false,
    logged_out: true,
    score: '',
    curr_time: 'medium_term',
    curr_song_limit: 20,
    curr_artist_limit: 10,
    username: '',
    song_fields: [
      '#',
      { key: 'name', label: 'Song' },
      { key: 'artists[0].name', label: 'Artist' },
      { key: 'album.name', label: 'Album' },
      { key: 'popularity', label: 'Popularity' }
    ],
    songs: [],
    artist_fields: [
      '#',
      { key: 'name', label: 'Artist' },
      { key: 'popularity', label: 'Popularity' }
    ],
    artists: []
  }),
  async mounted () {
    if (this.$route.query.status === 'ok') {
      this.logged_in = true
      this.logged_out = false
      await axios
        .get('/me')
        .then(response => {
          this.username = response.data.display_name
        })
      this.score = await Service.scoreCalc(this.curr_time)
      await axios
        .get('/artists', {
          params: {
            limit: this.curr_artist_limit,
            time: this.curr_time
          }
        })
        .then(response => {
          console.log(response)
          this.artists = response.data.items
        })
      await axios
        .get('/songs', {
          params: {
            limit: this.curr_song_limit,
            time: this.curr_time
          }
        })
        .then(response => {
          console.log(response)
          this.songs = response.data.items
        })
      console.log(this.songs)
    }
  },
  methods: {
    async getSongs (myLimit) {
      await axios
        .get('/songs', {
          params: {
            limit: myLimit,
            time: this.curr_time
          }
        })
        .then(response => {
          console.log(response)
          this.songs = response.data.items
          this.curr_song_limit = myLimit
        })
    },
    async getArtists (myLimit) {
      await axios
        .get('/artists', {
          params: {
            limit: myLimit,
            time: this.curr_time
          }
        })
        .then(response => {
          console.log(response)
          this.artists = response.data.items
          this.curr_artist_limit = myLimit
        })
    },
    async changeTime (myTime) {
      await axios
        .get('/artists', {
          params: {
            limit: this.curr_artist_limit,
            time: myTime
          }
        })
        .then(response => {
          console.log(response)
          this.artists = response.data.items
        })
      await axios
        .get('/songs', {
          params: {
            limit: this.curr_song_limit,
            time: myTime
          }
        })
        .then(response => {
          console.log(response)
          this.songs = response.data.items
          this.curr_time = myTime
        })
      this.score = await Service.scoreCalc(myTime)
    }
  }
}
</script>
