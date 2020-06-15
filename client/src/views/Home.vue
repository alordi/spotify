<template>
  <div class="body">
    <div class="login" v-if="logged_out">
      <h2> Login to Spotify </h2>
      <a href="/login">Login HERE</a>
    </div>
    <b-modal id="mod1" size="lg" hide-footer title="About Your Listening Scores">
      <b-list-group>
        <b-list-group-item>
          <p>Each score ranges from 0-100 and is calculated using your top 50 songs (the <strong>Hipster Score</strong> also uses your top 50 artists).
          Songs/artists with a higher ranking are weighted more in each calculation.
          The audio features used in these scores (<strong>Popularity</strong>, <strong>Valence</strong>, <strong>Danceability</strong>, and <strong>Energy</strong>)
          have been taken directly from Spotify. These numbers have not been altered, aside from being scaled to all use the same 0-100 scale. </p>
        </b-list-group-item>
        <b-list-group-item>
          <p>The <strong>Hipster Score</strong> is determined using each song/artists' <strong>Popularity</strong>. This score has an inverse relationship with <strong>Popularity</strong>,
          meaning the less popular the music you listen to, the greater your hipster score, and vice versa. The <strong>Popularity</strong> number itself is determined largely by the total number
          of plays a track/artist has and how recent those plays are. This ends up as a value between 0 and 100, with a higher number meaning a higher popularity. </p>
        </b-list-group-item>
        <b-list-group-item>
          <p>The <strong>Happiness Score</strong> is determined using each songs' <strong>Valence</strong>. The <strong>Valence</strong> of each song represents a measure of
          the musical positivity conveyed by the track. Songs that have a high <strong>Valence</strong> sound more happy, cheerful, and euphoric while songs with a low <strong>Valence</strong>
          sound more sad, depressed, and angry. A higher <strong>Happiness Score</strong> means a higher overall <strong>Valence</strong> in the music you listen to. </p>
        </b-list-group-item>
        <b-list-group-item>
          <p>The <strong>Danceability Score</strong> is determined using each songs' <strong>Danceability</strong>. A song's <strong>Danceability</strong> describes how suitable that song is for
          dancing based on musical elements such as tempo, rhythm stability, beat strength, and overall regularity. Songs that have a high <strong>Danceability</strong> value are more danceable
          and songs with a low value are less danceable. A higher <strong>Danceability Score</strong> means a higher overall <strong>Danceability</strong> in the music you listen to. </p>
        </b-list-group-item>
        <b-list-group-item>
          <p>The <strong>Energy Score</strong> is determined using each songs' <strong>Energy</strong>, which is a measure of the song's intensity and activity. Songs with a high <strong>Energy</strong> value
          are typically fast, loud, and noisy. Features that determine a song's <strong>Energy</strong> are dynamic range, perceived loudness, timbre, onset rate, and general entropy.
          A higher <strong>Energy Score</strong> means a higher overall <strong>Energy</strong> in the music you listen to. </p>
        </b-list-group-item>
      </b-list-group>
    </b-modal>
    <div class="main" v-if="logged_in">
      <h1> Welcome, {{username}}. </h1>
      <h3>
      <b-card bg-variant="dark" text-variant="warning" border-variant="warning" class="mx-auto" align="center" style="max-width: 40rem">
        <template v-slot:header>
          <ch style="text-align:center"> Your Listening Scores </ch>
          <b-button pill variant="outline-warning" style="float:right;font-size:50%;" v-b-modal.mod1>
            <strong> ? </strong>
          </b-button>
        </template>
        <b-card-text>
          Hipster Score: <num class="num"> {{scores[0]}} </num>
        </b-card-text>
        <b-card-text>
          Happiness Score: <num class="num"> {{scores[1]}} </num>
        </b-card-text>
        <b-card-text>
          Danceability Score: <num class="num"> {{scores[2]}} </num>
        </b-card-text>
        <b-card-text>
          Energy Score: <num class="num"> {{scores[3]}} </num>
        </b-card-text>
      </b-card>
      </h3>
      <b-dropdown right text="Artists shown" variant="warning" class="dd">
        <b-dropdown-item v-if="curr_artist_limit==5" active='true'> 5 </b-dropdown-item>
        <b-dropdown-item v-else v-on:click="getArtists(5)"> 5 </b-dropdown-item>
        <b-dropdown-item v-if="curr_artist_limit==10" active='true'> 10 </b-dropdown-item>
        <b-dropdown-item v-else v-on:click="getArtists(10)"> 10 </b-dropdown-item>
        <b-dropdown-item v-if="curr_artist_limit==25" active='true'> 25 </b-dropdown-item>
        <b-dropdown-item v-else v-on:click="getArtists(25)"> 25 </b-dropdown-item>
        <b-dropdown-item v-if="curr_artist_limit==50" active='true'> 50 </b-dropdown-item>
        <b-dropdown-item v-else v-on:click="getArtists(50)"> 50 </b-dropdown-item>
      </b-dropdown>
      <b-dropdown right text="Songs shown" variant="warning" class="dd">
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
      <b-dropdown right text="Time Range" variant="warning" class="dd">
        <b-dropdown-item v-if="curr_time=='short_term'" active='true'> Short (~ 4 weeks) </b-dropdown-item>
        <b-dropdown-item v-else v-on:click="changeTime('short_term')"> Short (~ 4 weeks) </b-dropdown-item>
        <b-dropdown-item v-if="curr_time=='medium_term'" active='true'> Medium (~ 6 months) </b-dropdown-item>
        <b-dropdown-item v-else v-on:click="changeTime('medium_term')"> Medium (~ 6 months) </b-dropdown-item>
        <b-dropdown-item v-if="curr_time=='long_term'" active='true'> Long (several years) </b-dropdown-item>
        <b-dropdown-item v-else v-on:click="changeTime('long_term')"> Long (several years) </b-dropdown-item>
      </b-dropdown>
      <div id="artistList">
        <b-table striped small responsive :items="artists" :fields="artist_fields">
          <template v-slot:cell(rank)="data">
            <h4 style="font-size:110%"> {{data.index + 1}} </h4>
          </template>
          <template v-slot:cell(photo)="data">
            <b-img-lazy v-bind="mainProps" :src="getUrl(data.index)"></b-img-lazy>
          </template>
          <template v-slot:cell(name)="data">
            <h4 style="font-size:110%"> {{data.value}} </h4>
          </template>
          <template v-slot:cell(popularity)="data" style="vertical-align:middle;">
            <h4 style="font-size:110%"> {{data.value}} </h4>
          </template>
        </b-table>
      </div>
      <div id="songList">
        <b-table striped small responsive :items="songs" :fields="song_fields">
          <template v-slot:cell(popularity)="data">
            <num v-if="checkBlack(data.value)"> {{data.value}} </num>
            <strong class="red" v-if="checkRed(data.value)"> {{data.value}} </strong>
            <strong class="darkgreen" v-if="checkDarkGreen(data.value)"> {{data.value}} </strong>
            <strong class="lightgreen" v-if="checkLightGreen(data.value)"> {{data.value}} </strong>
            <strong class="orange" v-if="checkOrange(data.value)"> {{data.value}} </strong>
          </template>
          <template v-slot:cell(valence)="data">
            <num v-if="checkBlack(data.value)"> {{data.value}} </num>
            <strong class="red" v-if="checkRed(data.value)"> {{data.value}} </strong>
            <strong class="darkgreen" v-if="checkDarkGreen(data.value)"> {{data.value}} </strong>
            <strong class="lightgreen" v-if="checkLightGreen(data.value)"> {{data.value}} </strong>
            <strong class="orange" v-if="checkOrange(data.value)"> {{data.value}} </strong>
          </template>
          <template v-slot:cell(danceability)="data">
            <num v-if="checkBlack(data.value)"> {{data.value}} </num>
            <strong class="red" v-if="checkRed(data.value)"> {{data.value}} </strong>
            <strong class="darkgreen" v-if="checkDarkGreen(data.value)"> {{data.value}} </strong>
            <strong class="lightgreen" v-if="checkLightGreen(data.value)"> {{data.value}} </strong>
            <strong class="orange" v-if="checkOrange(data.value)"> {{data.value}} </strong>
          </template>
          <template v-slot:cell(energy)="data">
            <num v-if="checkBlack(data.value)"> {{data.value}} </num>
            <strong class="red" v-if="checkRed(data.value)"> {{data.value}} </strong>
            <strong class="darkgreen" v-if="checkDarkGreen(data.value)"> {{data.value}} </strong>
            <strong class="lightgreen" v-if="checkLightGreen(data.value)"> {{data.value}} </strong>
            <strong class="orange" v-if="checkOrange(data.value)"> {{data.value}} </strong>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import ScoreService from '../ScoreService.js'
