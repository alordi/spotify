import axios from 'axios'

class ChartService {
  static async getSongChart (limit, timeRange) {
    var songs
    var features
    var i
    var songIds = []
    await axios
      .get('/songs', {
        params: {
          limit: limit,
          time: timeRange
        }
      })
      .then(response => {
        songs = response.data.items
      })

    for (i = 0; i < limit; i++) {
      songIds[i] = songs[i].id
    }

    await axios
      .get('/features', {
        params: {
          songIds: songIds
        }
      })
      .then(response => {
        features = response.data.audio_features
      })

    for (i = 0; i < limit; i++) {
      songs[i].valence = (features[i].valence * 100).toFixed(0)
      songs[i].danceability = (features[i].danceability * 100).toFixed(0)
      songs[i].energy = (features[i].energy * 100).toFixed(0)
      songs[i].rank = i + 1
    }

    return songs
  }

  static async getArtistChart (limit, timeRange) {
    var artists
    var i
    await axios
      .get('/artists', {
        params: {
          limit: limit,
          time: timeRange
        }
      })
      .then(response => {
        artists = response.data.items
      })

    for (i = 0; i < limit; i++) {
      var len = artists[i].images.length
      artists[i].photo = artists[i].images[len - 1].url
    }

    return artists
  }
}

export default ChartService
