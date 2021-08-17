import { getSDK } from 'react-player/lib/utils'

const SDK_URL = 'https://player.vimeo.com/api/player.js'
const SDK_GLOBAL = 'Vimeo'

export const viF = "https://player.vimeo.com/video/"
// export const viF = "https://api.vimeo.com/videos/"
export const vURL = "https://vimeo.com/@video_id"

export const vIMG = "https://vimeo.com/api/oembed.json?url="

export var getVimeo = function(callback) {
  getSDK(SDK_URL, SDK_GLOBAL).then(Vimeo => {
    callback(Vimeo)
  })
}

export var getVimeoImg = function(video, imgLoaded) {
  fetch(vIMG + vURL.replace('@video_id', video.id), {
    mode: 'cors',
    method: 'get',
  }).then(response => response.json())
    .then(data => {
      // console.log(data)
      let img = new Image()
      img.onload = function() {
        imgLoaded(img)
      }
      img.src = data.thumbnail_url
    })
}