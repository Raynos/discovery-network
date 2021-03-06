var RemoteEventEmitter = require("remote-events")
    , EventEmitter = require("events").EventEmitter
    , log = require("../log")

module.exports = PeerNetwork

function PeerNetwork(connection, channel) {
    var mx = connection.mx
        , networkName = connection.networkName
        , localPeerId = connection.selfId
        , peerStream = mx.createStream(networkName + "/peer/echo/" +
            encodeURIComponent(channel))
        , peerEmitter = new RemoteEventEmitter()
        , network = new EventEmitter()

    peerStream.pipe(peerEmitter.getStream()).pipe(peerStream)

    peerEmitter.on("peer", onpeer)

    network.join = join
    network.destroy = destroy

    return network

    function onpeer(remotePeerId) {
        log.info("onpeer", remotePeerId)
        if (remotePeerId !== localPeerId) {
            network.emit("peer", remotePeerId)
        }
    }

    function join(user) {
        log.info("join", user)
        if (user) {
            localPeerId = user.toString()
        }
        peerEmitter.emit("peer", localPeerId)
    }

    function destroy() {
        peerStream.end()
        peerStream.destroy()

        network.emit("close")
    }
}