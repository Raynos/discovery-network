var DiscoveryNetwork = require("../../../browser")
    , Connection = DiscoveryNetwork.Connection
    , PeerNetwork = DiscoveryNetwork.PeerNetwork
    , RelayNetwork = DiscoveryNetwork.RelayNetwork
    , SimpleRelayConnections = DiscoveryNetwork.SimpleRelayConnections
    // Open discovery connection
    , conn = Connection("http://localhost:8081/shoe")
    , rcs = SimpleRelayConnections(conn)

// Identify ourself with a random UUID
conn.identify()

var peerNetwork = PeerNetwork(conn, "discovery-network-demo:peer")
    , relayNetwork = RelayNetwork(conn, "discovery-network-demo:relay")

// when you detect a new peer joining, open a RC to them
peerNetwork.on("peer", handlePeer)

// when we detect an offer from the relay network, open an RC to them
relayNetwork.on("offer", handleOffer)

// incoming answers from another peer
relayNetwork.on("answer", rcs.handleAnswer)

// handle streams coming out of rcs
rcs.on("stream", handleStream)

peerNetwork.join()

function handlePeer(remotePeerId) {
    var offer = rcs.create(remotePeerId)

    relayNetwork.sendOffer(remotePeerId, offer)
}

function handleOffer(remotePeerId, offer) {
    var answer = rcs.create(remotePeerId, offer)

    relayNetwork.sendAnswer(remotePeerId, answer)
}

function handleStream(remotePeerId, stream) {
    stream.write("hello!")

    stream.on("data", log)

    function log(data) {
        console.log("data from peer", remotePeerId, data)
    }
}