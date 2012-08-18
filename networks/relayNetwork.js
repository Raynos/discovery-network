var RemoteEventEmitter = require("remote-events")
    , EventEmitter = require("events").EventEmitter
    , log = require("../log")

module.exports = RelayNetwork

function RelayNetwork(connection, channel) {
    var mx = connection.mx
        , networkName = connection.networkName
        , localPeerId = connection.selfId
        , relayStream = mx.createStream(networkName + "/relay/echo/" +
            encodeURIComponent(channel))
        , relayEmitter = new RemoteEventEmitter()
        , network = new EventEmitter()

    relayStream.pipe(relayEmitter.getStream()).pipe(relayStream)

    relayEmitter.on("offer", onoffer)
    relayEmitter.on("answer", onanswer)

    network.sendAnswer = sendAnswer
    network.sendOffer = sendOffer

    network.identify = identify

    return network

    function onoffer(toPeerId, fromPeerId, offer) {
        log.verbose("onoffer", arguments)
        if (toPeerId === localPeerId) {
            network.emit("offer", fromPeerId, offer)
        }
    }

    function onanswer(toPeerId, fromPeerId, answer) {
        log.verbose("onanswer", arguments)
        if (toPeerId === localPeerId) {
            network.emit("answer", fromPeerId, answer)
        }
    }

    function sendOffer(remotePeerId, offer) {
        log.info("sendOffer", arguments)
        relayEmitter.emit("offer", remotePeerId, localPeerId, offer)
    }

    function sendAnswer(remotePeerId, answer) {
        log.info("sendAnswer", arguments)
        relayEmitter.emit("answer", remotePeerId, localPeerId, answer)
    }

    function identify(user) {
        localPeerId = user.toString()
    }
}