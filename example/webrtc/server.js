var browserifyServer = require("browserify-server")
    , shoe = require("mux-demux-shoe")
    , DiscoveryNetwork = require("../..")

var server = browserifyServer.listen(__dirname, 8080)
    , network = DiscoveryNetwork()

shoe(network).install(server, "/shoe")

console.log("running on port 8080")