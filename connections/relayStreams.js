var SimpleRelayNetwork = require("./simpleRelayNetwork")
    , PeerNetwork = require("../networks/peerNetwork")
    , EventEmitter = require("events").EventEmitter
    , log = require("../log")

module.exports = RelayStreams

function RelayStreams(conn, name, callback) {
    var srn = SimpleRelayNetwork(conn, name, callback)
        , peerNetwork = PeerNetwork(conn, name + "/peer")
        , streams = new EventEmitter()
        
    // when you detect a new peer joining, open a RC to them
    peerNetwork.on("peer", handlePeer)

    peerNetwork.join()

    streams.srn = srn
    streams.streams = srn.streams
    streams.peerNetwork = peerNetwork
    streams.destroy = destroy

    return streams

    function handlePeer(remotePeerId) {
        log.info("handlePeer", remotePeerId)
        srn.sendOffer(remotePeerId, srn.create(remotePeerId))
    }

    function destroy() {
        log.info("destroy")
        srn.destroy()
        peerNetwork.destroy()

        streams.emit("close")
    }
}