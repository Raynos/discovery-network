var store = require("./store")

module.exports = handleOffer

function handleOffer(offerStream) {
    offerStream.once("data", ondata)

    function ondata(token) {
        store.set(token, offerStream)
    }
}