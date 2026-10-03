const RADIO_NAME = 'mbah nunung Online Live';

// Change Stream URL Here, Supports, ICECAST, ZENO, SHOUTCAST, RADIOJAR and any other stream service.
const URL_STREAMING = 'https://scure.streaming.id:8000/mbahnunungonline';

// You can find the mount point in the Broadcast Settings.
// To generate the Zeno Radio API link from the mount point,
// exclude the '/source' part and append the remaining mount point to the base URL of the API.
// For example, if the mount point is 'yn65fsaurfhvv/source',
// the API link will be 'https://api.zeno.fm/mounts/metadata/subscribe/yn65fsaurfhvv'.

const url = 'https://api.zeno.fm/mounts/metadata/subscribe/duauceloe8bvv';

// Change DEFAULT COVER
const DEFAULT_COVER_ART = 'https://live.staticflickr.com/65535/53459011184_1df18fcc82_b.jpg';

// Variable to control history display: true = display / false = hides
let showHistory = true; 

window.onload = function () {
    var page = new Page;
    page.changeTitlePage();
    page.setVolume();

    var radioName = document.getElementById('radioName');
    if (radioName) radioName.textContent = RADIO_NAME;

    var player = new Player();
    player.play();

    // The music data currently being played arrives via SSE (connectToEventSource).
    // not via polling. The height of the cover is the responsibility of the CSS (aspect-ratio).

    localStorage.removeItem('musicHistory');
}

// Letter cache: stores the Promise itself (not just the result) so that
// two nearly simultaneous calls for the same song (SSE + polling)
// Reuse the same request instead of hammering the APIs again.
var lyricsCache = {};

