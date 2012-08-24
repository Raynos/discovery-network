var DiscoveryNetwork = require("../../../browser")
    , Connection = DiscoveryNetwork.Connection
    , RelayStream = DiscoveryNetwork.RelayStream
    , SimpleRelayNetwork = DiscoveryNetwork.SimpleRelayNetwork
    , PeerNetwork = DiscoveryNetwork.PeerNetwork

DiscoveryNetwork.log.enabled = true

// Open discovery connection
var conn = Connection("http://localhost:8081/shoe")
    , srn = SimpleRelayNetwork(conn, "discovery-network-demo", handleStream)
    , peerNetwork = PeerNetwork(conn)
    , opened = {

    }

peerNetwork.on("peer", function (peerId) {
    // Open up a set of relay streams through the connection, on the namespace
    var stream = RelayStream(srn, peerId)
    opened[peerId] = true

    stream.on("data", log)

    stream.write("goodbye!")

    function log(data) {
        console.log("[PEER1]", peerId, data)
    }
})

peerNetwork.join()

// When the relay emits a stream handle it
function handleStream(remotePeerId, stream) {
    if (opened[remotePeerId] !== true) {
        stream.write("hello!")

        stream.on("data", log)
    }

    function log(data) {
        console.log("[PEER2]", remotePeerId, data)
    }
}