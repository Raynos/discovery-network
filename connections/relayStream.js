var SimpleRelayNetwork = require("./simpleRelayNetwork")
    , BufferStream = require("buffer-stream")

module.exports = RelayStream

function RelayStream(srn, remotePeerId) {
    var relayStream = BufferStream().buffer()

    srn.on("stream", handleStream)

    srn.sendOffer(remotePeerId, srn.create(remotePeerId))

    return relayStream

    function handleStream(peerId, stream) {
        if (peerId === remotePeerId) {
            relayStream.empty(stream)
        }
    }
}