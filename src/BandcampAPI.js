export var getBCImg = function(bc, imgLoaded) {
  let img = new Image()
  img.onload = function() {
    imgLoaded(img)
  }
  img.src = bc.img
}

// var elmnt = iframe.contentWindow.document.getElementsByTagName("H1")