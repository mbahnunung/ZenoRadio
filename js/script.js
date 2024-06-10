const RADIO_NAME = 'Webradio';

// Change Stream URL Here, Supports, ICECAST, ZENO, SHOUTCAST, RADIOJAR and any other stream service.
const URL_STREAMING = 'https://stream.zeno.fm/n4gzbe9ufzzuv';

// You can find the mount point in the Broadcast Settings.
// To generate the Zeno Radio API link from the mount point,
// exclude the '/source' part and append the remaining mount point to the base URL of the API.
// For example, if the mount point is 'yn65fsaurfhvv/source',
// the API link will be 'https://api.zeno.fm/mounts/metadata/subscribe/yn65fsaurfhvv'.

const url = 'https://api.zeno.fm/mounts/metadata/subscribe/n4gzbe9ufzzuv';

// Visit https://api.vagalume.com.br/docs/ to get your API key
const API_KEY = "18fe07917957c289983464588aabddfb";

// Variable to control history display: true = display / false = hides
let showHistory = true; 

window.onload = function () {
    var page = new Page;
    page.changeTitlePage();
    page.setVolume();

    var player = new Player();
    player.play();

    getStreamingData();
    // Interval to get streaming data in miliseconds
    setInterval(function () {
        getStreamingData();
    }, 10000);

    var coverArt = document.getElementsByClassName('cover-album')[0];

    coverArt.style.height = coverArt.offsetWidth + 'px';

    localStorage.removeItem('musicHistory');
}

// DOM control
class Page {
    constructor() {
        this.changeTitlePage = function (title = RADIO_NAME) {
            document.title = title;
        };

        this.refreshCurrentSong = function (song, artist) {
            var currentSong = document.getElementById('currentSong');
            var currentArtist = document.getElementById('currentArtist');

            if (song !== currentSong.innerHTML) {
                // Animate transition
                currentSong.className = 'animated flipInY text-uppercase';
                currentSong.innerHTML = song;

                currentArtist.className = 'animated flipInY text-capitalize';
                currentArtist.innerHTML = artist;

                // Refresh modal title
                document.getElementById('lyricsSong').innerHTML = song + ' - ' + artist;

                // Remove animation classes
                setTimeout(function () {
                    currentSong.className = 'text-uppercase';
                    currentArtist.className = 'text-capitalize';
                }, 2000);
            }
        };

        // Function to update the cover
        this.refreshCover = function (song = '', artist) {
            // Default cover art
            var urlCoverArt = 'img/cover.png';

            // Creation of the script tag to make the JSONP request to the Deezer API
            const script = document.createElement('script');
            script.src = `https://api.deezer.com/search?q=${artist} ${song}&output=jsonp&callback=handleDeezerResponse`;
            document.body.appendChild(script);
        };


        this.changeVolumeIndicator = function (volume) {
            document.getElementById('volIndicator').innerHTML = volume;

            if (typeof (Storage) !== 'undefined') {
                localStorage.setItem('volume', volume);
            }
        };

        this.setVolume = function () {
            if (typeof (Storage) !== 'undefined') {
                var volumeLocalStorage = (!localStorage.getItem('volume')) ? 80 : localStorage.getItem('volume');
                document.getElementById('volume').value = volumeLocalStorage;
                document.getElementById('volIndicator').innerHTML = volumeLocalStorage;
            }
        };

        this.refreshLyric = function (currentSong, currentArtist) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    var data = JSON.parse(this.responseText);

                    var openLyric = document.getElementsByClassName('lyrics')[0];

                    if (data.type === 'exact' || data.type === 'aprox') {
                        var lyric = data.mus[0].text;

                        document.getElementById('lyric').innerHTML = lyric.replace(/\n/g, '<br />');
                        openLyric.style.opacity = "1";
                        openLyric.setAttribute('data-toggle', 'modal');
                    } else {
                        openLyric.style.opacity = "0.3";
                        openLyric.removeAttribute('data-toggle');

                        var modalLyric = document.getElementById('modalLyrics');
                        modalLyric.style.display = "none";
                        modalLyric.setAttribute('aria-hidden', 'true');
                        (document.getElementsByClassName('modal-backdrop')[0]) ? document.getElementsByClassName('modal-backdrop')[0].remove() : '';
                    }
                } else {
                    document.getElementsByClassName('lyrics')[0].style.opacity = "0.3";
                    document.getElementsByClassName('lyrics')[0].removeAttribute('data-toggle');
                }
            };
            xhttp.open('GET', 'https://api.vagalume.com.br/search.php?apikey=' + API_KEY + '&art=' + currentArtist + '&mus=' + currentSong.toLowerCase(), true);
            xhttp.send();
        };
    }
}

