var DiscoveryNetwork = require("../../../browser")
    , discoveryLog = DiscoveryNetwork.log
    , Connection = DiscoveryNetwork.Connection
    , PeerNetwork = DiscoveryNetwork.PeerNetwork
    , RelayNetwork = DiscoveryNetwork.RelayNetwork
    , SimpleRelayConnections = DiscoveryNetwork.SimpleRelayConnections
    , forEach = require("iterators").forEachSync

var chatBox = document.getElementById("chat-box")
    , chatMessages = document.getElementById("chat-messages")
    , chatButton = document.getElementById("chat-button")
    // Open discovery connection
    , conn = Connection("http://localhost:8081/shoe")
    , rcs = SimpleRelayConnections(conn)

chatButton.addEventListener("click", sendMessage)

chatButton.disabled = true

// Enable logging
discoveryLog.enabled = true

// Identify ourself with a random UUID
conn.identify()

var peerNetwork = PeerNetwork(conn, "discovery-network-demo:peer")
    , relayNetwork = RelayNetwork(conn, "discovery-network-demo:relay")

// when you detect a new peer joining, open a RC to them
peerNetwork.on("peer", handlePeer)

// when we detect an offer from the relay network, open an RC to them
relayNetwork.on("offer", handleOffer)

// incoming answers from another peer
relayNetwork.on("answer", rcs.handleAnswer)

// handle streams coming out of rcs
rcs.on("stream", handleStream)

peerNetwork.join()

function handlePeer(remotePeerId) {
    var offer = rcs.create(remotePeerId)

    relayNetwork.sendOffer(remotePeerId, offer)
}

function handleOffer(remotePeerId, offer) {
    var answer = rcs.create(remotePeerId, offer)

    relayNetwork.sendAnswer(remotePeerId, answer)
}

function handleStream(remotePeerId, stream) {
    chatButton.disabled = false

    stream.on("data", renderMessage)

    function renderMessage(data) {
        var msg = document.createElement("div")
        msg.textContent = "stranger[" + remotePeerId + "]: " + data
        chatMessages.appendChild(msg)
    }
}

function sendMessage() {
    var text = chatBox.value
    chatBox.value = ""
    forEach(rcs.streams, send)

    var msg = document.createElement("div")
    msg.textContent = "self: " + text
    chatMessages.appendChild(msg)

    function send(stream) {
        stream.write(text)
    }
}