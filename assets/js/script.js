var currentBackground = 4
var setNextBackground = (e, flicker) => {
  currentBackground = (currentBackground + 1) % 5
  var newBackground = 'screen-content background-' + currentBackground
  var screen = document.getElementsByClassName('screen-content')[0]
  if (flicker) {
    screen.className = newBackground + ' vhs-flicker'
    setTimeout(() => {
      screen.className = newBackground
    }, 1000)
  } else {
    screen.className = newBackground
  }
}

var turnOnTv = () => {
  console.log('tuning into vhs...')
  setTimeout(() => {
    document.getElementsByClassName('container')[0].className += ' tv-container'
    setTimeout(() => {
      document.getElementById('title').className += ' vhs-flicker'
      // startRandomGlitching()
      startRandomFlickering()
    }, 2500)
    setTimeout(setNextBackground, 500)
  }, 2500)
}

var attachEventListeners = () => {
  document.getElementsByClassName('screen-content')[0].addEventListener('click', setNextBackground)
  Array.from(document.getElementsByTagName('a')).map((el) => el.addEventListener('click', e => e.stopPropagation()))
}

function create(htmlStr) {
  var frag = document.createDocumentFragment(),
  temp = document.createElement('div')
  temp.innerHTML = htmlStr
  while (temp.firstChild) {
    frag.appendChild(temp.firstChild)
  }
  return frag
}

var stopRandomGlitching = false
var dontStartGlitching = false

var startGlitch = () => {
  if (dontStartGlitching) return

  var pic = document.getElementById('my-pic')
  pic.className = 'glitch glitch--style-1 active'
}

var stopGlitch = () => {
  var pic = document.getElementById('my-pic')
  pic.className = 'glitch glitch--style-1'
}

var glitchFor = (milliseconds = 1500) => {
  startGlitch()
  setTimeout(stopGlitch, milliseconds)
}

var startRandomGlitching = () => {
  if (stopRandomGlitching) return

  var nextGlitch = Math.max(1, Math.random() * 5) * 1000
  var glitchDuration = Math.max(0.3, Math.random() * 4) * 1000
  setTimeout(() => glitchFor(glitchDuration), nextGlitch)
  setTimeout(startRandomGlitching, nextGlitch + glitchDuration + 500)
}

var flickerName = () => {
  var title = document.getElementById('title')
  var baseClass = 'neon no-select'
  title.className = baseClass
  setTimeout(() => {
    title.className = baseClass + ' vhs-flicker vhs-reverse'
  }, 30)
  setTimeout(() => {
    title.className = baseClass = baseClass
  }, 900)
  setTimeout(() => {
    title.className = baseClass = baseClass + ' vhs-flicker'
  }, 1100)
}

var startRandomFlickering = () => {
  var nextFlicker = Math.max(5, Math.random() * 10) * 1000
  setTimeout(flickerName, nextFlicker)
  setTimeout(startRandomFlickering, nextFlicker + 500)
}

class Player {
  constructor(trackId, numSongs) {
    this.currentSongIndex = 0
    this.numSongs = numSongs
    this.player = this.createWidget(trackId)
    this.player.bind(SC.Widget.Events.FINISH, () => this.prev()) // loop when song ends
  }

  createWidget(trackId) {
    let id = 'soundcloud-' + trackId
    let url = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/' + trackId
    var scWidget = create("<iframe class='soundcloud' id='" + id + "' src='" + url + "'></iframe>")
    document.body.insertBefore(scWidget, document.body.childNodes[0])
    return SC.Widget(id)
  }

  play() {
    this.player.play()
  }

  pause() {
    this.player.pause()
  }

  restartTracklist() {
    this.player.skip(0)
  }

  prev() {
    this.player.prev()
  }

  next(autoPlay = true) {
    let newIndex = (this.currentSongIndex + 1) % this.numSongs
    if (newIndex == 0) {
      this.restartTracklist()
    } else {
      this.player.next()
    }
    if (!autoPlay) {
      this.pause()
    }
    this.currentSongIndex = newIndex
  }

  onSongEnd(onEnd) {
    this.player.bind(SC.Widget.Events.FINISH, onEnd)
  }
}

var startDesktopExperience = () => {
  var player = new Player('playlists/452830602', 5)

  var playingMusic = false
  var audioButton = document.getElementById('audio-button')
  var sad = document.getElementById('sad-boiz')
  var pic = document.getElementById('my-pic')
  var stopSong = () => {
    player.pause()
    audioButton.innerHTML = 'audio: off'
    sad.className = 'neon-2'
    stopRandomGlitching = false
    stopGlitch()
    startRandomGlitching()
  }

  var startSong = () => {
    player.play()
    audioButton.innerHTML = 'audio: on'
    setTimeout(() => {
      sad.className = 'neon-2 vhs-flicker'
    }, 100)
    dontStartGlitching = true
    stopRandomGlitching = true
    setTimeout(() => {
      dontStartGlitching = false
      startGlitch()
    }, 17200)
  }

  var toggleMusic = (e) => {
    e.stopPropagation()
    if (playingMusic) {
      stopSong()
    } else {
      startSong()
    }
    playingMusic = !playingMusic
  }

  document.getElementsByClassName('screen-content')[0].addEventListener('click', () => {
    player.next(playingMusic)
  })

  document.getElementById('audio-container').addEventListener('click', toggleMusic)
}


// Preload Images

function preloadImages(imageUrls, onLoaded, filePathPrefix = './assets/img/') {
  let imagesLoaded = 0

  let onImageLoad = () => {
    imagesLoaded += 1
    if (imageUrls.length === imagesLoaded) {
      onLoaded()
    }
  }

  imageUrls.map(url => {
    let imageBlob = new Image()
    imageBlob.src = filePathPrefix + url
    imageBlob.onload =  onImageLoad
  })
}

var init = () => {
  var imageUrls = [
    'beach.gif',
    'me2.png',
    'offwhite.png',
    'remote.png',
    'tape.png'
  ]

  preloadImages(imageUrls, () => {
    turnOnTv()
    attachEventListeners()
    if (window.innerWidth > 800) {
      startDesktopExperience()
    }
  })
}

init()

