// =============================================== //
// - Remove any active classes (yellow boxes)
// - please add your options (host, port, version, etc..)
// - Destroy any pervious Kast
// - On example box click, call Kast
// =============================================== //

    $.kast({
        host: 's2.free-shoutcast.com',
        port: 18206,
        protocol: 'https',
        version: 1,
        directStreamURL: 'https://s2.free-shoutcast.com/stream/18206/;stream.mp3?98ab8f',
        defaultArtwork: ['https://warningfm.github.io/v3/images/1d205655ef29e14a8255c89fe2383a41.jpg'],
        statusBar: false,
        startTemplate: 'maximized',
        language: {
            offlineText: 'Temporarily Offline',
            playedText: '<font face="Georgia" color="blue">Wes Mari Diputer :</font>',
            unknownTrackText: 'Banyuwangi - c^o^d^e^l^i^s^t^.^c^c', 
            unknownArtistText: 'Radio Fajar FM' 
        },
        position: 'right',
        colors: 'dynamic',
        theme: 'dark',
        autoPlay: true,
        played: true
      })
