const electron = require('electron');
const axios = require('axios');
const fs = require('fs');
const youtubemp3 = require('youtube-mp3-downloader');
const parser = require('xml2json-light');
require('electron-reload')(__dirname);
//const youtubeNode = require("youtube-node");
const {app, BrowserWindow, ipcMain} = electron;
const key = 'AIzaSyDJo3k2iYacZqKDL456yRtdC5eqixQ5r20';
const baseUrl = 'https://www.googleapis.com/youtube/v3';

let mainWindow;
app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  console.log('hello');

  mainWindow.loadURL(`file://${__dirname}/views/index.html`);
});

ipcMain.on('page:load', (event, data) => {
  // fetch the data : without any search default data
  axios
    .get(baseUrl + '/videos', {
      params: {
        key: key,
        chart: 'mostPopular',
        videoCategoryId: 10,
        part: 'snippet',
        maxResults: 20,
      },
    })
    .then(function(resp) {
      console.log(resp.data);
      mainWindow.webContents.send('data:json', resp.data);
    })
    .catch(function(err) {
      mainWindow.webContents.send('data:json', err);
    });
});

// taking id of the video to download
ipcMain.on('data:id', (event, videoId) => {
  let YD = new youtubemp3({
    outputPath: '/home/anilpdv/Music',
    youtubeVideoQuality: 'highest',
    progressTimeout: 2000,
  });
  // download video

  YD.on('finished', function(err, data) {
    mainWindow.webContents.send('download:finish', {
      data: 'finished',
      videoId: videoId,
    });
    console.log('finished downloading');
  });

  YD.on('error', function(error) {
    console.log(error);
  });

  YD.on('progress', function(progress) {
    let data = Math.round(progress.progress.percentage);
    mainWindow.webContents.send('loading:data', {
      data: data,
      videoId: videoId,
    });
    console.log(data, videoId);
  });

  //Download video and save as MP3 file
  YD.download(videoId);
  console.log(videoId);
});

ipcMain.on('search', (event, data) => {
  axios
    .get(baseUrl + '/search', {
      params: {
        key: key,
        q: data,
        maxResults: 10,
        part: 'snippet',
        videoCategoryId: 10,
        chart: 'mostpopular',
        type: 'video',
      },
    })
    .then(resp => {
      mainWindow.webContents.send('search:data', resp.data);
      //  console.log(resp.data);
    })
    .catch(err => {
      console.log(err);
    });
  //console.log(data);
});

const test = length => {
  let possible;
  let randomChar = '';

  possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  for (let i = 0; i < length; i++) {
    randomChar =
      randomChar + possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return randomChar;
};

const convertId = videoId => {
  let charid;
  let length;
  let generatedValue = '';

  for (let i = 0; i < videoId.length; i++) {
    charid = videoId.charCodeAt(i) + 13;

    length = Math.floor(Math.random() * 3 + 1);

    generatedValue = generatedValue + (charid + test(length));
  }
  return generatedValue;
};

// change page here
ipcMain.on('change:page', function(event, data) {
  let lyricsId = convertId(data);

  // : load second page
  mainWindow.loadURL(`file://${__dirname}/views/statlyrics.html`);

  // : get data from youtube api
  axios
    .get(baseUrl + '/search', {
      params: {
        key: key,
        part: 'snippet',
        relatedToVideoId: data,
        type: 'video',
        maxResults: 10,
        chart: 'mostpopular',
        videoCategoryId: 10,
      },
    })
    .then(resp => {
      console.log(resp.data);
      axios
        .get('https://extension.musixmatch.com/?res=' + lyricsId)
        .then(response => {
          let dataLyrics = parser.xml2json(response.data);
          console.log(dataLyrics.transcript.text);
          mainWindow.webContents.send('page2:data', {
            videoDetails: resp.data.items,
            lyrics: dataLyrics.transcript,
          });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err.response);
    });
});

ipcMain.on('go:to', function(event, data) {
  mainWindow.loadURL(`file://${__dirname}/views/index.html`);
});

/*-------------------------------------*/
/* ------------------ player -----------*/
/*-------------------------------------*/
const dir = '/home/anilpdv/Music';
ipcMain.on('player:load', function(event, data) {
  mainWindow.loadURL(`file://${__dirname}/views/player.html`);
});

ipcMain.on('player:exists', (event, data) => {
  fs.readdir(dir, (err, files) => {
    mainWindow.webContents.send('songs:list', files);
    console.log('yeah oh');
  });
});

/*---------------------------------*/
/*----------- lyrics --------------*/
/*--------------------------------*/
ipcMain.on('lyrics:load', function(event, data) {
  mainWindow.loadURL(`file://${__dirname}/views/lyrics.html`);
});
