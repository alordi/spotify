import axios from 'axios'

class Service {
  static async scoreCalc (myTime) {
    var songs
    var artists
    var i
    var songScore = 0
    var artistScore = 0
    var totalScore = 0
    // var popSongs = []
    // var popArtists = []
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
      if (i < 10) {
        songScore = songScore + (songs[i].popularity * 1.5)
        artistScore = artistScore + (artists[i].popularity * 1.5)
      } else if (i < 20) {
        songScore = songScore + (songs[i].popularity * 1.25)
        artistScore = artistScore + (artists[i].popularity * 1.25)
      } else if (i < 30) {
        songScore = songScore + songs[i].popularity
        artistScore = artistScore + artists[i].popularity
      } else if (i < 40) {
        songScore = songScore + (songs[i].popularity * 0.75)
        artistScore = artistScore + (artists[i].popularity * 0.75)
      } else {
        songScore = songScore + (songs[i].popularity * 0.5)
        artistScore = artistScore + (artists[i].popularity * 0.5)
      }
    }
    totalScore = artistScore + songScore
    totalScore = totalScore / 100
    totalScore = totalScore * (-1)
    totalScore = totalScore + 100
    totalScore = totalScore * 0.2
    return totalScore.toFixed(2)
  }
}

export default Service
