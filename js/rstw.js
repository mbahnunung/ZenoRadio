/*
The MIT License (MIT) 
PARAN JARE RIKO

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const RADIO_NAME = 'mbah nunung Online';

// SELECT ARTWORK PROVIDER, ITUNES, DEEZER & SPOTIFY  eg : spotify 
var API_SERVICE = 'spotify';

// Change Zeno Stream URL Here
const URL_STREAMING = 'https://stream.zeno.fm/uv0krbzgszpvv';

//API URL Zeno Now Playing
const API_URL = 'https://api.twj.es/radio_info/?radio_url='+URL_STREAMING

// Visit https://api.vagalume.com.br/docs/ to get your API key
const API_KEY = "18fe07917957c289983464588aabddfb";

// Change DEFAULT COVER
const DEFAULT_COVER_ART = 'https://cdn4.mbahnunungonline.net/img/noCover.png';

let userInteracted = true;

window.addEventListener('load', () => { 
    const page = new Page();
    page.changeTitlePage();
    page.setVolume();

    const player = new Player();
    player.play();

    // Calls the getStreamingData function immediately when the page loads
    getStreamingData();

    // Sets the interval to update streaming data every 10 seconds
    const streamingInterval = setInterval(getStreamingData, 10000);

    // Adjusts the height of the album cover to be equal to its width
    const coverArt = document.querySelector('.cover-album'); // Use querySelector to select element
    if (coverArt) { // Adds a check to ensure the element exists
      coverArt.style.height = `${coverArt.offsetWidth}px`;
    } else {
      console.warn("cover-album element not found.");
    }
});

// DOM control
class Page {
    constructor() {
        this.changeTitlePage = function (title = RADIO_NAME) {
            document.title = title;
        };

        this.refreshCurrentSong = function(song, artist) {
            const currentSong = document.getElementById('currentSong');
            const currentArtist = document.getElementById('currentArtist');
            const maxLength = 100; // Set the maximum character limit
          
            // Limit string size and add "..." if necessary
            const truncatedSong = song.length > maxLength ? song.substring(0, maxLength) + "..." : song;
            const truncatedArtist = artist.length > maxLength ? artist.substring(0, maxLength) + "..." : artist;
          
            if (truncatedSong !== currentSong.textContent) { 
              // Fade out existing content
              currentSong.classList.add('fade-out');
              currentArtist.classList.add('fade-out');
          
              setTimeout(function() {
                // Update content after fade-out
                currentSong.textContent = truncatedSong; 
                currentArtist.textContent = truncatedArtist;
                document.getElementById('lyricsSong').textContent = truncatedSong + ' - ' + truncatedArtist;
          
                // Fade-in new content
                currentSong.classList.remove('fade-out');
                currentSong.classList.add('fade-in');
                currentArtist.classList.remove('fade-out');
                currentArtist.classList.add('fade-in');
              }, 500); // Adjust fade duration as needed
          
              setTimeout(function() {
                // Remove fade-in classes after animation
                currentSong.classList.remove('fade-in');
                currentArtist.classList.remove('fade-in');
              }, 1000); // Adjust based on fade duration
            }
        };
          
        this.refreshHistoric = async function (info, n) {
            const historicDiv = document.querySelectorAll('#historicSong article')[n];
            const songName = document.querySelectorAll('#historicSong article .music-info .song')[n];
            const artistName = document.querySelectorAll('#historicSong article .music-info .artist')[n];
            const coverHistoric = document.querySelectorAll('#historicSong article .cover-historic')[n];
            // Default cover art
            const defaultCoverArt = DEFAULT_COVER_ART;
          
            // Formata caracteres para UTF-8
            const music = info.song.replace(/&apos;/g, '\'').replace(/&amp;/g, '&');
            const artist = info.artist.replace(/&apos;/g, '\'').replace(/&amp;/g, '&');
          
            songName.innerHTML = music;
            artistName.innerHTML = artist;
          
            try {
              const response = await fetch('https://prod-api.radioapi.me/1ceb9727-3e36-4e64-99e7-f776b50c7f4f/musicsearch?query=' + info.artist + ' ' + info.song + '&service=' + API_SERVICE.toLowerCase());
              const data = await response.json();
          
              if (data && data.results && data.results.artwork) {
                coverHistoric.style.backgroundImage = 'url(' + data.results.artwork + ')';
              } else {
                coverHistoric.style.backgroundImage = 'url(' + defaultCoverArt + ')';
                console.warn("Invalid API response or missing artwork data:", data);
              }
            } catch (error) {
              coverHistoric.style.backgroundImage = 'url(' + defaultCoverArt + ')';
              console.error("Error fetching data from API:", error);
            }
          
            // Add/remove classes for animation
            historicDiv.classList.add('animated', 'slideInRight');
            setTimeout(() => historicDiv.classList.remove('animated', 'slideInRight'), 2000); 
        };

        this.refreshCover = async function (song = '', artist) {
            const coverArt = document.getElementById('currentCoverArt');
            const coverBackground = document.getElementById('bgCover');
            // Default cover art
            const defaultCoverArt = DEFAULT_COVER_ART;
            
            let urlCoverArt = defaultCoverArt; // Boot with default image outside of try...catch
            
            try {
              const response = await fetch('https://prod-api.radioapi.me/1ceb9727-3e36-4e64-99e7-f776b50c7f4f/musicsearch?query=' + artist + ' ' + song + '&service=' + API_SERVICE.toLowerCase());
          
              if (!response.ok) {
                throw new Error(`Error in API request: ${response.status} ${response.statusText}`);
              }
          
              const data = await response.json();
          
              if (data && data.results && data.results.artwork) {
                urlCoverArt = data.results.artwork;
              } else {
                console.warn("Valid API response, but missing artwork data:", data);
              }
            } catch (error) {
              console.error("Error fetching data from API:", error);
            }
          
            // Apply the cover image (always, even if it is the default)
            coverArt.style.backgroundImage = 'url(' + urlCoverArt + ')';
            coverBackground.style.backgroundImage = 'url(' + urlCoverArt + ')';
          
            // Add/remove classes for animation (if necessary)
            coverArt.classList.add('animated', 'bounceInLeft');
            setTimeout(() => coverArt.classList.remove('animated', 'bounceInLeft'), 2000);
          
            // Update MediaSession (if supported)
            if ('mediaSession' in navigator) {
              const artwork = [
                { src: urlCoverArt, sizes: '96x96',   type: 'image/png' },
                { src: urlCoverArt, sizes: '128x128', type: 'image/png' },
                { src: urlCoverArt, sizes: '192x192', type: 'image/png' },
                { src: urlCoverArt, sizes: '256x256', type: 'image/png' },
                { src: urlCoverArt, sizes: '384x384', type: 'image/png' },
                { src: urlCoverArt, sizes: '512x512', type: 'image/png' },
              ];
          
              navigator.mediaSession.metadata = new MediaMetadata({ title: song, artist: artist, artwork });
            }
        };

        this.changeVolumeIndicator = function(volume) {
            document.getElementById('volIndicator').textContent = volume; // Use textContent instead of innerHTML
          
            if (typeof Storage !== 'undefined') {
              localStorage.setItem('volume', volume);
            }
          };
          
        this.setVolume = function() {
            if (typeof Storage !== 'undefined') {
              const volumeLocalStorage = localStorage.getItem('volume') || 80; // Null coalescing operator (??)
          
              document.getElementById('volume').value = volumeLocalStorage;
              document.getElementById('volIndicator').textContent = volumeLocalStorage;
            }
          };

        this.refreshLyric = async function (currentSong, currentArtist) {
            const openLyric = document.getElementsByClassName('lyrics')[0];
            const modalLyric = document.getElementById('modalLyrics');
            
            try {
              const response = await fetch('https://api.vagalume.com.br/search.php?apikey=' + API_KEY + '&art=' + currentArtist + '&mus=' + currentSong.toLowerCase());
              const data = await response.json();
          
              if (data.type === 'exact' || data.type === 'aprox') {
                const lyric = data.mus[0].text;
          
                //document.getElementById('lyric').textContent = lyric.replace(/\n/g, '<br />'); Use textContent em vez de innerHTML
                document.getElementById('lyric').innerHTML = lyric.replace(/\n/g, '<br />');
                openLyric.style.opacity = "1";
                openLyric.setAttribute('data-toggle', 'modal');
          
                // Esconde o modal caso esteja visível
                modalLyric.style.display = "none";
                modalLyric.setAttribute('aria-hidden', 'true');
                if (document.getElementsByClassName('modal-backdrop')[0]) {
                  document.getElementsByClassName('modal-backdrop')[0].remove();
                }
              } else {
                openLyric.style.opacity = "0.3";
                openLyric.removeAttribute('data-toggle');
              }
            } catch (error) {
              console.error("Erro ao buscar a letra da música:", error);
              openLyric.style.opacity = "0.3";
              openLyric.removeAttribute('data-toggle');
            }
        };
    }
}


async function getStreamingData() {
    try {
      const response = await fetch(API_URL);
  
      if (!response.ok) {
        throw new Error(`Error in API request: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
  
      if (data.length === 0) {
        console.log('%cdebug', 'font-size: 22px'); 
      } else {
        const page = new Page();
  
        // Formating characters to UTF-8
        const currentSong = data.currentSong.replace(/&apos;/g, '\'').replace(/&amp;/g, '&');
        const currentArtist = data.currentArtist.replace(/&apos;/g, '\'').replace(/&amp;/g, '&');
  
        // Change the title
        document.title = currentSong + ' - ' + currentArtist + ' | ' + RADIO_NAME;
  
        if (document.getElementById('currentSong').innerHTML !== currentSong) {
          page.refreshCover(currentSong, currentArtist);
          page.refreshCurrentSong(currentSong, currentArtist);
          page.refreshLyric(currentSong, currentArtist);
  
          for (let i = 0; i < 4; i++) {
            page.refreshHistoric(data.songHistory[i], i);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching streaming data:", error); 
    }
}

// AUDIO 


// Variável global para armazenar as músicas
//var audio = new Audio(URL_STREAMING); 
var audio = new Audio(URL_STREAMING + '/radio');

// Player control
class Player {
    constructor() {
        this.play = function () {
            audio.play();

            var defaultVolume = document.getElementById('volume').value;

            if (typeof (Storage) !== 'undefined') {
                if (localStorage.getItem('volume') !== null) {
                    audio.volume = intToDecimal(localStorage.getItem('volume'));
                } else {
                    audio.volume = intToDecimal(defaultVolume);
                }
            } else {
                audio.volume = intToDecimal(defaultVolume);
            }
            document.getElementById('volIndicator').innerHTML = defaultVolume;
            
            togglePlay(); // Add this line to update the button
        };

        this.pause = function () {
            audio.pause();
        };
    }
}

// On play, change the button to pause
audio.onplay = function () {
    var botao = document.getElementById('playerButton');
    var bplay = document.getElementById('buttonPlay');
    if (botao.className === 'fa fa-play') {
        botao.className = 'fa fa-pause';
        bplay.firstChild.data = 'PAUSE';
    }
}

// On pause, change the button to play
audio.onpause = function () {
    var botao = document.getElementById('playerButton');
    var bplay = document.getElementById('buttonPlay');
    if (botao.className === 'fa fa-pause') {
        botao.className = 'fa fa-play';
        bplay.firstChild.data = 'PLAY';
    }
}

// Unmute when volume changed
audio.onvolumechange = function () {
    if (audio.volume > 0) {
        audio.muted = false;
    }
}

document.getElementById('volume').oninput = function () {
    audio.volume = intToDecimal(this.value);

    var page = new Page();
    page.changeVolumeIndicator(this.value);
}


function togglePlay() {
    const playerButton = document.getElementById("playerButton");
    const isPlaying = playerButton.classList.contains("fa-pause");
  
    if (isPlaying) {
      playerButton.classList.remove("fa-pause");
      playerButton.classList.add("fa-play");
      playerButton.style.textShadow = "0 0 5px black";
      audio.pause();
    } else {
      playerButton.classList.remove("fa-play");
      playerButton.classList.add("fa-pause");
      playerButton.style.textShadow = "0 0 5px black";
      audio.load();
      audio.play();
    }
  }

function volumeUp() {
    var vol = audio.volume;
    if(audio) {
        if(audio.volume >= 0 && audio.volume < 1) {
            audio.volume = (vol + .01).toFixed(2);
        }
    }
}

function volumeDown() {
    var vol = audio.volume;
    if(audio) {
        if(audio.volume >= 0.01 && audio.volume <= 1) {
            audio.volume = (vol - .01).toFixed(2);
        }
    }
}

function mute() {
    if (!audio.muted) {
        document.getElementById('volIndicator').innerHTML = 0;
        document.getElementById('volume').value = 0;
        audio.volume = 0;
        audio.muted = true;
    } else {
        var localVolume = localStorage.getItem('volume');
        document.getElementById('volIndicator').innerHTML = localVolume;
        document.getElementById('volume').value = localVolume;
        audio.volume = intToDecimal(localVolume);
        audio.muted = false;
    }
}

document.addEventListener('keydown', function (event) {
    var key = event.key;
    var slideVolume = document.getElementById('volume');
    var page = new Page();

    switch (key) {
        // Arrow up
        case 'ArrowUp':
            volumeUp();
            slideVolume.value = decimalToInt(audio.volume);
            page.changeVolumeIndicator(decimalToInt(audio.volume));
            break;
        // Arrow down
        case 'ArrowDown':
            volumeDown();
            slideVolume.value = decimalToInt(audio.volume);
            page.changeVolumeIndicator(decimalToInt(audio.volume));
            break;
        // Spacebar
        case ' ':
        case 'Spacebar':
            togglePlay();
            break;
        // P
        case 'p':
        case 'P':
            togglePlay();
            break;
        // M
        case 'm':
        case 'M':
            mute();
            break;
        // Numeric keys 0-9
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            var volumeValue = parseInt(key);
            audio.volume = volumeValue / 10;
            slideVolume.value = volumeValue * 10;
            page.changeVolumeIndicator(volumeValue * 10);
            break;
    }
});


function intToDecimal(vol) {
    return vol / 100;
}

function decimalToInt(vol) {
    return vol * 100;
}
