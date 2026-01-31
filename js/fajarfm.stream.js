// =============================================== //
// - Remove any active classes (yellow boxes)
// - please add your options (host, port, version, etc..)
// - Destroy any pervious Kast
// - On example box click, call Kast
// =============================================== //

    $.kast({
        host: 'uk25freenew.listen2myradio.com',
        port: 27215,
        protocol: 'http',
        version: 1,
        directStreamURL: 'https://uk25freenew.listen2myradio.com/live.mp3?typeportmount=s1_27215_stream_535175960|Referer=https://fajarfm.radio12345.com/',
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
