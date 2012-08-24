var SimpleRelayConnections = require("./simpleRelayConnections")
    , RelayNetwork = require("../networks/relayNetwork")
    , EventEmitter = require("events").EventEmitter
    , log = require("../log")

module.exports = SimpleRelayNetwork

function SimpleRelayNetwork(conn, name, callback) {
    var rcs = SimpleRelayConnections(conn)
        , relayNetwork = RelayNetwork(conn, name + "/relay")
        , network = new EventEmitter()

    // when we detect an offer from the relay network, open an RC to them
    relayNetwork.on("offer", handleOffer)

    // incoming answers from another peer
    relayNetwork.on("answer", rcs.handleAnswer)

    // handle streams coming out of rcs
    rcs.on("stream", reemit)

    if (callback) {
        rcs.on("stream", callback)
    }

    network.rcs = rcs
    network.create = rcs.create
    network.sendOffer = relayNetwork.sendOffer
    network.streams = rcs.streams
    network.relayNetwork = relayNetwork
    network.destroy = destroy

    return network

    function handleOffer(remotePeerId, offer) {
        log.info("handleOffer", remotePeerId, offer)
        var answer = rcs.create(remotePeerId, offer)

        relayNetwork.sendAnswer(remotePeerId, answer)
    }

    function reemit(peerId, stream) {
        network.emit("stream", peerId, stream)
    }

    function destroy() {
        log.info("destroy")
        rcs.destroy()
        relayNetwork.destroy()

        network.emit("close")
    }
}