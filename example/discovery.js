var http = require("http")
    , shoe = require("mux-demux-shoe")
    , DiscoveryNetwork = require("..")

var server = http.createServer().listen(8081)
    , network = DiscoveryNetwork()

shoe(network).install(server, "/shoe")

console.log("running on port 8081")