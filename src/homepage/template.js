var yo = require('yo-yo');
var layout = require('../layout');
var picture = require('../picture-card');
var translate = require('../translate').message;
var request = require('superagent');

module.exports = function (pictures) {
  var el = yo`<div class="container timeline">
    <div class="row">
      <div class="col s12 m10 offset-m1 l8 offset-l2 center-align">
        <a class="btn btn-flat btn-white cyan" href="#" onclick=${openbox}><i class="fa fa-paint-brush" aria-hidden="true"></i> Picto</a>
        <div id="modaldraw" class="modal modal-fixed-footer modaldraw">
          <div class="modal-content center">
            <canvas id="paper" class="paper" width="500" height="500">
              Your browser needs to support canvas for this to work!
            </canvas>
          </div>
          <div class="modal-footer">
            <div class="fixed-action-btn horizontal click-to-toggle" style="bottom: 15px; right: 24px;">
              <a class="btn-floating btn-large red">
                <i class="fa fa-bars" aria-hidden="true"></i>
              </a>
              <ul>
                <li><a class="btn-floating red" href="#" onclick=${cancel}><i class="fa fa-trash" aria-hidden="true"></i></a></li>
                <li><a class="btn-floating blue" href="#" onclick=${uploadImage}><i class="fa fa-cloud-upload" aria-hidden="true"></i></a></li>
                <li><a id="eraser" class="btn-floating yellow darken-1"><i class="fa fa-eraser" aria-hidden="true"></i></a></li>
                <li><a id="pencil" class="btn-floating green"><i class="fa fa-pencil" aria-hidden="true"></i></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div id="pictures-container" class="col s12 m10 offset-m1 l6 offset-l3">
        ${pictures.map(function (pic) {
          return picture(pic);
        })}
      </div>
    </div>
  </div>`;

  function cancel() {
    $('#modaldraw').closeModal();
    return false;
  }

  function uploadImage() {
    var image = document.getElementById('paper').toDataURL('image/jpg');
    var blob = dataURItoBlob(image);
    var data = new FormData();
    data.append("picture", blob);

    fetch('/api/pictures', {
      method: 'POST',
      body: data
    }).then(function (res) {
      $('#modaldraw').closeModal();
      console.log(res);
    })
    .catch(function (err) {
      $('#modaldraw').closeModal();
      console.log(err);
    });

    return false;
  }

  function openbox() {
    $('#modaldraw').openModal({
        ready: function() { 
          pictobox() 
        }
      }
    );

    return false;
  }

  function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }

  function pictobox() {
    // setup canvas and audio
    var canvas = document.getElementById("paper");
    var ctx = canvas.getContext("2d");

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.width);
    ctx.stroke();

    var drawing = false;

    //paint seccion
    document.getElementById("paper").addEventListener("mousedown", function(e) {
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX,e.offsetY);
    }, false);

    document.getElementById("paper").addEventListener("mousemove", function(e) {
      if (drawing){
        ctx.lineTo(e.offsetX,e.offsetY);
        ctx.stroke();
      }
    }, false);

    document.getElementById("paper").addEventListener("mouseup", function() {
      drawing = false;
    }, false);

    document.getElementById("paper").addEventListener("mouseleave", function() {
      drawing = false;
    }, false);

    document.getElementById("pencil").addEventListener("click", function() {
      ctx.strokeStyle = "#000";
    }, false);

    document.getElementById("eraser").addEventListener("click", function() {
      ctx.strokeStyle = "#fff";
    }, false);
  }


  return layout(el);
}

