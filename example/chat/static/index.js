var DiscoveryNetwork = require("../../../browser")
    , discoveryLog = DiscoveryNetwork.log
    , Connection = DiscoveryNetwork.Connection
    , PeerNetwork = DiscoveryNetwork.PeerNetwork
    , RelayNetwork = DiscoveryNetwork.RelayNetwork
    , RelayConnection = DiscoveryNetwork.RelayConnection

var chatBox = document.getElementById("chat-box")
    , chatMessages = document.getElementById("chat-messages")
    , chatButton = document.getElementById("chat-button")
    // Open discovery connection
    , conn = Connection("http://localhost:8081/shoe")
    , connections = {}
    , streams = []

chatButton.addEventListener("click", sendMessage)

chatButton.disabled = true

// Enable logging
discoveryLog.enabled = true

// Identify ourself with a random UUID
conn.identify()

var peerNetwork = PeerNetwork(conn)
    , relayNetwork = RelayNetwork(conn)

// when you detect a new peer joining, open a RC to them
peerNetwork.on("peer", handlePeer)

// when we detect an offer from the relay network, open an RC to them
relayNetwork.on("offer", handleOffer)

// incoming answers from another peer
relayNetwork.on("answer", handleAnswer)

peerNetwork.join()

function handlePeer(remotePeerId) {
    var rc = connections[remotePeerId] = RelayConnection(conn)
        , offer = rc.createOffer()

    relayNetwork.sendOffer(remotePeerId, offer)
}

function handleOffer(remotePeerId, offer) {
    var rc = connections[remotePeerId] = RelayConnection(conn)

    rc.on("stream", handleStream)

    rc.receiveOffer(offer)
    
    var answer = rc.createAnswer(offer)

    relayNetwork.sendAnswer(remotePeerId, answer)
}

function handleAnswer(remotePeerId, answer) {
    var rc = connections[remotePeerId]

    rc.on("stream", handleStream)

    rc.receiveAnswer(answer)
}

function handleStream(stream) {
    chatButton.disabled = false

    streams.push(stream)

    stream.on("data", renderMessage)
}

function renderMessage(data) {
    var msg = document.createElement("div")
    msg.textContent = "stranger: " + data
    chatMessages.appendChild(msg)
}

function sendMessage() {
    var text = chatBox.value
    chatBox.value = ""
    streams.forEach(send)

    var msg = document.createElement("div")
    msg.textContent = "self: " + text
    chatMessages.appendChild(msg)

    function send(stream) {
        stream.write(text)
    }
}