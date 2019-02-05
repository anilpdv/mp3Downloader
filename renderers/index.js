const electron = require('electron');
const {ipcRenderer} = electron;
// : page load send message and it loads the data and sends it
ipcRenderer.send('page:load', 'pageloaded');

// : recieve the data and render to the html
// @event : data:json
// @desc  : takes the data and render it
// @api   : "most popular"
ipcRenderer.on('data:json', (event, data) => {
  console.log(data);
  data.items.map(video => {
    $('#app').append(`<div id="work" class="col">
                      <div class="box">
                          <div class="image">
                              <img  src=${
                                video.snippet.thumbnails.medium.url
                              } alt=${video.snippet.title} />
                          </div>
                          <div class="content">
                            <a data=${
                              video.id
                            } class="header">${video.snippet.title.substring(
      0,
      40,
    )}</a>
                          </div>
                          <div class="button">
                          <button type="button" id=${
                            video.id
                          } class="btn btn-info btn-rounded">download</button>
                          </div>
                          <div class=${video.id}>
  
                          </div>
                      </div>
                      </div>
                          `);
  });
});

// : on download finish recieves message
// @ event : "download:finish"
// @ desc  : takes data as argument [type:object]
// @ info  : render html with finished icon
ipcRenderer.on('download:finish', (event, data) => {
  $(`.${data.videoId}`).html(`
                   <div class="text-center bg-warning">
                       <i class="fas fa-check-circle fa-lg"></i>
                   </div>`);
});

$('#search').click(function(e) {
  //ipcRenderer.send("search:data",)

  let search = $('#input').val();
  ipcRenderer.send('search', search);
});

ipcRenderer.on('search:data', (event, data) => {
  console.log(data);
  data.items.map(video => {
    $('#app').prepend(`
                      <div class="col">
                      <div class="box">
                          <div class="image">
                              <img  src=${
                                video.snippet.thumbnails.medium.url
                              } alt=${video.snippet.title} />
                          </div>
                          <div class="content">
                            <p>
                              <a data=${
                                video.id.videoId
                              } class="header">${video.snippet.title.substring(
      0,
      26,
    )}</a>
                            </p>
                          </div>
                          <div class="button">
                          <button type="button" id=${
                            video.id.videoId
                          } class="btn btn-info">download</button>
                           </div>
                          <div class=${video.id.videoId}>
  
                          </div>
                      </div>
                      </div>`);
  });
});

$('#app').on('click', 'a.header', function(e) {
  ipcRenderer.send('change:page', e.target.attributes.data.nodeValue);
});

$('#app').on('click', 'button', function(e) {
  console.log(e.currentTarget.id);
  classFunction(e.currentTarget.id);
});

classFunction = videoId => {
  ipcRenderer.send('data:id', videoId);
  console.log(videoId);
};

ipcRenderer.on('loading:data', (event, data) => {
  console.log(data);
  $(`.${data.videoId}`).html(`
                   <div class="progress" >
                      <div style="background:red; height:24px; margin-top:14px; border-radius:400px; width:${
                        data.data
                      }%">
      </div>
                   </div>`);
});

// : path to player
// @route : '/player.html'
// @desc  : play mp3 files from the memory
// @access: public
$('#player').click(() => {
  ipcRenderer.send('player:load', 'open player');
});

$('#lyrics').click(() => {
  ipcRenderer.send('lyrics:load', 'open lyrics');
});
