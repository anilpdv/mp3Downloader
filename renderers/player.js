let electron = require('electron');
let {ipcRenderer} = electron;
var songsExist = [];
let songPlaying = '';
let sound;
let soundId;
let count = 0;

ipcRenderer.send('player:exists', 'yes its exits');
ipcRenderer.on('songs:list', (event, songsList) => {
  songsList = songsList;
  songsList.forEach(song => {
    $('#songsList').append(`<div class="col">
                   <h4 id="songSelected"> ${song}</h4>
                 </div>`);
  });
  let dir = '/home/anilpdv/Music/';
  songsList.forEach(song => {
    songsExist.push(dir + song);
  });
  if (songPlaying == '') {
    console.log('sound');
    console.log(songsExist.length);
    sound = new Howl({
      src: songsExist,
    });
  }
});
$('#pause').hide();
$('#play').click(event => {
  soundId = sound.play();
  if (sound.playing(soundId)) {
    $('#play').hide();
    $('#pause').show();
    $('#songName').html(`<span>${songsExist[0]}</span>`);
  }
});

$('#pause').click(event => {
  sound.pause(soundId);
  $('#pause').hide();
  $('#play').show();
});
$('#next').click(event => {
  count++;
  songPlaying = songsExist[count];
  console.log(sound.state());
  $('#play').hide();
  $('#pause').show();

  if (sound.playing(soundId)) {
    sound.stop(soundId);
    sound = new Howl({src: [songPlaying]});
    soundId = sound.play();
  } else {
    sound = new Howl({src: [songPlaying]});
    soundId = sound.play();
  }
});
$('#prev').click(event => {
  count--;
  songPlaying = songsExist[count];
  $('#play').hide();
  $('#pause').show();

  if (sound.playing(soundId)) {
    sound.stop(soundId);
    sound = new Howl({src: [songPlaying]});
    soundId = sound.play();
  } else {
    sound = new Howl({src: [songPlaying]});
    soundId = sound.play();
  }
});
