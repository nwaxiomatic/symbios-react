import { getSDK } from 'react-player/lib/utils'

const SDK_URL = 'https://player.vimeo.com/api/player.js'
const SDK_GLOBAL = 'Vimeo'

export const vIMG = "http://img.youtube.com/vi/@video_id/0.jpg"

export var getVimeo = function(callback) {
  getSDK(SDK_URL, SDK_GLOBAL).then(Vimeo => {
    callback(Vimeo)
  })
}

export var getYTImg = function(video, imgLoaded) {
  let img = new Image()
  img.onload = function() {
    imgLoaded(img)
  }
  img.src = vIMG.replace('@video_id', video.id)
}