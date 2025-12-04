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

const RADIO_NAME = 'Bintang Tenggara - Live streaming';

// Change Stream URL Here, Supports, ICECAST, ZENO, SHOUTCAST, RADIOJAR ETC.... DOES NOT SUPPORT HLS
const URL_STREAMING = "https://sv.stri.my.id:3310/rbtfm"

// NEW UNIFIED API ENDPOINT
const API_URL = "https://sv.stri.my.id/api/nowplaying/27"

// Visit https://api.vagalume.com.br/docs/ to get your API key
const API_KEY = "18fe07917957c289983464588aabddfb"

// Loading state management
let isInitialLoad = true
let isDataLoaded = false

// Store current song data to prevent unnecessary updates
const currentSongData = {
  song: "",
  artist: "",
}

window.onload = () => {

  var page = new Page()
  page.changeTitlePage()
  page.setVolume()

  var player = new Player()
  player.play()

  // Initialize history items
  initializeHistoryItems()

  // Initial data fetch
  getStreamingData()


  // Interval to get streaming data in milliseconds
  setInterval(() => {
    getStreamingData()
  }, 4000)
}

// Loading state helpers
function showArtworkLoading() {
  const artwork = document.getElementById("currentCoverArt")
  if (artwork) {
    artwork.classList.add("loading")
  }
}

function hideArtworkLoading() {
  const artwork = document.getElementById("currentCoverArt")
  if (artwork) {
    artwork.classList.remove("loading")
  }
}

function showButtonLoading() {
  const button = document.querySelector(".btn-play")
  if (button) {
    button.classList.add("loading")
  }
}

function hideButtonLoading() {
  const button = document.querySelector(".btn-play")
  if (button) {
    button.classList.remove("loading")
  }
}

function showLyricsLoading() {
  const lyrics = document.querySelector(".lyrics")
  if (lyrics) {
    lyrics.classList.add("loading")
  }
}

function hideLyricsLoading() {
  const lyrics = document.querySelector(".lyrics")
  if (lyrics) {
    lyrics.classList.remove("loading")
  }
}

function showHistoryLoading() {
  const covers = document.querySelectorAll(".cover-historic")
  covers.forEach((cover) => {
    cover.classList.add("loading")
  })
}

function hideHistoryLoading() {
  const covers = document.querySelectorAll(".cover-historic")
  covers.forEach((cover) => {
    cover.classList.remove("loading")
  })
}

