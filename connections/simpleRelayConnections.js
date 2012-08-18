var EventEmitter = require("events").EventEmitter
    , RelayConnection = require("./relayConnection")
    , forEach = require("iterators").forEachSync
    , log = require("../log")

module.exports = SimpleRelayConnections

function SimpleRelayConnections(conn) {
    var relayConnections = {}
        , rcs = new EventEmitter()
        , streams = rcs.streams = {}

    rcs.create = create
    rcs.handleAnswer = handleAnswer
    rcs.destroy = destroy

    return rcs

    function create(remotePeerId, offer) {
        log.info("create", arguments)
        var rc = relayConnections[remotePeerId] = RelayConnection(conn)
        if (offer) {
            rc.on("stream", handleStream)

            rc.receiveOffer(offer)

            return rc.createAnswer(offer)
        }

        return rc.createOffer()

        function handleStream(stream) {
            streams[remotePeerId] = stream

            rcs.emit("stream", remotePeerId, stream)
        }
    }

    function handleAnswer(remotePeerId, answer) {
        log.info("handleAnswer", arguments)
        var rc = relayConnections[remotePeerId]

        rc.on("stream", handleStream)

        rc.receiveAnswer(answer)

        function handleStream(stream) {
            streams[remotePeerId] = stream

            rcs.emit("stream", remotePeerId, stream)
        }
    }

    function destroy() {
        forEach(rcs.streams, close)

        rcs.emit("close")
    }
}

function close(stream) {
    stream.end()
    stream.destroy()
}