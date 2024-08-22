let socket = null;
let connectionOpened = false;


document.addEventListener("DOMContentLoaded", () => {
    ["server_ip", "server_port"].forEach((id) => {
        document.getElementById(id).addEventListener("keyup", (event) => {
            if (event.key === "Enter")
                connect();
        });
    });

    document.getElementById("input").addEventListener("keyup", (event) => {
        if (event.key === "Enter")
            send();
    });

    // Debug
    // connect();
});


function connect() {
    if (socket !== null)
        return;

    waitForConnection(true);

    let ip = getText("server_ip");
    let port = getText("server_port");

    socket = new WebSocket("ws://" + ip + ":" + port);
    socket.onerror = () => {
        if (connectionOpened) {
            showError("La conexión fue terminada");
            console.log("Connection reset");
        } else {
            showError("No se encontró el servidor");
            console.log("Server not found");
        }

        waitForConnection(false);
        toggleLoginVisibility(false);

        connectionOpened = false;
        socket = null;
    }

    socket.onopen = () => {
        connectionOpened = true;
        toggleErrorNotificationVisibility(true);
        toggleLoginVisibility(true);
    }

    socket.onmessage = (event) => {
        let data = JSON.parse(event.data);
        document.getElementById("output").value = data.data;
    }
}


function disconnect() {
    if (socket !== null && socket.readyState !== WebSocket.CLOSED) {
        socket.close();
        socket = null;
    }

    toggleLoginVisibility(false);
}


function send() {
    if (socket === null || socket.readyState === WebSocket.CLOSED)
        return;

    let textarea = document.getElementById("input");
    let msg = textarea.value;
    msg = msg.substring(0, msg.length - 1);
    textarea.value = "";

    socket.send(msg);
}