// DOM control
function Page() {
  this.changeTitlePage = (title = RADIO_NAME) => {
    document.title = title
  }

  this.refreshCurrentSong = (song, artist) => {
    var currentSong = document.getElementById("currentSong")
    var currentArtist = document.getElementById("currentArtist")

    if (currentSong && currentArtist) {
      // Remove skeleton loading
      const songSkeleton = currentSong.querySelector(".song-skeleton")
      const artistSkeleton = currentArtist.querySelector(".artist-skeleton")

      if (songSkeleton) songSkeleton.remove()
      if (artistSkeleton) artistSkeleton.remove()

      // Animate transition
      currentSong.className = "animated flipInY current-song"
      currentSong.innerHTML = song

      currentArtist.className = "animated flipInY current-artist"
      currentArtist.innerHTML = artist

      // Refresh modal title
      const lyricsSong = document.getElementById("lyricsSong")
      if (lyricsSong) {
        lyricsSong.innerHTML = song + " - " + artist
      }

      // Remove animation classes
            setTimeout(function () {
                currentSong.className = 'text-uppercase';
                currentArtist.className = 'text-capitalize';
            }, 2000);
        }
    }

  this.refreshHistoric = function (info, n) {
    var $historicDiv = document.querySelectorAll("#modalHistory .history-item")
    var $songName = document.querySelectorAll("#modalHistory .history-item .music-info .song")
    var $artistName = document.querySelectorAll("#modalHistory .history-item .music-info .artist")
    
    // Default cover art
    var urlCoverArt = 'img/cover.png';
    
     // Show loading for this specific item
    if ($historicDiv[n]) {
      const cover = $historicDiv[n].querySelector(".cover-historic")
      if (cover) cover.classList.add("loading")
    }

    // Use artwork directly from API if available
    if (info.artwork && $historicDiv[n]) {
      const cover = $historicDiv[n].querySelector(".cover-historic")
      if (cover) {
        cover.style.backgroundImage = "url(" + info.artwork + ")"
        cover.classList.remove("loading")
      }
    }
      
    // Defining Track Backgrounds - Above
        const Commercial_Break = 'https://thumbs2.imgbox.com/32/65/S8LZw7lI_t.png';
        const Bintang_Tenggara = 'https://cdn.bintangtenggarafm.com/img/rbt-cover.png';
        const JINGLESETELAHIKLAN = 'https://live.staticflickr.com/65535/53804698952_be7cefe6cd_z.jpg';
        const TS = 'https://thumbs2.imgbox.com/93/fe/zMn8oTEB_t.png';
        const Dengarkami = 'https://live.staticflickr.com/65535/53972769374_6850dd307a_b.jpg';
        const jingle = 'https://lastfm.freetls.fastly.net/i/u/ar0/a25b0e8fa1772422c6ebb3dd61316df2.png';
        const TANDAWAKTUSHOLATDHUHUR = 'https://live.staticflickr.com/65535/53815587960_2ded7e8990_z.jpg';
        const ASHAR = 'https://live.staticflickr.com/65535/53808429057_45e11e4986_z.jpg';
        const ADZANMAGHRIB = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiNqNb72rVTrjbv4OaLt1qAFkjySlaFJp34YyC_XJ6RNtoBXq_bYSp8cmubhyphenhyphenKBUxxytuneVwHHCSMmomBwSYN4LdmH6QXTV1e5YIkjTS0677w_lnuMqX3isz5WIhFO_6pAHJriBkQyevuv5AgH1_hpsoQYsliB_5KsyFzXi2STQ9GGKWIB9l5IiAg8_uuc/s1600/sXTgm2j.jpg';
        const OpeningRadio = 'https://cdn.bintangtenggarafm.com/img/oJTOhsL.jpg';
        const LAGUPENUTUPRADIO = 'https://is4-ssl.mzstatic.com/image/thumb/Music122/v4/ec/3f/64/ec3f643b-0ffd-eb61-9ccf-c8d2c027594f/3ad3589a-548e-4b13-970c-83a2937c7d5c.jpg/1200x1200bb.jpg';
        const Citizen = 'https://thumbs2.imgbox.com/b1/29/LxXCnvNr_t.jpg';
        const JELAJAHDESA = 'https://thumbs2.imgbox.com/7e/dc/vOGdajpd_t.jpg';
        const WISATABUDAYA = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj76_ShbSLBp_jr_Og-mX5b-010-7qIIEPM3ZZeN84zyldmyMX2NS-yLfMPZLa46N7tBFwX8EKlwbUe-9wqU6U_0FO2jV54YFdV0AEvhW0r8jAa5YAE-5TCHgS-uB2HUVHHj0MN9P8xhg5jHAFY-3tMvD_u1BvHdUScYgev4ZcBSCrepzs_75lcKn4dAOdN/s1600/G8Qnr1y.jpg';
        const SHOLAWAT = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiIpqY48J4bs8uxDW02DXU_87iAkbYboTn0pxJQ5p0wyoQKt4YYr7BnqczK2UhAcbHkeUyM2m-5IHhUD_jTvWts-7HPMgRU1s4ZJsstS-Kq74NNqHRgsdxkrUoEGhttVFPkCjjR_O766XT_r1WaC2kcUgwkAP9zWSXLzvocqlz-0Y8NU3ViCiC-T9Jfb5bz/s1600/Wf3SDEt.png';
        const RadioBintangTenggara = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjLSPAs-qRbddzeii-poy3k5Tsz26fYDw8AFeK04iNOxM1HCD6zMOmi5i9bhK6FBGDree32YzCUhiThpyFYr5Cd9A4yiHlOH9MnYPlH3psMW_zzRL0I6yCuMuAA1RvFfGSJEsY0UY3kQjG8xUDSarEVEWBdFS046suoDe25Ar0K8izBvMwrJIZl-aJ_U_1I/s1600/fF8yUE0.png';
        const AlffyRev  = 'https://i.scdn.co/image/ab67616d0000b273d0572746e75788f3a073899b';
        const Ajeng = 'https://i.scdn.co/image/ab67616d00001e02f82c2fa93ef91d7cc86be1d2';
        const Agnes_Monica = 'https://e-cdns-images.dzcdn.net/images/cover/ff26191927ceb7ae9e0e6f6c0af570b8/500x500-000000-80-0-0.jpg';
        const INNA_Ft_Yandel = 'https://i1.sndcdn.com/artworks-000060831547-7emuqa-t500x500.jpg';
        const SOLUSI_SEHAT = 'https://images2.imgbox.com/f8/ca/GwuLQxLZ_o.jpg';
        const Ari_Lasso = 'https://i.scdn.co/image/ab6761610000e5eb4e1ed336c3ff93a95fa44e14';
        const Gracie_Abrams = 'https://i.scdn.co/image/ab67616d0000b2733be2b12525a2f506780901a3';
        const Andmesh = 'https://i1.sndcdn.com/artworks-000644192974-fr8aja-t500x500.jpg';
        const Dewa_19_Ft_Virzha = 'https://i.scdn.co/image/ab67616d0000b2734383e26d01a2dd18452b7b37';
        const Dewa_19_Ft_Ello = 'https://i.scdn.co/image/ab67616d0000b2730b591f8644a5a5106169a30a';
        const Libianca_Ft_Cian_Ducrot = 'https://i.scdn.co/image/ab67616d0000b273d14949518f0851b6d9e61eeb';
        const TRIAD = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg9VTihL_Wl56YYsKExxz0JJk3GD8LS6roXDK7lz01orNPSLAOpUxVMdSOcKeI3LzUDHnhUFAgvfZmOyyeq-52UEqVkIaA9wzioIrgRvIP8cuCyywILD3-IVphe-VpLF4d6WMyH4jROrHICBlTTb1mMj20ezaD_Ue9GJ_nNOb3I4LsSCbIGNkmoxvvpv6Ov/s1600/2281e5d180adff9b.jpg';
        const Kotak = 'https://i.scdn.co/image/ab67616d0000b273db843f40730bee6fb77ecb13';
        const Kirana_Setio = 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/9c/43/2e/9c432e8e-15ec-e94f-35f3-8322ca48bab3/artwork.jpg/1200x1200bf-60.jpg';
        const Fadly_Ft_Natasha = 'https://i.scdn.co/image/ab67616d0000b2737022d4a537820482e1034044';
        const Alma_Esbeye = 'https://i.scdn.co/image/ab67616d0000b2739e7d30df02b301c12516ca65'; 
        const TAHUKAH_ANDA = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjxAJ1sodtny4phVNn5gBDdaT9a_vgRaMfqSwZYFSJ82OoQDJgBmf9GILFpvJp440vMTSZzOR19Fs5-PIFrkMCOMD_QVXJieodRVrWRblE4m-_uwgzjk1_kZFY5F-c-ElZvU8k7tcU-Kpp_lWnnpj_a_f8yIc4A21NmlP7pim9NJDLUS2ttWtIPXvAkm4if/s1600/CeeDxW74_t.jpg'; 
        const Alfina_Nindiyani  = 'https://i.scdn.co/image/ab67616d0000b273946b5d7310dc575af58ac613'; 
        const OPENING  = 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/grand-opening-design-template-3a37c804c55cf85d2ba959af479c656d_screen.jpg?ts=1575735007'; 
        const TS_MAGHRIB  = 'https://thumbs2.imgbox.com/ee/79/665Dlrr2_t.jpg'; 
        const CLOSING  = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjvJpO-eAcjIJ4w2y6YQMxNpaB7FEO9Z_GqZUDsp97gEg3BtCVGePx0vX56MiTTpsnVpjm8xoUif8ifFQFYNcfcJihj-rWw-1ik3rhtU5hDJ1uyy184-w7U6Gmisnp58bcOFIeS9lxFEg7RI_VenietESGTzEgnz5TBkYH9WBvpD-aylJtfqfyqGwm93L1a/s1600/ms5QoI6.jpg'; 
        const Alda_Risma  = 'https://i.scdn.co/image/ab67616d0000b2734fd8f936305cb28b2bb53ab7'; 
        const PERISTIWA_HARI_INI  = 'https://cdn.bintangtenggarafm.com/img/nTZlhHe.jpg'; 
        const BMKG  = 'https://thumbs2.imgbox.com/8a/f0/fFJLDlC0_t.jpg'; 
        const Mayang_Sari  = 'https://i.scdn.co/image/ab67616d0000b2733deb71f184e845a821d500d6'; 
        const Samsons = 'https://images.genius.com/6ef0ad66be031798666d9f8e2305aca9.640x640x1.jpg'; 
        const TANDA_WAKTU_SHOLAT_ISYA = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjzt-WdylfzOt4IZmb5vj6PbWsGNOGpV8YlrDTs7fejgDXPUhPI3BZ46RGlcEQGZJ9odFY0F6b9nNLHLHkXQRv8ihvehx7hIv6fz9gsclWh-gA22pMZuoVZNQvralLXFH6DLGAuAIWN400HhQkL3XmycIIopi0EZCT8TqTdhpFUYSMsFrz-jGhGOtluDwW3/s1600/uSKMZns.jpg'; 
        const Anisa_Rahman = 'https://i.scdn.co/image/ab67616d0000b273948e6ac1d0bc98d8269b9697'; 
        const Anggun = 'https://i.scdn.co/image/ab67616d0000b273068bcbbb986ad0ee76c02f76';
        const Power_Slaves = 'https://i.scdn.co/image/ab67616d0000b2733fd1e0089d0b10e143ea976f'; 
        const Second_Civil = 'https://i.scdn.co/image/ab67616d0000b2732f75cb4fe81408c68d9e847d'; 
        const Ismi_Azis = 'https://i.scdn.co/image/ab67616d0000b273835d5ee8832686e418f78e4f'; 
        const IKLAN = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg_jT-59DMrZxG0adpN-g_aRyaQerImHeqMBjPktsug-BeevbsqQNNZY-yhmwamvEOeFw43R0-BUtdmXxrDZTsCYziDeOvKxne968l9N0ECtpvRxPVReHMHa89oewr-Ac2YBcJfKrNX09gKmOW20NOISglFsV38c44TREtSEzK1p221sY8DNtu6R0HXX7OA/s1600/500x500iklan.jpg'; 
        const Station_Offline = 'https://cdn.bintangtenggarafm.com/img/offline.jpg'; 

        // should put track recognition and change in DOM text

        var artistRadio = info.song.artist.replace(/&apos;/g, '\'');
        if (artistRadio == 'Commercial Break') {var urlCoverArt = Commercial_Break;}
        else if (artistRadio == 'Bintang Tenggara') {var urlCoverArt = Bintang_Tenggara;}
        else if (artistRadio == 'JINGLE SETELAH IKLAN') {var urlCoverArt = JINGLESETELAHIKLAN;}
        else if (artistRadio == 'TS') {var urlCoverArt = TS;}
        else if (artistRadio == 'DENGAR KAMI') {var urlCoverArt = Dengarkami;}
        else if (artistRadio == 'JINGLE') {var urlCoverArt = JINGLE;}
        else if (artistRadio == 'TANDA WAKTU SHOLAT DHUHUR') {var urlCoverArt = TANDAWAKTUSHOLATDHUHUR;}
        else if (artistRadio == 'TANDA WAKTU SHOLAT ASHAR') {var urlCoverArt = ASHAR;}
        else if (artistRadio == 'ADZAN MAGHRIB') {var urlCoverArt = ADZANMAGHRIB;}
        else if (artistRadio == 'Opening Radio') {var urlCoverArt = OpeningRadio;}
        else if (artistRadio == 'LAGU PENUTUP RADIO') {var urlCoverArt = LAGUPENUTUPRADIO;}
        else if (artistRadio == 'Citizen Journalism') {var urlCoverArt = Citizen;}
        else if (artistRadio == 'JELAJAH DESA') {var urlCoverArt = JELAJAHDESA;}
        else if (artistRadio == 'WISATA BUDAYA') {var urlCoverArt = WISATABUDAYA;}
        else if (artistRadio == 'SHOLAWAT THIBBIL QULUB') {var urlCoverArt = SHOLAWAT;}
        else if (artistRadio == 'Radio Bintang Tenggara') {var urlCoverArt = RadioBintangTenggara;}
        else if (artistRadio == 'Alffy Rev') {var urlCoverArt = AlffyRev;}
        else if (artistRadio == 'Ajeng') {var urlCoverArt = Ajeng;}
        else if (artistRadio == 'Agnes Monica') {var urlCoverArt = Agnes_Monica;}
        else if (artistRadio == 'INNA Ft Yandel') {var urlCoverArt = INNA_Ft_Yandel;}
        else if (artistRadio == 'SOLUSI SEHAT') {var urlCoverArt = SOLUSI_SEHAT;}
        else if (artistRadio == 'ARI LASSO') {var urlCoverArt = Ari_Lasso;}
        else if (artistRadio == 'Gracie Abrams') {var urlCoverArt = Gracie_Abrams;}
        else if (artistRadio == 'Andmesh') {var urlCoverArt = Andmesh;}
        else if (artistRadio == 'Dewa 19 Ft Virzha') {var urlCoverArt = Dewa_19_Ft_Virzha;}
        else if (artistRadio == 'Dewa 19 Ft Ello') {var urlCoverArt = Dewa_19_Ft_Ello;}
        else if (artistRadio == 'Fadly Ft Natasha') {var urlCoverArt = Fadly_Ft_Natasha;}
        else if (artistRadio == 'T.R.I.A.D') {var urlCoverArt = TRIAD;}
        else if (artistRadio == 'Kotak') {var urlCoverArt = Kotak;}
        else if (artistRadio == 'Alma Esbeye') {var urlCoverArt = Alma_Esbeye;}
        else if (artistRadio == 'TAHUKAH ANDA') {var urlCoverArt = TAHUKAH_ANDA;}
        else if (artistRadio == 'Alfina Nindiyani') {var urlCoverArt = Alfina_Nindiyani;}
        else if (artistRadio == 'OPENING') {var urlCoverArt = OPENING;}
        else if (artistRadio == 'TS MAGHRIB') {var urlCoverArt = TS_MAGHRIB;}
        else if (artistRadio == 'CLOSING') {var urlCoverArt = CLOSING;}
        else if (artistRadio == 'Alda Risma') {var urlCoverArt = Alda_Risma;}
        else if (artistRadio == 'PERISTIWA HARI INI') {var urlCoverArt = PERISTIWA_HARI_INI;} 
        else if (artistRadio == 'BMKG') {var urlCoverArt = BMKG;}
        else if (artistRadio == 'Mayang Sari') {var urlCoverArt = Mayang_Sari;}
        else if (artistRadio == 'Samsons') {var urlCoverArt = Samsons;}
        else if (artistRadio == 'TANDA WAKTU SHOLAT ISYA') {var urlCoverArt = TANDA_WAKTU_SHOLAT_ISYA;}
        else if (artistRadio == 'Anisa Rahman') {var urlCoverArt = Anisa_Rahman;}
        else if (artistRadio == 'Anggun') {var urlCoverArt = Anggun;}
        else if (artistRadio == 'Power Slaves') {var urlCoverArt = Power_Slaves;} 
        else if (artistRadio == 'Second Civil') {var urlCoverArt = Second_Civil;}
        else if (artistRadio == 'Ismi Azis') {var urlCoverArt = Ismi_Azis;}
        else if (artistRadio == 'IKLAN') {var urlCoverArt = IKLAN;}
        else if (artistRadio == 'Station Offline') {var urlCoverArt = Station_Offline;}
    else {var urlCoverArt = 'https://cdn4.mbahnunungonline.net/img/wDI5YzU.png';}
    
     // Get cover art for song history
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        var data = JSON.parse(this.responseText);
        var artworkUrl100 = (data.resultCount) ? data.results[0].artworkUrl100 : urlCoverArt;

        document.querySelectorAll('#historicSong article .cover-historic')[n].style.backgroundImage = 'url(' + artworkUrl100 + ')';
      }
      // Formating characters to UTF-8
      var music = info.song.title.replace(/&amp;/g, '&');;
      var songHist = music.replace(/&amp;/g, '&');

      var artist = info.song.artist.replace(/&apos;/g, '\'');
      var artistHist = artist.replace(/&amp;/g, '&');
      
      // Remove skeleton loading
    if ($songName[n]) {
      const songSkeleton = $songName[n].querySelector(".history-song-skeleton")
      if (songSkeleton) songSkeleton.remove()
      $songName[n].innerHTML = songHist
    }

    if ($artistName[n]) {
      const artistSkeleton = $artistName[n].querySelector(".history-artist-skeleton")
      if (artistSkeleton) artistSkeleton.remove()
      $artistName[n].innerHTML = artistHist
    }

      $songName[n].innerHTML = songHist;
      $artistName[n].innerHTML = artistHist;

     // Add class for animation
      $historicDiv[n].classList.add('animated');
      $historicDiv[n].classList.add('slideInRight');
    }
    xhttp.open('GET', 'https://itunes.apple.com/search?term=' + info.song.artist + ' ' + info.song.title + '&media=music&limit=1', true)
    xhttp.send();

    setTimeout(function () {
      for (var j = 0; j < 5; j++) {
        $historicDiv[j].classList.remove('animated');
        $historicDiv[j].classList.remove('slideInRight');
      }
    }, 2000);
  }

  this.refreshCover = function (song = '', artist) {
        // Default cover art
        const Commercial_Break = 'https://thumbs2.imgbox.com/32/65/S8LZw7lI_t.png';
        const Bintang_Tenggara = 'https://cdn.bintangtenggarafm.com/img/rbt-cover.png';
        const JINGLESETELAHIKLAN = 'https://live.staticflickr.com/65535/53804698952_be7cefe6cd_z.jpg';
        const TS = 'https://thumbs2.imgbox.com/93/fe/zMn8oTEB_t.png';
        const Dengarkami = 'https://live.staticflickr.com/65535/53972769374_6850dd307a_b.jpg';
        const JINGLE = 'https://lastfm.freetls.fastly.net/i/u/ar0/a25b0e8fa1772422c6ebb3dd61316df2.png';
        const TANDAWAKTUSHOLATDHUHUR = 'https://live.staticflickr.com/65535/53815587960_2ded7e8990_z.jpg';
        const ASHAR = 'https://live.staticflickr.com/65535/53808429057_45e11e4986_z.jpg';
        const ADZANMAGHRIB = 'https://i.scdn.co/image/ab67616d0000b273f9fc89132411c52d8c6bc537';
        const OpeningRadio = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEirhlnLe1cXHdeIMNZ0q1yefm-AYwhuUwE5vbU8vVw3zf80cYPBS-9SBtwO2zUmRlniZLCT2zsRRVyFq5UANxWC94PAUJ9tIAYfKrXDHYHls-hWpf5NzM0PEEC1honYHAbqXiEiskhjlc2Yd0VdjAf-yIAZnI_vCwMYPGZ8isbCbRPhhph4zoB2GE6bZAjO/s1600/opeNing.jpg';
        const LAGUPENUTUPRADIO = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiNEamewgAbyAZFYi_B0GkmXat8Z1aglWgubnf10D8etRJu2ZtJEt_fuk8EVhCVEolKvUl7Lqo8TQZmCilmGcCssvzzKn8LDg9e-mrvdbrRrzq3KSFx3e_4hN5jizPhyFBuFCmqvogZS99aGrfi6GrQMBd0l59bWk1THfsXR1-44zhIPuSMQV64kylXQ-YZ/s1600/penutupan.jpg';
        const Citizen = 'https://thumbs2.imgbox.com/b1/29/LxXCnvNr_t.jpg';
        const JELAJAHDESA = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEju93kG2MbF4wulmf2HqIsNtbLeAh57ldbuKD6gRRM-DzUl-so8as-uaaUJzO_YaHWuVo7cLro1Ihp5LuyTsppRk_7Al2T7Om5CSUqiLlhkSYdL0QDajPjeIfW7jrPKzGe6D4_TKsj6BDoRYDlSYOAmIlcduoM3lQQFU4oThuM671dzfstZqQRH0G5K6QD2/s1600/Jelajahdesa.jpg';
        const WISATABUDAYA = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj76_ShbSLBp_jr_Og-mX5b-010-7qIIEPM3ZZeN84zyldmyMX2NS-yLfMPZLa46N7tBFwX8EKlwbUe-9wqU6U_0FO2jV54YFdV0AEvhW0r8jAa5YAE-5TCHgS-uB2HUVHHj0MN9P8xhg5jHAFY-3tMvD_u1BvHdUScYgev4ZcBSCrepzs_75lcKn4dAOdN/s1600/G8Qnr1y.jpg';
        const SHOLAWAT = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiIpqY48J4bs8uxDW02DXU_87iAkbYboTn0pxJQ5p0wyoQKt4YYr7BnqczK2UhAcbHkeUyM2m-5IHhUD_jTvWts-7HPMgRU1s4ZJsstS-Kq74NNqHRgsdxkrUoEGhttVFPkCjjR_O766XT_r1WaC2kcUgwkAP9zWSXLzvocqlz-0Y8NU3ViCiC-T9Jfb5bz/s1600/Wf3SDEt.png';
        const RadioBintangTenggara = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjLSPAs-qRbddzeii-poy3k5Tsz26fYDw8AFeK04iNOxM1HCD6zMOmi5i9bhK6FBGDree32YzCUhiThpyFYr5Cd9A4yiHlOH9MnYPlH3psMW_zzRL0I6yCuMuAA1RvFfGSJEsY0UY3kQjG8xUDSarEVEWBdFS046suoDe25Ar0K8izBvMwrJIZl-aJ_U_1I/s1600/fF8yUE0.png';
        const AlffyRev  = 'https://i.scdn.co/image/ab67616d0000b273d0572746e75788f3a073899b';
        const Ajeng = 'https://i.scdn.co/image/ab67616d0000b273f82c2fa93ef91d7cc86be1d2';
        const Agnes_Monica = 'https://i.scdn.co/image/ab6761610000e5eb09160e5ffdc256e65713a8a9';
        const INNA_Ft_Yandel = 'https://i1.sndcdn.com/artworks-000060831547-7emuqa-t500x500.jpg';
        const SOLUSI_SEHAT = 'https://images2.imgbox.com/f8/ca/GwuLQxLZ_o.jpg';
        const Ari_Lasso = 'https://i.scdn.co/image/ab6761610000e5eb4e1ed336c3ff93a95fa44e14';
        const Gracie_Abrams = 'https://i.scdn.co/image/ab67616d0000b2733be2b12525a2f506780901a3';
        const Andmesh = 'https://i1.sndcdn.com/artworks-000644192974-fr8aja-t500x500.jpg';
        const Dewa_19_Ft_Virzha = 'https://i.scdn.co/image/ab67616d0000b2734383e26d01a2dd18452b7b37';
        const Dewa_19_Ft_Ello = 'https://i.scdn.co/image/ab67616d0000b2730b591f8644a5a5106169a30a';
        const Libianca_Ft_Cian_Ducrot = 'https://i.scdn.co/image/ab67616d0000b273d14949518f0851b6d9e61eeb';
        const TRIAD = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg9VTihL_Wl56YYsKExxz0JJk3GD8LS6roXDK7lz01orNPSLAOpUxVMdSOcKeI3LzUDHnhUFAgvfZmOyyeq-52UEqVkIaA9wzioIrgRvIP8cuCyywILD3-IVphe-VpLF4d6WMyH4jROrHICBlTTb1mMj20ezaD_Ue9GJ_nNOb3I4LsSCbIGNkmoxvvpv6Ov/s1600/2281e5d180adff9b.jpg';
        const Kotak = 'https://i.scdn.co/image/ab67616d0000b273db843f40730bee6fb77ecb13';
        const Kirana_Setio = 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/9c/43/2e/9c432e8e-15ec-e94f-35f3-8322ca48bab3/artwork.jpg/1200x1200bf-60.jpg';
        const Fadly_Ft_Natasha = 'https://i.scdn.co/image/ab67616d0000b2737022d4a537820482e1034044';
        const Alma_Esbeye = 'https://i.scdn.co/image/ab67616d0000b2739e7d30df02b301c12516ca65'; 
        const TAHUKAH_ANDA = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhlgtNm-H7v4NN3ibwE-_yLPhMVdetUfOUYL9x8YYs4QQRpzvo0emUq1OuaR-LMMAoNKeqJxHK4TFavoPS8GfxZyJdOpdnf0RPn5UlQ4kURFbcdMRr7sB37xM-Qb0QxzmDq65Eh9FkQHEM6US2Y8lOxZgIV_pyBdO3MTcIRDkal6xquL1Hi6-XwodtxAAOb/s1600/taukahAnda.jpg'; 
        const Alfina_Nindiyani  = 'https://i.scdn.co/image/ab67616d0000b273946b5d7310dc575af58ac613'; 
        const OPENING  = 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/grand-opening-design-template-3a37c804c55cf85d2ba959af479c656d_screen.jpg?ts=1575735007'; 
        const TS_MAGHRIB  = 'https://thumbs2.imgbox.com/ee/79/665Dlrr2_t.jpg'; 
        const CLOSING  = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjvJpO-eAcjIJ4w2y6YQMxNpaB7FEO9Z_GqZUDsp97gEg3BtCVGePx0vX56MiTTpsnVpjm8xoUif8ifFQFYNcfcJihj-rWw-1ik3rhtU5hDJ1uyy184-w7U6Gmisnp58bcOFIeS9lxFEg7RI_VenietESGTzEgnz5TBkYH9WBvpD-aylJtfqfyqGwm93L1a/s1600/ms5QoI6.jpg'; 
        const Alda_Risma  = 'https://i.scdn.co/image/ab67616d0000b2734fd8f936305cb28b2bb53ab7'; 
        const PERISTIWA_HARI_INI  = 'https://cdn.bintangtenggarafm.com/img/nTZlhHe.jpg'; 
        const BMKG  = 'https://thumbs2.imgbox.com/8a/f0/fFJLDlC0_t.jpg'; 
        const Mayang_Sari  = 'https://i.scdn.co/image/ab67616d0000b2733deb71f184e845a821d500d6'; 
        const Samsons = 'https://images.genius.com/6ef0ad66be031798666d9f8e2305aca9.640x640x1.jpg'; 
        const TANDA_WAKTU_SHOLAT_ISYA = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjzt-WdylfzOt4IZmb5vj6PbWsGNOGpV8YlrDTs7fejgDXPUhPI3BZ46RGlcEQGZJ9odFY0F6b9nNLHLHkXQRv8ihvehx7hIv6fz9gsclWh-gA22pMZuoVZNQvralLXFH6DLGAuAIWN400HhQkL3XmycIIopi0EZCT8TqTdhpFUYSMsFrz-jGhGOtluDwW3/s1600/uSKMZns.jpg'; 
        const Anisa_Rahman = 'https://i.scdn.co/image/ab67616d0000b273948e6ac1d0bc98d8269b9697'; 
        const Anggun = 'https://i.scdn.co/image/ab67616d0000b273068bcbbb986ad0ee76c02f76'; 
        const Power_Slaves = 'https://i.scdn.co/image/ab67616d0000b2733fd1e0089d0b10e143ea976f'; 
        const Second_Civil = 'https://i.scdn.co/image/ab67616d0000b2732f75cb4fe81408c68d9e847d'; 
        const Ismi_Azis = 'https://i.scdn.co/image/ab67616d0000b273835d5ee8832686e418f78e4f'; 
        const IKLAN = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh3kvdmC7dAKO4NEBIHYqzIVCpCUjPipqTOwGJ-PZceBRYHQIhRI61imk6t2QXqJBBRsI4MYazWX1ecCGLery0jUwK9fkPpv7YQHKvE1W4OzRqHpal3VMsAvwl1pwYx28_-wP1KS9nq2EaR2E2qv3hw0k_mbfo9FagXNwhYNaOmZGRreSQwn2XsZ4FCyiw_/s1600/1200x1200iklan.jpg';
        const Station_Offline = 'https://cdn.bintangtenggarafm.com/img/offline.jpg'; 

        if (artist == 'Commercial Break') {var urlCoverArt = Commercial_Break;}
            else if (artist == 'Bintang Tenggara') {var urlCoverArt = Bintang_Tenggara;}
            else if (artist == 'JINGLE SETELAH IKLAN') {var urlCoverArt = JINGLESETELAHIKLAN;}
            else if (artist == 'TS') {var urlCoverArt = TS;}
            else if (artist == 'DENGAR KAMI') {var urlCoverArt = Dengarkami;}
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
            else if (artist == 'Radio Bintang Tenggara') {var urlCoverArt = RadioBintangTenggara;}
            else if (artist == 'Alffy Rev') {var urlCoverArt = AlffyRev;}
            else if (artist == 'Ajeng') {var urlCoverArt = Ajeng;}
            else if (artist == 'Agnes Monica') {var urlCoverArt = Agnes_Monica;}
            else if (artist == 'INNA Ft Yandel') {var urlCoverArt = INNA_Ft_Yandel;}
            else if (artist == 'SOLUSI SEHAT') {var urlCoverArt = SOLUSI_SEHAT;}
            else if (artist == 'ARI LASSO') {var urlCoverArt = Ari_Lasso;}
            else if (artist == 'Gracie Abrams') {var urlCoverArt = Gracie_Abrams;}
            else if (artist == 'Andmesh') {var urlCoverArt = Andmesh;}
            else if (artist == 'Dewa 19 Ft Virzha') {var urlCoverArt = Dewa_19_Ft_Virzha;}
            else if (artist == 'Dewa 19 Ft Ello') {var urlCoverArt = Dewa_19_Ft_Ello;}
            else if (artist == 'Fadly Ft Natasha') {var urlCoverArt = Fadly_Ft_Natasha;}
            else if (artist == 'T.R.I.A.D') {var urlCoverArt = TRIAD;}
            else if (artist == 'Kotak') {var urlCoverArt = Kotak;}
            else if (artist == 'Kirana Setio') {var urlCoverArt = Kirana_Setio;}
            else if (artist == 'Alma Esbeye') {var urlCoverArt = Alma_Esbeye;} 
            else if (artist == 'TAHUKAH ANDA') {var urlCoverArt = TAHUKAH_ANDA;} 
            else if (artist == 'Alfina Nindiyani') {var urlCoverArt = Alfina_Nindiyani;} 
            else if (artist == 'OPENING') {var urlCoverArt = OPENING;} 
            else if (artist == 'TS MAGHRIB') {var urlCoverArt = TS_MAGHRIB;} 
            else if (artist == 'CLOSING') {var urlCoverArt = CLOSING;} 
            else if (artist == 'Alda Risma') {var urlCoverArt = Alda_Risma;} 
            else if (artist == 'PERISTIWA HARI INI') {var urlCoverArt = PERISTIWA_HARI_INI;} 
            else if (artist == 'BMKG') {var urlCoverArt = BMKG;}  
            else if (artist == 'Mayang Sari') {var urlCoverArt = Mayang_Sari;} 
            else if (artist == 'Samsons') {var urlCoverArt = Samsons;} 
            else if (artist == 'TANDA WAKTU SHOLAT ISYA') {var urlCoverArt = TANDA_WAKTU_SHOLAT_ISYA;} 
            else if (artist == 'Anisa Rahman') {var urlCoverArt = Anisa_Rahman;} 
            else if (artist == 'Anggun') {var urlCoverArt = Anggun;} 
            else if (artist == 'Power Slaves') {var urlCoverArt = Power_Slaves;} 
            else if (artist == 'Second Civil') {var urlCoverArt = Second_Civil;}
            else if (artist == 'Ismi Azis') {var urlCoverArt = Ismi_Azis;}
            else if (artist == 'IKLAN') {var urlCoverArt = IKLAN;}
            else if (artist == 'Station Offline') {var urlCoverArt = Station_Offline;}

        // Default cover art
        else {var urlCoverArt = 'https://cdn4.mbahnunungonline.net/img/wDI5YzU.png';}

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

  this.changeVolumeIndicator = (volume) => {
    const volIndicator = document.getElementById("volIndicator")
    if (volIndicator) {
      volIndicator.innerHTML = volume
    }

    if (typeof Storage !== "undefined") {
      localStorage.setItem("volume", volume)
    }
  }

  this.setVolume = () => {
    if (typeof Storage !== "undefined") {
      var volumeLocalStorage = !localStorage.getItem("volume") ? 80 : localStorage.getItem("volume")
      const volumeSlider = document.getElementById("volume")
      const volIndicator = document.getElementById("volIndicator")

      if (volumeSlider) {
        volumeSlider.value = volumeLocalStorage
      }
      if (volIndicator) {
        volIndicator.innerHTML = volumeLocalStorage
      }
    }
  }

  this.refreshLyric = (currentSong, currentArtist) => {
    // Show lyrics loading
    showLyricsLoading()

    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      // Hide lyrics loading
      hideLyricsLoading()

      if (this.readyState === 4 && this.status === 200) {
        var data = JSON.parse(this.responseText)

        var openLyric = document.getElementsByClassName("lyrics")[0]

        if (data.type === "exact" || data.type === "aprox") {
          var lyric = data.mus[0].text

          // Remove skeleton loading from modal
          const lyricsLoading = document.querySelector(".lyrics-loading")
          if (lyricsLoading) lyricsLoading.style.display = "none"

          const lyricElement = document.getElementById("lyric")
          if (lyricElement) {
            lyricElement.innerHTML = lyric.replace(/\n/g, "<br />")
          }

          if (openLyric) {
            openLyric.style.opacity = "1"
            openLyric.setAttribute("data-toggle", "modal")
          }
        } else {
          if (openLyric) {
            openLyric.style.opacity = "0.3"
            openLyric.removeAttribute("data-toggle")
          }

          var modalLyric = document.getElementById("modalLyrics")
          if (modalLyric) {
            modalLyric.style.display = "none"
            modalLyric.setAttribute("aria-hidden", "true")
          }

          const backdrop = document.getElementsByClassName("modal-backdrop")[0]
          if (backdrop) {
            backdrop.remove()
          }
        }
      } else {
        var lyricsElement = document.getElementsByClassName("lyrics")[0]
        if (lyricsElement) {
          lyricsElement.style.opacity = "0.3"
          lyricsElement.removeAttribute("data-toggle")
        }
      }
    }
    xhttp.open(
      "GET",
      "https://api.vagalume.com.br/search.php?apikey=" +
        API_KEY +
        "&art=" +
        currentArtist +
        "&mus=" +
        currentSong.toLowerCase(),
      true,
    )
    xhttp.send()
  }
}

