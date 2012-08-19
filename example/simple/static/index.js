var DiscoveryNetwork = require("../../../browser")
    , Connection = DiscoveryNetwork.Connection
    , RelayStreams = DiscoveryNetwork.RelayStreams

// Open discovery connection
var conn = Connection("http://localhost:8081/shoe")

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