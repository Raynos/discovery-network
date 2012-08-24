var WebRTC = require("webrtc-stream")
    , MediaStream = WebRTC.MediaStream
    , WebRTCStreams = WebRTC.WebRTCStreams
    , DiscoveryNetwork = require("../../../browser")
    , Connection = DiscoveryNetwork.Connection

var localVideo = document.getElementById("local-webrtc")
    , remoteVideos = document.getElementById("remote-videos")

WebRTC.log.enabled = true
DiscoveryNetwork.log.enabled = true

MediaStream.local(localVideo, function (myMediaStream) {
    var conn = Connection("http://localhost:8081/shoe")
        
    WebRTCStreams(conn, "mediaStreams-demo", myMediaStream, renderStream)

    function renderStream(remotePeerId, stream) {
        var remoteVideo = document.createElement("video")
        remoteVideo.autoplay = true
        remoteVideos.appendChild(remoteVideo)
        MediaStream.remote(remoteVideo, stream)
    }
})