// Global variable to store the songs
var audio = new Audio(URL_STREAMING);

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

audio.onerror = function () {
    var confirmacao = confirm('Stream Down / Network Error. \nClick OK to try again.');

    if (confirmacao) {
        window.location.reload();
    }
}

document.getElementById('volume').oninput = function () {
    audio.volume = intToDecimal(this.value);

    var page = new Page();
    page.changeVolumeIndicator(this.value);
}

function togglePlay() {
    if (!audio.paused) {
        audio.pause();
    } else {
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

// Function to handle event wiring
function connectToEventSource(url) {
    // Criar uma nova instância de EventSource com a URL fornecida
    const eventSource = new EventSource(url);

    // Add a listener for the 'message' event
    eventSource.addEventListener('message', function(event) {
        // Chamar a função para tratar os dados recebidos, passando a URL também
        processData(event.data, url);
    });

    // Add a listener for the 'error' event
    eventSource.addEventListener('error', function(event) {
        console.error('Erro na conexão de eventos:', event);
        // Tentar reconectar após um intervalo de tempo
        setTimeout(function() {
            connectToEventSource(url);
        }, 1000);
    });
}

// Function to process received data
function processData(data) {
    // Parse JSON
    const parsedData = JSON.parse(data);
    
    // Check if the message is about the song
    if (parsedData.streamTitle) {
        // Extract song title and artist
        let artist, song;
        const streamTitle = parsedData.streamTitle;

        if (streamTitle.includes('-')) {
            [artist, song] = streamTitle.split(' - ');
        } else {
            // If there is no "-" in the string, we consider the title to be just the name of the song
            artist = '';
            song = streamTitle;
        }

        // Create the object with the formatted data
        const formattedData = {
            currentSong: song.trim(),
            currentArtist: artist.trim()
        };

        // Convert the object to JSON
        const jsonData = JSON.stringify(formattedData);

        // Call the getStreamingData function with the formatted data and URL
        getStreamingData(jsonData);
    } else {
        console.log('Mensagem recebida:', parsedData);
    }
}

// Start connecting to the API
connectToEventSource(url);

// Defines the Deezer API response handling function in the global scope
function handleDeezerResponse(data, song) {
    var coverArt = document.getElementById('currentCoverArt');
    var coverBackground = document.getElementById('bgCover');

    if (data.data && data.data.length > 0) {
        // Search Cover by Artist name
        // var artworkUrl = data.data[0].artist.picture_big;
        // Search Cover by song name
        var artworkUrl = data.data[0].album.cover_big;

        coverArt.style.backgroundImage = 'url(' + artworkUrl + ')';
        coverArt.className = 'animated bounceInLeft';

        coverBackground.style.backgroundImage = 'url(' + artworkUrl + ')';
    } else {
        // Caso não haja dados ou a lista de dados esteja vazia,
        // defina a capa padrão
        var defaultArtworkUrl = 'img/cover.png';

        coverArt.style.backgroundImage = 'url(' + defaultArtworkUrl + ')';
        coverBackground.style.backgroundImage = 'url(' + defaultArtworkUrl + ')';
    }

    setTimeout(function () {
        coverArt.className = '';
    }, 2000);

    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: song,
            artist: data.data[0].artist.name,
            artwork: [{
                    src: artworkUrl || defaultArtworkUrl,
                    sizes: '96x96',
                    type: 'image/png'
                },
                {
                    src: artworkUrl || defaultArtworkUrl,
                    sizes: '128x128',
                    type: 'image/png'
                },
                {
                    src: artworkUrl || defaultArtworkUrl,
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: artworkUrl || defaultArtworkUrl,
                    sizes: '256x256',
                    type: 'image/png'
                },
                {
                    src: artworkUrl || defaultArtworkUrl,
                    sizes: '384x384',
                    type: 'image/png'
                },
                {
                    src: artworkUrl || defaultArtworkUrl,
                    sizes: '512x512',
                    type: 'image/png'
                }
            ]
        });
    }
}

