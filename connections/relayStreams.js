var SimpleRelayConnections = require("./simpleRelayConnections")
    , RelayNetwork = require("../networks/relayNetwork")
    , PeerNetwork = require("../networks/peerNetwork")
    , EventEmitter = require("events").EventEmitter

module.exports = RelayStreams

function RelayStreams(conn, name, callback) {
    var rcs = SimpleRelayConnections(conn)
        , peerNetwork = PeerNetwork(conn, name + "/peer")
        , relayNetwork = RelayNetwork(conn, name + "/relay")
        , streams = new EventEmitter()
        
    // when you detect a new peer joining, open a RC to them
    peerNetwork.on("peer", handlePeer)

    // when we detect an offer from the relay network, open an RC to them
    relayNetwork.on("offer", handleOffer)

    // incoming answers from another peer
    relayNetwork.on("answer", rcs.handleAnswer)

    // handle streams coming out of rcs
    rcs.on("stream", callback)

    peerNetwork.join()

    streams.rcs = rcs
    streams.streams = rcs.streams
    streams.peerNetwork = peerNetwork
    streams.relayNetwork = relayNetwork
    streams.destroy = destroy

    return streams

    function handlePeer(remotePeerId) {
        var offer = rcs.create(remotePeerId)

        relayNetwork.sendOffer(remotePeerId, offer)
    }

    function handleOffer(remotePeerId, offer) {
        var answer = rcs.create(remotePeerId, offer)

        relayNetwork.sendAnswer(remotePeerId, answer)
    }

    function destroy() {
        rcs.destory()
        peerNetwork.destroy()
        relayNetwork.destroy()

        streams.emit("close")
    }
}