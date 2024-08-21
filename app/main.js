let socket = null;


function connect() {
    if (socket !== null)
        return;

    waitForConnection(true);

    let ip = getText("server_ip");
    let port = getText("server_port");

    socket = new WebSocket("ws://" + ip + ":" + port);
    socket.onerror = () => {
        showError("No se encontró el servidor");
        waitForConnection(false);

        console.log("Connection timeout");
        socket = null;
    }

    socket.onopen = () => {
        toggleErrorNotificationVisibility(true);
        waitForConnection(false);
    }

    socket.onmessage = (event) => {
        let data = JSON.parse(event.data);
    }
}


function send() {
    if (socket === null || socket.readyState === WebSocket.CLOSED)
        return;

    // socket.send(msg);
}