function fetchLyrics(currentArtist, currentSong) {
    var cacheKey = (currentArtist + ' - ' + currentSong).toLowerCase();
    if (lyricsCache[cacheKey]) {
        return lyricsCache[cacheKey];
    }

    var promise = (async function () {
        // The Vagalume API has been discontinued — search on lyrics.ovh and,
        // if you don't find it, on LRCLIB (none require an API key).
        var lyric = null;
        try {
            var response = await fetch('https://api.lyrics.ovh/v1/' + encodeURIComponent(currentArtist) + '/' + encodeURIComponent(currentSong));
            var data = await response.json();
            if (data && data.lyrics) lyric = data.lyrics;
        } catch (error) {}

        if (!lyric) {
            try {
                var responseGet = await fetch('https://lrclib.net/api/get?artist_name=' + encodeURIComponent(currentArtist) + '&track_name=' + encodeURIComponent(currentSong));
                if (responseGet.ok) {
                    var dataGet = await responseGet.json();
                    lyric = dataGet.plainLyrics || dataGet.syncedLyrics || null;
                }
            } catch (error) {}
        }

        if (!lyric) {
            try {
                var responseSearch = await fetch('https://lrclib.net/api/search?track_name=' + encodeURIComponent(currentSong) + '&artist_name=' + encodeURIComponent(currentArtist));
                if (responseSearch.ok) {
                    var results = await responseSearch.json();
                    var hit = Array.isArray(results) && results.find(function (r) { return r.plainLyrics || r.syncedLyrics; });
                    if (hit) lyric = hit.plainLyrics || hit.syncedLyrics;
                }
            } catch (error) {}
        }

        return lyric;
    })();

    lyricsCache[cacheKey] = promise;
    return promise;
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

        // Artist Covers - Below 
  this.refreshCover = function (song = '', artist) {
        const BEN_ISTIQOMAH = 'https://i.scdn.co/image/ab67616d0000b273fb6ff58fc0ee0612de81ce89';
        const BluëKUtHUQ = 'https://i.scdn.co/image/ab67616d0000b2735e77f9aae722825ea3cc7238';
        const Della_Monica = 'https://i1.sndcdn.com/artworks-000691872055-4fze2e-t500x500.jpg';
        const Erina = 'https://i.ytimg.com/vi/1NTsu5MhbpA/sddefault.jpg';
        const R29_PROJECT = 'https://i.imgur.com/wXSk952.jpg';
        const JINGLE = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiwRqAS90NVntGw3KRvRy8ZfMmOWAUH6r7-0fDph8OXZE5aOEE8VHnvNP4DqpPNTOaQ6eqJJUpyW-QG9092-UjOCnbw4hzHXkZ4q4_68WeZHMqWHcUW6qV42XVK-EJhiqNSLXwveYZnUGWuSs6QOy0bz2omDTyrE-yUay1TbClQS5a91JjyKskyNtWT0bRo/s1600/ed6F7ZU.jpg';
        const TANDAWAKTUSHOLATDHUHUR = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg2F9RU0k7w_EWKjhsDP-YJAfCnFxFzW21G8mqmiSDSf-J5ocGv4yOjb5nuGFhlJW9iBAPWgjEn4jhr-bt-CK84RGFtJf6JneNMZgpbYV1Mi-mwbr7rzeu77mm-MqL7rbk_8O5sduTnGPdMj000VGVCbGc_gR1IgAr6-FrDcXpg-vun-lebVxtLEnuGAwUz/s1600/m2iqnIm.jpg';
        const ASHAR = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjAkb2u1BXZyewCrcabezpQsAP5OVlOJBW1bSR2VD3Ct497ubsePRslOC74TCSna3aKQoPo8j_oPsX0UZpC1Qau0-pztX0uH66cuxA2F017wwnoFXYauEwaJPiqLEjtepu4PH0xxwVVIXExDIRCw7yWREoGPxQ5pN-gLftIwtSJD7fcUOgeuGMtGAyR-RYu/s1600/uJr1nZIi_t.jpg';
        const ADZANMAGHRIB = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiNqNb72rVTrjbv4OaLt1qAFkjySlaFJp34YyC_XJ6RNtoBXq_bYSp8cmubhyphenhyphenKBUxxytuneVwHHCSMmomBwSYN4LdmH6QXTV1e5YIkjTS0677w_lnuMqX3isz5WIhFO_6pAHJriBkQyevuv5AgH1_hpsoQYsliB_5KsyFzXi2STQ9GGKWIB9l5IiAg8_uuc/s1600/sXTgm2j.jpg';
        const OpeningRadio = 'https://cdn.bintangtenggarafm.com/img/oJTOhsL.jpg';
        const LAGUPENUTUPRADIO = 'https://is4-ssl.mzstatic.com/image/thumb/Music122/v4/ec/3f/64/ec3f643b-0ffd-eb61-9ccf-c8d2c027594f/3ad3589a-548e-4b13-970c-83a2937c7d5c.jpg/1200x1200bb.jpg';
        const Citizen = 'https://thumbs2.imgbox.com/b1/29/LxXCnvNr_t.jpg';
        const JELAJAHDESA = 'https://thumbs2.imgbox.com/7e/dc/vOGdajpd_t.jpg';
        const WISATABUDAYA = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj76_ShbSLBp_jr_Og-mX5b-010-7qIIEPM3ZZeN84zyldmyMX2NS-yLfMPZLa46N7tBFwX8EKlwbUe-9wqU6U_0FO2jV54YFdV0AEvhW0r8jAa5YAE-5TCHgS-uB2HUVHHj0MN9P8xhg5jHAFY-3tMvD_u1BvHdUScYgev4ZcBSCrepzs_75lcKn4dAOdN/s1600/G8Qnr1y.jpg';
        const SHOLAWAT = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiIpqY48J4bs8uxDW02DXU_87iAkbYboTn0pxJQ5p0wyoQKt4YYr7BnqczK2UhAcbHkeUyM2m-5IHhUD_jTvWts-7HPMgRU1s4ZJsstS-Kq74NNqHRgsdxkrUoEGhttVFPkCjjR_O766XT_r1WaC2kcUgwkAP9zWSXLzvocqlz-0Y8NU3ViCiC-T9Jfb5bz/s1600/Wf3SDEt.png';
        const Obat_Ngamuk_Musik = 'https://yt3.googleusercontent.com/vSvjbnhJBqc7actv7I_h5xyMRBD5XyV2L6dNHuHPznbfbxOVivrA46bfNkmfhzl9E6PRI55M=s900-c-k-c0x00ffffff-no-rj';
        const AlffyRev  = 'https://i.scdn.co/image/ab67616d0000b273d0572746e75788f3a073899b';
        const Ajeng = 'https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/e5/47/cf/e547cfe3-f707-7175-9123-b640435f6a8c/cover.jpg/1200x1200bb.jpg';
        const Agnes_Monica = 'https://i.scdn.co/image/ab6761610000e5eb09160e5ffdc256e65713a8a9';
        const Alfian = 'https://i.scdn.co/image/ab67616d0000b27383d45abd325bfbc2f40a3911';
        const Silvy_Kumalasari = 'https://i.scdn.co/image/ab67616d0000b273d71eca8092e27dcf98065257';
        const Ari_Lasso = 'https://i.scdn.co/image/ab6761610000e5eb4e1ed336c3ff93a95fa44e14';
        const Krismi_Rolas = 'https://thumbs2.imgbox.com/2b/5c/X4oKMJh2_t.png';
        const Andmesh = 'https://i1.sndcdn.com/artworks-000644192974-fr8aja-t500x500.jpg';
        const Dewa_19_Ft_Virzha = 'https://i.scdn.co/image/ab67616d0000b2734383e26d01a2dd18452b7b37';
        const Dewa_19_Ft_Ello = 'https://i.scdn.co/image/ab67616d0000b2730b591f8644a5a5106169a30a';
        const All_Artist_BWI = 'https://i.imgur.com/0ZsVrXs.jpg';
        const EghaLatoya  = 'https://i1.sndcdn.com/artworks-000145717002-8rm80q-t500x500.jpg';
        const GamelAwan = 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/99/b5/ef/99b5ef28-8196-0307-dd64-d3defa86eb50/cover.jpg/1200x1200bb.png';
        const Adistya = 'https://i.scdn.co/image/ab67616d0000b273cac7c5e2d5bf5e61ebcbfae1';
        const DemyYoker = 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/c6/6d/ba/c66dba5b-2972-3f16-ba13-f21eb6705287/cover.jpg/1200x1200bb.jpg';
        const Rozy = 'https://yt3.googleusercontent.com/bVsSfzG_MypgqaF7swIY38nCEMleUrl48DAJUpEFMXeruwfcXhYYTKw9YkF4-IzVCF42-s6a=s900-c-k-c0x00ffffff-no-rj';
        const Reny = 'https://cdns-images.dzcdn.net/images/cover/c4618c2ceba8781cb55443690a11c07d/1900x1900-000000-80-0-0.jpg';
        const Kurnia_Dewi = 'https://thumbs2.imgbox.com/25/17/7EGrbSWQ_t.jpg';
        const AlviAnanta = 'https://i1.sndcdn.com/artworks-000691852279-zhd4cw-t500x500.jpg';
        const Catur_Arum  = 'https://i1.sndcdn.com/artworks-000227858822-l8w6ww-t500x500.jpg'; 
        const Syahiba_Saufa_Ft_Shinta_Arsinta = 'https://i.scdn.co/image/ab67616d0000b2737dd4ba70910664a26fb1c7e0'; 
        const Lusiana = 'https://thumbs2.imgbox.com/da/bd/1aijXmkg_t.jpg'; 
        const Suliyana = 'https://i.scdn.co/image/ab67616d0000b2733e4c6986797db1877c5be37d';
        const Syahiba = 'https://i.scdn.co/image/ab67616d0000b27378fdcad5374c66bd8f7321c5'; 
        const OmpRock = 'https://i1.sndcdn.com/artworks-000069866100-96taaq-t500x500.jpg';
        const Virgia_Hassan = 'https://i.ytimg.com/vi/g3A7Cp2yAro/maxresdefault.jpg';
        const Vita = 'https://live.staticflickr.com/65535/53458574431_71955797d8_z.jpg';
        const Melinda_Varera = 'https://i.scdn.co/image/ab67616d0000b2739e8575dbb9c92a4f3984a811'; 
        const Furkan_Sert = 'https://i.scdn.co/image/ab67616d0000b27301f62d04407be638080c7293'; 
        
        if (artist == 'BEN ISTIQOMAH') {var urlCoverArt = BEN_ISTIQOMAH;}
            else if (artist == 'BluëKUtHUQ') {var urlCoverArt = BluëKUtHUQ;}
            else if (artist == 'Della Monica') {var urlCoverArt = Della_Monica;}
            else if (artist == 'Erina') {var urlCoverArt = Erina;}
            else if (artist == 'R29 PROJECT') {var urlCoverArt = R29_PROJECT;}
            else if (artist == 'JINGLE') {var urlCoverArt = JINGLE;}
            else if (artist == 'TANDA WAKTU SHOLAT DHUHUR') {var urlCoverArt = TANDAWAKTUSHOLATDHUHUR;}
            else if (artist == 'TANDA WAKTU SHOLAT ASHAR') {var urlCoverArt = ASHAR;}
            else if (artist == 'ADZAN MAGHRIB') {var urlCoverArt = ADZANMAGHRIB;}
            else if (artist == 'Opening Radio') {var urlCoverArt = OpeningRadio;}
            else if (artist == 'LAGU PENUTUP RADIO') {var urlCoverArt = LAGUPENUTUPRADIO;}
            else if (artist == 'Citizen Journalism') {var urlCoverArt = Citizen;}
            else if (artist == 'JELAJAH DESA') {var urlCoverArt = JELAJAHDESA;}
            else if (artist == 'WISATA BUDAYA') {var urlCoverArt = WISATABUDAYA;}
            else if (artist == 'SHOLAWAT THIBBIL QULUB') {var urlCoverArt = SHOLAWAT;}
            else if (artist == 'Obat Ngamuk Musik') {var urlCoverArt = Obat_Ngamuk_Musik;}
            else if (artist == 'Alffy Rev') {var urlCoverArt = AlffyRev;}
            else if (artist == 'Ajeng') {var urlCoverArt = Ajeng;}
            else if (artist == 'Agnes Monica') {var urlCoverArt = Agnes_Monica;}
            else if (artist == 'Alfian') {var urlCoverArt = Alfian;}
            else if (artist == 'Silvy Kumalasari') {var urlCoverArt = Silvy_Kumalasari;}
            else if (artist == 'Ari Lasso') {var urlCoverArt = Ari_Lasso;}
            else if (artist == 'Krismi Rolas') {var urlCoverArt = Krismi_Rolas;}
            else if (artist == 'Andmesh') {var urlCoverArt = Andmesh;}
            else if (artist == 'Dewa 19 Ft Virzha') {var urlCoverArt = Dewa_19_Ft_Virzha;}
            else if (artist == 'All Artist BWI') {var urlCoverArt = All_Artist_BWI;}
            else if (artist == 'Egha De Latoya') {var urlCoverArt = EghaLatoya;}
            else if (artist == 'Gamel Awan') {var urlCoverArt = GamelAwan;}
            else if (artist == 'Adistya Mayasari') {var urlCoverArt = Adistya;}
            else if (artist == 'Demy Yoker') {var urlCoverArt = DemyYoker;}
            else if (artist == 'Rozy Abdillah') {var urlCoverArt = Rozy;} 
            else if (artist == 'Reny Farida') {var urlCoverArt = Reny;} 
            else if (artist == 'Kurnia Dewi') {var urlCoverArt = Kurnia_Dewi;} 
            else if (artist == 'Alvi Ananta') {var urlCoverArt = AlviAnanta;} 
            else if (artist == 'Catur Arum') {var urlCoverArt = Catur_Arum;} 
            else if (artist == 'Syahiba Saufa Ft. Shinta Arsinta') {var urlCoverArt = Syahiba_Saufa_Ft_Shinta_Arsinta;} 
            else if (artist == 'Lusiana Safara') {var urlCoverArt = Lusiana;} 
            else if (artist == 'Suliyana') {var urlCoverArt = Suliyana;} 
            else if (artist == 'Syahiba Saufa') {var urlCoverArt = Syahiba;} 
            else if (artist == 'OmpRock') {var urlCoverArt = OmpRock;} 
            else if (artist == 'Virgia Hassan') {var urlCoverArt = Virgia_Hassan;} 
            else if (artist == 'Vita Alvia') {var urlCoverArt = Vita;} 
            else if (artist == 'Melinda Varera') {var urlCoverArt = Melinda_Varera;} 
            else if (artist == 'Furkan Sert') {var urlCoverArt = Furkan_Sert;} 
        // Default cover art
        else {var urlCoverArt = DEFAULT_COVER_ART;}
        
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            var coverArt = document.getElementById('currentCoverArt');
            var coverBackground = document.getElementById('bgCover');

           // Get cover art URL on iTunes API
            if (this.readyState === 4 && this.status === 200) {
                var data = JSON.parse(this.responseText);
                var artworkUrl100 = (data.resultCount) ? data.results[0].artworkUrl100 : urlCoverArt;

                // If it returns any data, changes the image resolution or sets the default
                urlCoverArt = (artworkUrl100 != urlCoverArt) ? artworkUrl100.replace('100x100bb', '1200x1200bb') : urlCoverArt;
                var urlCoverArt96 = (artworkUrl100 != urlCoverArt) ? urlCoverArt.replace('1200x1200bb', '96x96bb') : urlCoverArt;
                var urlCoverArt128 = (artworkUrl100 != urlCoverArt) ? urlCoverArt.replace('1200x1200bb', '128x128bb') : urlCoverArt;
                var urlCoverArt192 = (artworkUrl100 != urlCoverArt) ? urlCoverArt.replace('1200x1200bb', '192x192bb') : urlCoverArt;
                var urlCoverArt256 = (artworkUrl100 != urlCoverArt) ? urlCoverArt.replace('1200x1200bb', '256x256bb') : urlCoverArt;
                var urlCoverArt384 = (artworkUrl100 != urlCoverArt) ? urlCoverArt.replace('1200x1200bb', '384x384bb') : urlCoverArt;

                coverArt.style.backgroundImage = 'url(' + urlCoverArt + ')';
                coverArt.className = 'animated bounceInLeft';

                coverBackground.style.backgroundImage = 'url(' + urlCoverArt + ')';

                setTimeout(function () {
                    coverArt.className = '';
                }, 2000);

                if ('mediaSession' in navigator) {
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: song,
                        artist: artist,
                        artwork: [{
                                src: urlCoverArt96,
                                sizes: '96x96',
                                type: 'image/png'
                            },
                            {
                                src: urlCoverArt128,
                                sizes: '128x128',
                                type: 'image/png'
                            },
                            {
                                src: urlCoverArt192,
                                sizes: '192x192',
                                type: 'image/png'
                            },
                            {
                                src: urlCoverArt256,
                                sizes: '256x256',
                                type: 'image/png'
                            },
                            {
                                src: urlCoverArt384,
                                sizes: '384x384',
                                type: 'image/png'
                            },
                            {
                                src: urlCoverArt,
                                sizes: '512x512',
                                type: 'image/png'
                            }
                        ]
                    });
                }
            }
        }
        xhttp.open('GET', 'https://itunes.apple.com/search?term=' + artist + ' ' + song + '&media=music&limit=1', true);
        xhttp.send();
        }

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

        this.refreshLyric = async function (currentSong, currentArtist) {
            var lyric = await fetchLyrics(currentArtist, currentSong);

            var openLyric = document.getElementsByClassName('lyrics')[0];
            if (lyric) {
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
        };
    }
}

