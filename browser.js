// God damn
window.Buffer = require("buffer").Buffer

var Connection = require("./lib/connection")
    , PeerNetwork = require("./lib/peerNetwork")
    , WebRTCNetwork = require("./lib/webRTCNetwork")
    , log = require("./lib/log")

module.exports = {
    Connection: Connection
    , PeerNetwork: PeerNetwork
    , WebRTCNetwork: WebRTCNetwork
    , log: log
}