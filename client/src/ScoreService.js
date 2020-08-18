import axios from 'axios'

class ScoreService {
  static async scoreCalc (myTime) {
    var songs
    var artists
    var features
    var i
    var songScore = 0
    var artistScore = 0
    var popScore = 0
    var happyScore = 0
    var danceScore = 0
    var energyScore = 0
    var scores = []
    var songIds = []
    var nulls = 0
    var total = 50
    await axios
      .get('/artists', {
        params: {
          limit: 50,
          time: myTime
        }
      })
      .then(response => {
        artists = response.data.items
      })
    await axios
      .get('/songs', {
        params: {
          limit: 50,
          time: myTime
        }
      })
      .then(response => {
        songs = response.data.items
      })

    for (i = 0; i < 50; i++) {
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
    for (i = 0; i < 50; i++) {
      if (features[i] == null) {
        nulls = nulls + 1
      } else {
        if (i < 10) {
          songScore = songScore + (songs[i].popularity * 1.5)
          artistScore = artistScore + (artists[i].popularity * 1.5)
          happyScore = happyScore + (features[i].valence * 1.5)
          danceScore = danceScore + (features[i].danceability * 1.5)
          energyScore = energyScore + (features[i].energy * 1.5)
        } else if (i < 20) {
          songScore = songScore + (songs[i].popularity * 1.25)
          artistScore = artistScore + (artists[i].popularity * 1.25)
          happyScore = happyScore + (features[i].valence * 1.25)
          danceScore = danceScore + (features[i].danceability * 1.25)
          energyScore = energyScore + (features[i].energy * 1.25)
        } else if (i < 30) {
          songScore = songScore + songs[i].popularity
          artistScore = artistScore + artists[i].popularity
          happyScore = happyScore + features[i].valence
          danceScore = danceScore + features[i].danceability
          energyScore = energyScore + features[i].energy
        } else if (i < 40) {
          songScore = songScore + (songs[i].popularity * 0.75)
          artistScore = artistScore + (artists[i].popularity * 0.75)
          happyScore = happyScore + (features[i].valence * 0.75)
          danceScore = danceScore + (features[i].danceability * 0.75)
          energyScore = energyScore + (features[i].energy * 0.75)
        } else {
          songScore = songScore + (songs[i].popularity * 0.5)
          artistScore = artistScore + (artists[i].popularity * 0.5)
          happyScore = happyScore + (features[i].valence * 0.5)
          danceScore = danceScore + (features[i].danceability * 0.5)
          energyScore = energyScore + (features[i].energy * 0.5)
        }
      }
    }

    // scaling popScore
    popScore = artistScore + songScore
    popScore = popScore / 100
    popScore = popScore * (-1)
    popScore = popScore + 100
    popScore = popScore.toFixed(1)
    scores[0] = popScore

    // scaling happyScore, danceScore, and energyScore
    total = total - nulls
    happyScore = happyScore / total
    danceScore = danceScore / total
    energyScore = energyScore / total
    happyScore = happyScore * 100
    danceScore = danceScore * 100
    energyScore = energyScore * 100
    happyScore = happyScore.toFixed(1)
    danceScore = danceScore.toFixed(1)
    energyScore = energyScore.toFixed(1)

    scores[1] = happyScore
    scores[2] = danceScore
    scores[3] = energyScore

    return scores
  }
}
export default ScoreService
