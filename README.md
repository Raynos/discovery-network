# discovery-network

A peer to peer discovery network in the cloud

## Example

See [webrtc-stream for more detailed example][1]

``` js
var conn = Connection()

// identify yourself to discovery network connection
conn.identify(userObject)

// open peer & webrtc networks
var peerNetwork = PeerNetwork(conn)
    , webrtcNetwork = WebRTCNetwork(conn)

// when you detect a new peer joining, open a PC to them
peerNetwork.on("peer", handlePeer)

// incoming offer from another peer
webrtcNetwork.on("offer", handleOffer)

// incoming answers from another peer
webrtcNetwork.on("answer", handleAnswer)

// incoming candidates from another peer
webrtcNetwork.on("candidate", handleCandidate)
```

## Installation

`npm install discovery-network`

## Contributors

 - Raynos

## MIT Licenced

  [1]: https://github.com/Raynos/webrtc-stream/tree/master/example