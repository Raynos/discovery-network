var store = require("./store")

module.exports = handleAnswer

function handleAnswer(answerStream) {
    answerStream.once("data", ondata)

    function ondata(token) {
        var offerStream = store.get(token)

        if (offerStream === null) {
            return answerStream.error("invalid answer token")
        }

        store.delete(token)

        offerStream.write("open")
        answerStream.write("open")
        answerStream.pipe(offerStream).pipe(answerStream)
    }
}