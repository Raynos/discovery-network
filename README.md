# discovery-network

A peer to peer discovery network in the cloud

## Example

See [webrtc-stream for more detailed example][1]

``` js
var DiscoveryNetwork = require("../../../browser")
    , Connection = DiscoveryNetwork.Connection
    , RelayStreams = DiscoveryNetwork.RelayStreams

// Open discovery connection
var conn = Connection("http://localhost:8081/shoe")

// Identify ourself with a random UUID
conn.identify()

// Open up a set of relay streams through the connection, on the namespace
RelayStreams(conn, "discovery-network-demo", handleStream)

// When the relay emits a stream handle it
function handleStream(remotePeerId, stream) {
    stream.write("hello!")

    stream.on("data", log)

    function log(data) {
        console.log("data from peer", remotePeerId, data)
    }
}
```

## Installation

`npm install discovery-network`

## Contributors

 - Raynos

## MIT Licenced

  [1]: https://github.com/Raynos/webrtc-stream/tree/master/example