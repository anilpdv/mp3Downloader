const electron = require('electron');
const {ipcRenderer} = electron;

ipcRenderer.send('listen:to:me', 'page2.html');
ipcRenderer.on('listen:id', function(event, data) {
  $('#lyrics').html(`<h1>${data}</h1>`);
});

$('a').click(function() {
  ipcRenderer.send('go:to', null);
});

ipcRenderer.on('page2:data', function(event, data) {
  console.log(data);
  data.lyrics.text.map(function(sub) {
    $('#lyrics').append(
      `<h4>
         ${sub['_@ttribute']}
      </h4>`,
    );
  });
});
