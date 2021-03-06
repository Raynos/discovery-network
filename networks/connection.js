var shoe = require("shoe")
    , MuxDemux = require("mux-demux")
    , EventEmitter = require("events").EventEmitter
    , uuid = require("node-uuid")

module.exports = Connection

function Connection(uri, networkName) {
    networkName = networkName || "/discovery"
    
    var stream = shoe(uri || "/shoe")
        , mx = MuxDemux()
        , conn = new EventEmitter()

    stream.pipe(mx).pipe(stream)

    conn.selfId = uuid()
    conn.networkName = networkName
    conn.identify = identify
    conn.mx = mx
    conn.stream = stream

    stream.once("end", conn.emit.bind(conn, "end"))
    stream.once("connect", conn.emit.bind(conn, "connect"))

    return conn

    function identify(user) {
        conn.selfId = user.toString()
    }
}