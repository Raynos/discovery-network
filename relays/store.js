var StreamStore = require("stream-store")
    , store = StreamStore(function () {
        return null
    })

module.exports = store