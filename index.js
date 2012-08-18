var StreamRouter = require("stream-router")
    , EchoChamber = require("multi-channel-mdm")
    , logger = require("mux-demux-logger")
    , handleOffer = require("./relays/offer")
    , handleAnswer = require("./relays/answer")

module.exports = DiscoveryNetwork

function DiscoveryNetwork(options) {
    if (typeof options === "string" || !options) {
        options = {
            prefix: options || null
        }
    }

    var log = options.log
        , prefix = options.prefix || "/discovery"
        , router = StreamRouter()

    router.addRoute(prefix + "/peer/echo", EchoChamber())
    router.addRoute(prefix + "/webrtc/echo", EchoChamber())
    router.addRoute(prefix + "/relay/echo", EchoChamber())
    router.addRoute(prefix + "/relay/offer", handleOffer)
    router.addRoute(prefix + "/relay/answer", handleAnswer)

    if (log) {
        return logger(router)
    }
    return router
}