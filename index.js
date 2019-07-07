var getUserMedia = require('getusermedia')
var Peer = require('simple-peer')
getUserMedia({ video: true, audio: true }, function (err, stream) {
  if (err) {console.log('error ', err)}

  console.log("create peer");
  var peer = new Peer({
    initiator: location.hash === '#init',
    trickle: false,
    stream: stream
  })

  peer.on('signal', function (data) {
    document.getElementById('yourId').value = JSON.stringify(data)
  })

  document.getElementById('connect').addEventListener('click', function () {
    console.log("connect");
    var otherId = JSON.parse(document.getElementById('otherId').value)
    peer.signal(otherId)
  })

  document.getElementById('send').addEventListener('click', function () {
    var yourMessage = document.getElementById('yourMessage').value
    peer.send(yourMessage)
  })

  peer.on('data', function (data) {
    document.getElementById('messages').textContent += data + '\n'
  })
  peer.on('error', err => console.log('peer error', err))
  peer.on('stream', function (stream) {
    var video = document.createElement('audio')
    document.body.appendChild(video)
    video.srcObject=stream;
    video.play()
  })
})