var audio = new Audio(URL_STREAMING)

// Player control
function Player() {
  this.play = () => {
    // Show button loading
    showButtonLoading()

    audio.play()

    const volumeSlider = document.getElementById("volume")
    var defaultVolume = volumeSlider ? volumeSlider.value : 80

    if (typeof Storage !== "undefined") {
      if (localStorage.getItem("volume") !== null) {
        audio.volume = intToDecimal(localStorage.getItem("volume"))
      } else {
        audio.volume = intToDecimal(defaultVolume)
      }
    } else {
      audio.volume = intToDecimal(defaultVolume)
    }

    const volIndicator = document.getElementById("volIndicator")
    if (volIndicator) {
      volIndicator.innerHTML = defaultVolume
    }

    // Hide button loading after a short delay
    setTimeout(() => {
      hideButtonLoading()
    }, 1000)
  }

  this.pause = () => {
    audio.pause()
  }
}

// On play, change the button to pause
audio.onplay = () => {
  var botao = document.getElementById("playerButton")
  var bplay = document.getElementById("buttonPlay")
  if (botao && botao.className === "fa fa-play") {
    botao.className = "fa fa-pause"
    if (bplay) bplay.innerHTML = "PAUSE"
  }
  hideButtonLoading()
}

// On pause, change the button to play
audio.onpause = () => {
  var botao = document.getElementById("playerButton")
  var bplay = document.getElementById("buttonPlay")
  if (botao && botao.className === "fa fa-pause") {
    botao.className = "fa fa-play"
    if (bplay) bplay.innerHTML = "PLAY"
  }
  hideButtonLoading()
}

