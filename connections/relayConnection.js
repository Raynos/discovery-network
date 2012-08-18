var EventEmitter = require("events").EventEmitter
    , uuid = require("node-uuid")
    , log = require("../log")

module.exports = RelayConnection

function RelayConnection(connection) {
    var mx = connection.mx
        , networkName = connection.networkName
        , localPeerId = connection.selfId
        , relayConnection = new EventEmitter()
        , token = uuid()

    relayConnection.receiveAnswer = receiveAnswer
    relayConnection.receiveOffer = receiveOffer
    relayConnection.createAnswer = createAnswer
    relayConnection.createOffer = createOffer

    return relayConnection

    function receiveAnswer(answer) {
        log.info("receiveAnswer", answer)
        var stream = mx.createStream(networkName + "/relay/answer")

        stream.write(token + answer)
        stream.once("data", isOpen)

        function isOpen(data) {
            if (data === "open") {
                relayConnection.emit("stream", stream)
            }
        }
    }

    function receiveOffer(offer) {
        log.info("receiveOffer", offer)
        var stream = mx.createStream(networkName + "/relay/offer")

        stream.write(offer + token)
        stream.once("data", isOpen)

        function isOpen(data) {
            if (data === "open") {
                relayConnection.emit("stream", stream)
            }
        }
    }

    function createAnswer(offer) {
        return token
    }

    function createOffer() {
        return token
    }
}