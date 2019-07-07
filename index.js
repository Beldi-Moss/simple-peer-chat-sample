var getUserMedia = require('getusermedia')
var Peer = require('simple-peer')
getUserMedia({ video: true, audio: true }, function (err, stream) {
  if (err) {console.log('error ', err)}

  console.log("create peer");
  var config = { 
    "lifetimeDuration": "86400s",
    "iceServers": [ 
        {
       "urls": [
         "stun:74.125.140.127:19302",
         "stun:[2a00:1450:400c:c08::7f]:19302"
       ]
     },
    {
       "urls": [
         "turn:74.125.140.127:19305?transport=udp",
         "turn:[2a00:1450:400c:c08::7f]:19305?transport=udp",
         "turn:74.125.140.127:19305?transport=tcp",
         "turn:[2a00:1450:400c:c08::7f]:19305?transport=tcp"
       ],
       "username": "CKy3/egFEgb9BBVd4lwYqvGggqMKIICjBQ",
       "credential": "cgv31xsC2kreFtAkX50Bft6978Y=",
 
     }
 ],  "blockStatus": "NOT_BLOCKED",
 "iceTransportPolicy": "all" 
 };
  var peer = new Peer({
    config: config,
    initiator: location.hash === '#init',
    trickle: true,
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
    var video = document.createElement('video')
    document.body.appendChild(video)
    video.srcObject=stream;
    video.play()
  })
})