// Unmute when volume changed
audio.onvolumechange = () => {
  if (audio.volume > 0) {
    audio.muted = false
  }
}



// Volume control
const volumeSlider = document.getElementById("volume")
if (volumeSlider) {
  volumeSlider.oninput = function () {
    audio.volume = intToDecimal(this.value)

    var page = new Page()
    page.changeVolumeIndicator(this.value)
  }
}

function togglePlay() {
  if (!audio.paused) {
    audio.pause()
  } else {
    showButtonLoading()
    audio.load()
    audio.play()
  }
}

function volumeUp() {
  var vol = audio.volume
  if (audio) {
    if (audio.volume >= 0 && audio.volume < 1) {
      audio.volume = (vol + 0.01).toFixed(2)
    }
  }
}

function volumeDown() {
  var vol = audio.volume
  if (audio) {
    if (audio.volume >= 0.01 && audio.volume <= 1) {
      audio.volume = (vol - 0.01).toFixed(2)
    }
  }
}

function mute() {
  const volIndicator = document.getElementById("volIndicator")
  const volumeSlider = document.getElementById("volume")

  if (!audio.muted) {
    if (volIndicator) volIndicator.innerHTML = 0
    if (volumeSlider) volumeSlider.value = 0
    audio.volume = 0
    audio.muted = true
  } else {
    var localVolume = localStorage.getItem("volume") || 80
    if (volIndicator) volIndicator.innerHTML = localVolume
    if (volumeSlider) volumeSlider.value = localVolume
    audio.volume = intToDecimal(localVolume)
    audio.muted = false
  }
}