import ChartService from '../ChartService.js'
import axios from 'axios'

export default {
  name: 'home',
  data: () => ({
    logged_in: false,
    logged_out: true,
    scores: [],
    curr_time: 'medium_term',
    curr_song_limit: 20,
    curr_artist_limit: 10,
    username: '',
    song_fields: [
      { key: 'rank', label: 'Rank', sortable: true },
      { key: 'name', label: 'Song', sortable: true },
      { key: 'artists[0].name', label: 'Artist', sortable: true },
      { key: 'popularity', label: 'Popularity', sortable: true },
      { key: 'valence', label: 'Valence', sortable: true },
      { key: 'danceability', label: 'Danceability', sortable: true },
      { key: 'energy', label: 'Energy', sortable: true }
    ],
    songs: [],
    artist_fields: [
      'rank',
      { key: 'photo', label: '' },
      { key: 'name', label: 'Artist' },
      { key: 'popularity', label: 'Popularity' }
    ],
    artists: [],
    mainProps: {
      fluid: true,
      fluidGrow: false,
      rounded: true,
      width: 60,
      height: 60
    }
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
      this.scores = await ScoreService.scoreCalc(this.curr_time)
      this.artists = await ChartService.getArtistChart(this.curr_artist_limit, this.curr_time)
      this.songs = await ChartService.getSongChart(this.curr_song_limit, this.curr_time)
    }
  },
  methods: {
    async getSongs (myLimit) {
      this.songs = await ChartService.getSongChart(myLimit, this.curr_time)
      this.curr_song_limit = myLimit
    },
    async getArtists (myLimit) {
      this.artists = await ChartService.getArtistChart(myLimit, this.curr_time)
      this.curr_artist_limit = myLimit
    },
    async changeTime (myTime) {
      this.artists = await ChartService.getArtistChart(this.curr_artist_limit, myTime)
      this.songs = await ChartService.getSongChart(this.curr_song_limit, myTime)
      this.scores = await ScoreService.scoreCalc(myTime)
      this.curr_time = myTime
    },
    getUrl (index) {
      return this.artists[index].photo
    },
    checkDarkGreen (num) {
      if (num >= 90) {
        return true
      }
      return false
    },
    checkLightGreen (num) {
      if (num < 90 && num >= 80) {
        return true
      }
      return false
    },
    checkOrange (num) {
      if (num < 20 && num >= 10) {
        return true
      }
      return false
    },
    checkRed (num) {
      if (num < 10) {
        return true
      }
      return false
    },
    checkBlack (num) {
      if (num < 80 && num >= 20) {
        return true
      }
      return false
    }
  }
}
</script>