function getStreamingData(data) {

    console.log("Conteúdo dos dados recebidos:", data);
    // Parse JSON
    var jsonData = JSON.parse(data);

    var page = new Page();

    // Formatar caracteres para UTF-8
    let song = jsonData.currentSong.replace(/&apos;/g, '\'').replace(/&amp;/g, '&');
    let artist = jsonData.currentArtist.replace(/&apos;/g, '\'').replace(/&amp;/g, '&');

    // Mudar o título
    document.title = song + ' - ' + artist + ' | ' + RADIO_NAME;

    page.refreshCover(song, artist);
    page.refreshCurrentSong(song, artist);
    page.refreshLyric(song, artist);

    if (showHistory) {

        // Verificar se a música é diferente da última atualizada
        if (musicHistory.length === 0 || (musicHistory[0].song !== song)) {
            // Atualizar o histórico com a nova música
            updateMusicHistory(artist, song);
        }

        // Atualizar a interface do histórico
        updateHistoryUI();

    }
}

function updateHistoryUI() {
    let historicElement = document.querySelector('.historic');
    if (showHistory) {
      historicElement.classList.remove('hidden'); // Show history
    } else {
      historicElement.classList.add('hidden'); // Hide history
    }
}

// Variável global para armazenar o histórico das duas últimas músicas
var musicHistory = [];

// Função para atualizar o histórico das duas últimas músicas
function updateMusicHistory(artist, song) {
    // Adicionar a nova música no início do histórico
    musicHistory.unshift({ artist: artist, song: song });

    // Manter apenas as duas últimas músicas no histórico
    if (musicHistory.length > 4) {
        musicHistory.pop(); // Remove a música mais antiga do histórico
    }

    // Chamar a função para exibir o histórico atualizado
    displayHistory();
}


function displayHistory() {
    var $historicDiv = document.querySelectorAll('#historicSong article');
    var $songName = document.querySelectorAll('#historicSong article .music-info .song');
    var $artistName = document.querySelectorAll('#historicSong article .music-info .artist');

    // Exibir as duas últimas músicas no histórico, começando do índice 1 para excluir a música atual
    for (var i = 1; i < musicHistory.length && i < 3; i++) {
        $songName[i - 1].innerHTML = musicHistory[i].song;
        $artistName[i - 1].innerHTML = musicHistory[i].artist;

        // Chamar a função para buscar a capa da música na API do Deezer
        refreshCoverForHistory(musicHistory[i].song, musicHistory[i].artist, i - 1);

        // Adicionar classe para animação
        $historicDiv[i - 1].classList.add('animated');
        $historicDiv[i - 1].classList.add('slideInRight');
    }

    // Remover classes de animação após 2 segundos
    setTimeout(function () {
        for (var j = 0; j < 2; j++) {
            $historicDiv[j].classList.remove('animated');
            $historicDiv[j].classList.remove('slideInRight');
        }
    }, 2000);
}

// Function to update song cover in history
function refreshCoverForHistory(song, artist, index) {
    // Creation of the script tag to make the JSONP request to the Deezer API
    const script = document.createElement('script');
    script.src = `https://api.deezer.com/search?q=${encodeURIComponent(artist)} ${encodeURIComponent(song)}&output=jsonp&callback=handleDeezerResponseForHistory_${index}`;
    document.body.appendChild(script);

    // Deezer API response handling function for music history
    window['handleDeezerResponseForHistory_' + index] = function (data) {
        if (data.data && data.data.length > 0) {
            // Update cover by artist name
            // var artworkUrl = data.data[0].artist.picture_big;
            // Update cover by song name
            var artworkUrl = data.data[0].album.cover_big;
            // Update song cover in history using correct index
            var $coverArt = document.querySelectorAll('#historicSong article .cover-historic')[index];
            $coverArt.style.backgroundImage = 'url(' + artworkUrl + ')';
        }
    };
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
