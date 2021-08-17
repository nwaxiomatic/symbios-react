import buildUrl from 'build-url'

var generateApiUrl = function(image, size) {
  // const extras = ["url_o", "url_m", props.thumbnailSizeParam, "license", "date_upload", "date_taken", "icon_server", "original_format", "last_update", "geo", "tags", "machine_tags", "o_dims", "views", "media", "path_alias", "owner_name"];
  return buildUrl('https://api.flickr.com', {
    path: 'services/rest/',
    queryParams: {
      method: 'flickr.photos.getSizes',
      format: 'json',
      api_key: process.env.REACT_APP_FLICKR_api_key || '',
      photo_id: image.id || '',
      // user_id: props.user_id || '',
      // album_id: props.album_id || '',
      nojsoncallback: '?',
      // extras: extras.join(',')
    }
  })
}

export var getFlickrImg = function(image, size, imgLoaded) {
  fetch(generateApiUrl(image, size))
  .then(response => response.json())
  .then((response) => {
    let imgSrc = response.sizes.size.filter(
      obj => {
        return obj.label === size
      }
    )
    // console.log(imgSrc)
    imgSrc = imgSrc[0].source
    let img = new Image()
    img.onload = function() {
      imgLoaded(img)
    }
    img.src = imgSrc
    // console.log(imgSrc)
  })
}