function getStreamingData() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      if (this.response.length === 0) {
        console.log('%cdebug', 'font-size: 22px');
      }

      var data = JSON.parse(this.responseText);
      // console.log('Received data:', data); // Add this line for debugging

      var page = new Page();

      // Formating characters to UTF-8
      let title = data.now_playing.song.title.replace(/&apos;/g, '\'');
      let artist = data.now_playing.song.artist.replace(/&apos;/g, '\'');

      // Change the title
      document.title = artist + ' - ' + title + ' | ' + RADIO_NAME;

      if (document.getElementById('currentSong').innerHTML !== title) {
        page.refreshCover(title, artist);
        page.refreshCurrentSong(title, artist);
        page.refreshLyric(title, artist);

        for (var i = 0; i < 5; i++) {
          page.refreshHistoric(data.song_history[i], i);
        }
      }
    }
  };

  var d = new Date();

  // Requisition with timestamp to prevent cache on mobile devices
  xhttp.open('GET', API_URL);
  xhttp.send();
}

// Player control by keys
document.addEventListener("keydown", (event) => {
  var key = event.keyCode || event.which

  var slideVolume = document.getElementById("volume")
  var page = new Page()

  switch (key) {
    // Arrow up
    case 38:
      volumeUp()
      if (slideVolume) slideVolume.value = decimalToInt(audio.volume)
      page.changeVolumeIndicator(decimalToInt(audio.volume))
      break
    // Arrow down
    case 40:
      volumeDown()
      if (slideVolume) slideVolume.value = decimalToInt(audio.volume)
      page.changeVolumeIndicator(decimalToInt(audio.volume))
      break
    // Spacebar
    case 32:
      togglePlay()
      break
    // P
    case 80:
      togglePlay()
      break
    // M
    case 77:
      mute()
      break
    // 0
    case 48:
      audio.volume = 0
      if (slideVolume) slideVolume.value = 0
      page.changeVolumeIndicator(0)
      break
    // 0 numeric keyboard
    case 96:
      audio.volume = 0
      if (slideVolume) slideVolume.value = 0
      page.changeVolumeIndicator(0)
      break
    // 1
    case 49:
      audio.volume = 0.1
      if (slideVolume) slideVolume.value = 10
      page.changeVolumeIndicator(10)
      break
    // 1 numeric key
    case 97:
      audio.volume = 0.1
      if (slideVolume) slideVolume.value = 10
      page.changeVolumeIndicator(10)
      break
    // 2
    case 50:
      audio.volume = 0.2
      if (slideVolume) slideVolume.value = 20
      page.changeVolumeIndicator(20)
      break
    // 2 numeric key
    case 98:
      audio.volume = 0.2
      if (slideVolume) slideVolume.value = 20
      page.changeVolumeIndicator(20)
      break
    // 3
    case 51:
      audio.volume = 0.3
      if (slideVolume) slideVolume.value = 30
      page.changeVolumeIndicator(30)
      break
    // 3 numeric key
    case 99:
      audio.volume = 0.3
      if (slideVolume) slideVolume.value = 30
      page.changeVolumeIndicator(30)
      break
    // 4
    case 52:
      audio.volume = 0.4
      if (slideVolume) slideVolume.value = 40
      page.changeVolumeIndicator(40)
      break
    // 4 numeric key
    case 100:
      audio.volume = 0.4
      if (slideVolume) slideVolume.value = 40
      page.changeVolumeIndicator(40)
      break
    // 5
    case 53:
      audio.volume = 0.5
      if (slideVolume) slideVolume.value = 50
      page.changeVolumeIndicator(50)
      break
    // 5 numeric key
    case 101:
      audio.volume = 0.5
      if (slideVolume) slideVolume.value = 50
      page.changeVolumeIndicator(50)
      break
    // 6
    case 54:
      audio.volume = 0.6
      if (slideVolume) slideVolume.value = 60
      page.changeVolumeIndicator(60)
      break
    // 6 numeric key
    case 102:
      audio.volume = 0.6
      if (slideVolume) slideVolume.value = 60
      page.changeVolumeIndicator(60)
      break
    // 7
    case 55:
      audio.volume = 0.7
      if (slideVolume) slideVolume.value = 70
      page.changeVolumeIndicator(70)
      break
    // 7 numeric key
    case 103:
      audio.volume = 0.7
      if (slideVolume) slideVolume.value = 70
      page.changeVolumeIndicator(70)
      break
    // 8
    case 56:
      audio.volume = 0.8
      if (slideVolume) slideVolume.value = 80
      page.changeVolumeIndicator(80)
      break
    // 8 numeric key
    case 104:
      audio.volume = 0.8
      if (slideVolume) slideVolume.value = 80
      page.changeVolumeIndicator(80)
      break
    // 9
    case 57:
      audio.volume = 0.9
      if (slideVolume) slideVolume.value = 90
      page.changeVolumeIndicator(90)
      break
    // 9 numeric key
    case 105:
      audio.volume = 0.9
      if (slideVolume) slideVolume.value = 90
      page.changeVolumeIndicator(90)
      break
  }
})

function intToDecimal(vol) {
  return vol / 100
}

function decimalToInt(vol) {
  return vol * 100
}

// Initialize history items dynamically
function initializeHistoryItems() {
  const historyContainer = document.getElementById("historicSong")
  const HISTORY_ITEMS_COUNT = 5
  
  if (historyContainer) {
    // Clear any existing items
    historyContainer.innerHTML = ""
    
    // Generate history items
    for (let i = 0; i < HISTORY_ITEMS_COUNT; i++) {
      const historyItem = document.createElement("article")
      historyItem.className = "history-item"
      
      historyItem.innerHTML = `
        <div class="cover-historic">
          <div class="cover-loading-spinner"></div>
        </div>
        <div class="music-info">
          <div class="song">
            <span class="history-song-skeleton">Loading song...</span>
          </div>
          <div class="artist">
            <span class="history-artist-skeleton">Loading artist...</span>
          </div>
        </div>
      `
      
      historyContainer.appendChild(historyItem)
    }
  }
}