// Global variable to store the songs
var audio = new Audio(URL_STREAMING);

// Player control
class Player {
    constructor() {
        this.play = function () {
            var playPromise = audio.play();
            if (playPromise !== undefined) {
                // Autoplay blocked by the browser until the first interaction:
                // It's not an error; the user starts playback manually.
                playPromise.catch(function () {});
            }

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

function setPlayerIcon(iconClass, label) {
    var botao = document.getElementById('playerButton');
    var bplay = document.getElementById('buttonPlay');
    botao.className = iconClass;
    bplay.firstChild.data = label;
}

// On play, change the button to pause
audio.onplay = function () {
    setPlayerIcon('fa fa-pause', 'PAUSE');
}

// On pause, change the button to play (unless we are displaying the
// reconnection spinner, which also momentarily pauses the audio)
audio.onpause = function () {
    if (!isIntentionalPause && reconnectAttempts > 0) return;
    setPlayerIcon('fa fa-play', 'PLAY');
}

// While the audio is buffering, show the spinning spinner.
audio.addEventListener('waiting', function () {
    if (!audio.paused) setPlayerIcon('fa fa-spinner fa-spin', 'CARREGANDO');
});

// Audio is flowing properly again: reset reconnection attempts and
// enables the watchdog (from this point on, a disconnection should automatically reconnect)
audio.addEventListener('playing', function () {
    isIntentionalPause = false;
    reconnectAttempts = 0;
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    setPlayerIcon('fa fa-pause', 'PAUSE');
});

// Unmute when volume changed
audio.onvolumechange = function () {
    if (audio.volume > 0) {
        audio.muted = false;
    }
}

// Automatic reconnection (unstable network) before bothering the user with the
// "Stream Down" confirm() — only appears if 5 consecutive attempts fail.
// It starts as *true*: before the first actual playback, there is nothing to reconnect.
// (e.g., a stream going offline while loading should not trigger a loop or a confirmation prompt).
let isIntentionalPause = true;
let reconnectAttempts = 0;
let reconnectTimeout = null;

function handleConnectionDrop() {
    if (isIntentionalPause) return;

    if (reconnectTimeout) clearTimeout(reconnectTimeout);

    if (reconnectAttempts < 5) {
        reconnectAttempts++;
        setPlayerIcon('fa fa-spinner fa-spin', 'RECONECTANDO');
        var delay = reconnectAttempts * 2000;

        reconnectTimeout = setTimeout(function () {
            audio.load();
            var playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(function (e) { console.error('Falha ao reconectar:', e); });
            }
        }, delay);
    } else {
        reconnectAttempts = 0;
        setPlayerIcon('fa fa-play', 'PLAY');

        var confirmacao = confirm('Stream Down / Network Error. \nClick OK to try again.');
        if (confirmacao) {
            window.location.reload();
        }
    }
}

audio.onerror = handleConnectionDrop;
audio.addEventListener('stalled', handleConnectionDrop);

// Smooth volume fade when playing/pausing to avoid audio "popping."
let fadeInterval = null;

function fadeOut(callback) {
    if (fadeInterval) clearInterval(fadeInterval);
    var currentVol = audio.volume;
    var step = currentVol / 15;

    fadeInterval = setInterval(function () {
        currentVol -= step;
        if (currentVol <= 0.05) {
            audio.volume = 0;
            clearInterval(fadeInterval);
            fadeInterval = null;
            if (callback) callback();
        } else {
            audio.volume = currentVol;
        }
    }, 30);
}

function fadeIn() {
    if (fadeInterval) clearInterval(fadeInterval);
    var targetVol = intToDecimal(localStorage.getItem('volume') || document.getElementById('volume').value || 80);
    audio.volume = 0;
    var step = targetVol / 15;

    fadeInterval = setInterval(function () {
        var newVol = audio.volume + step;
        if (newVol >= targetVol) {
            audio.volume = targetVol;
            clearInterval(fadeInterval);
            fadeInterval = null;
        } else {
            audio.volume = newVol;
        }
    }, 30);
}

document.getElementById('volume').oninput = function () {
    audio.volume = intToDecimal(this.value);

    var page = new Page();
    page.changeVolumeIndicator(this.value);
}

function togglePlay() {
    if (!audio.paused) {
        isIntentionalPause = true;
        if (reconnectTimeout) clearTimeout(reconnectTimeout);
        fadeOut(function () {
            audio.pause();
        });
    } else {
        isIntentionalPause = false;
        fadeIn();
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

// Function to handle event connections
function connectToEventSource(url) {
    // Create a new EventSource instance with the provided URL.
    const eventSource = new EventSource(url);

    // Add a listener for the 'message' event
    eventSource.addEventListener('message', function(event) {
        // Call the function to process the received data, passing the URL as well.
        processData(event.data, url);
    });

    // Add a listener for the 'error' event
    eventSource.addEventListener('error', function(event) {
        console.error('Erro na conexão de eventos:', event);
        // Try to reconnect after a period of time
        setTimeout(function() {
            connectToEventSource(url);
        }, 1000);
    });
}

// Function to process the received data
function processData(data) {
    // Parse JSON
    const parsedData = JSON.parse(data);
    
    // Check if the message is about the song.
    if (parsedData.streamTitle) {
        // Extract the song title and the artist
        let artist, song;
        const streamTitle = parsedData.streamTitle;

        if (streamTitle.includes('-')) {
            [artist, song] = streamTitle.split(' - ');
        } else {
            // If there is no "-" in the string, we consider the title to be just the song name.
            artist = '';
            song = streamTitle;
        }

        // Create the object with the formatted data.
        const formattedData = {
            currentSong: song.trim(),
            currentArtist: artist.trim()
        };

        // Convert the object to JSON
        const jsonData = JSON.stringify(formattedData);

        // Call the getStreamingData function with the formatted data and the URL.
        getStreamingData(jsonData);
    } else {
        console.log('Mensagem recebida:', parsedData);
    }
}

// Initiate the connection to the API
connectToEventSource(url);

// Defines the Deezer API response handling function in the global scope.
// JSONP only passes `data` — the current title/artist come from the DOM.
function handleDeezerResponse(data) {
    var coverArt = document.getElementById('currentCoverArt');
    var coverBackground = document.getElementById('bgCover');

    var hasResult = data && data.data && data.data.length > 0;
    // Search for the cover art by song title (artist.picture_big would search by artist)
    var artworkUrl = hasResult ? data.data[0].album.cover_big : 'https://live.staticflickr.com/65535/53459011184_1df18fcc82_b.jpg';

    coverArt.style.backgroundImage = 'url(' + artworkUrl + ')';
    coverArt.className = 'animated bounceInLeft';
    coverBackground.style.backgroundImage = 'url(' + artworkUrl + ')';

    setTimeout(function () {
        coverArt.className = '';
    }, 2000);

    if ('mediaSession' in navigator) {
        var songTitle = document.getElementById('currentSong').textContent;
        // O ICY é lei: o Deezer só fornece a capa — o artista exibido (na
        // tela e na tela de bloqueio) é sempre o que a rádio transmitiu
        var artistName = document.getElementById('currentArtist').textContent;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: songTitle,
            artist: artistName,
            artwork: ['96x96', '128x128', '192x192', '256x256', '384x384', '512x512'].map(function (size) {
                return { src: artworkUrl, sizes: size, type: 'image/png' };
            })
        });
    }
}

function getStreamingData(data) {

    console.log("Conteúdo dos dados recebidos:", data);
    // Parse JSON
    var jsonData = JSON.parse(data);

    var page = new Page();

    // Format characters as UTF-8
    let song = jsonData.currentSong.replace(/&apos;/g, '\'').replace(/&amp;/g, '&');
    let artist = jsonData.currentArtist.replace(/&apos;/g, '\'').replace(/&amp;/g, '&');

    // Change the title
    document.title = song + ' - ' + artist + ' | ' + RADIO_NAME;

    page.refreshCover(song, artist);
    page.refreshCurrentSong(song, artist);
    page.refreshLyric(song, artist);

    if (showHistory) {

        // Check if the song is different from the last updated one.
        if (musicHistory.length === 0 || (musicHistory[0].song !== song)) {
            // Update the history with the new song
            updateMusicHistory(artist, song);
        }

        // Update the history interface
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

// Global variable to store the history of the last two songs
var musicHistory = [];

// Function to update the history of the last two songs
function updateMusicHistory(artist, song) {
    // Adicionar a nova música no início do histórico
    musicHistory.unshift({ artist: artist, song: song });

    // Keep only the last two songs in the history
    if (musicHistory.length > 4) {
        musicHistory.pop(); // Remove a música mais antiga do histórico
    }

    // Call the function to display the updated history.
    displayHistory();
}


function displayHistory() {
    var $historicDiv = document.querySelectorAll('#historicSong article');
    var $songName = document.querySelectorAll('#historicSong article .music-info .song');
    var $artistName = document.querySelectorAll('#historicSong article .music-info .artist');

    // Display the last two songs in the history, starting from index 1 to exclude the current song
    for (var i = 1; i < musicHistory.length && i < 3; i++) {
        $songName[i - 1].innerHTML = musicHistory[i].song;
        $artistName[i - 1].innerHTML = musicHistory[i].artist;

        // Call the function to fetch the song cover art from the Deezer API.
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

// Function to update the song cover in the history
function refreshCoverForHistory(song, artist, index) {
    // Creating the script tag to make the JSONP request to the Deezer API
    const script = document.createElement('script');
    script.src = `https://api.deezer.com/search?q=${encodeURIComponent(artist)} ${encodeURIComponent(song)}&output=jsonp&callback=handleDeezerResponseForHistory_${index}`;
    document.body.appendChild(script);

    // Function to handle the Deezer API response for the song history.
    window['handleDeezerResponseForHistory_' + index] = function (data) {
        if (data.data && data.data.length > 0) {
            // Update the cover art based on the artist's name
            // var artworkUrl = data.data[0].artist.picture_big;
            // Update the cover art based on the song title
            var artworkUrl = data.data[0].album.cover_big;
            // Update the song cover in the history using the correct index.
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
        // Spacebar (preventDefault prevents page scrolling along)
        case ' ':
        case 'Spacebar':
            event.preventDefault();
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

// Install as PWA button: only appears when the browser indicates that the
// Installation is available (manifest + service worker already registered).
let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    deferredInstallPrompt = event;
    var installBtn = document.getElementById('installPwaBtn');
    if (installBtn) installBtn.hidden = false;
});

document.addEventListener('DOMContentLoaded', function () {
    var installBtn = document.getElementById('installPwaBtn');
    if (!installBtn) return;

    installBtn.addEventListener('click', function () {
        if (!deferredInstallPrompt) return;
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then(function () {
            deferredInstallPrompt = null;
            installBtn.hidden = true;
        });
    });

    window.addEventListener('appinstalled', function () {
        installBtn.hidden = true;
    });
});
