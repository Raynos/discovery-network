// God damn
window.Buffer = require("buffer").Buffer

var Connection = require("./networks/connection")
    , PeerNetwork = require("./networks/peerNetwork")
    , WebRTCNetwork = require("./networks/webRTCNetwork")
    , RelayNetwork = require("./networks/relayNetwork")
    , RelayConnection = require("./connections/relayConnection")
    , SimpleRelayConnections = require("./connections/simpleRelayConnections")
    , log = require("./log")

module.exports = {
    Connection: Connection
    , PeerNetwork: PeerNetwork
    , WebRTCNetwork: WebRTCNetwork
    , RelayNetwork: RelayNetwork
    , RelayConnection: RelayConnection
    , SimpleRelayConnections: SimpleRelayConnections
    , log: log
}