let socket = null;
let connectionOpened = false;
let terminalOutput = "";
let working = false;


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
    // socket = new WebSocket("wss://" + ip + ":" + port); // Testing for now

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
        socket.send("server_platform");
    }

    socket.onmessage = (event) => {
        working = false;
        toggleWorkingState(working);

        try {
            let data = JSON.parse(event.data);
            terminalOutput += data.data + (data.data ? "\n$ " : "$ ");
        } catch (e) {
            console.error(e);
            showError("Error al leer la salida del comando");
            terminalOutput += "$ ";
        }

        let outputTextarea = document.getElementById("output");
        outputTextarea.value = terminalOutput;
        outputTextarea.scrollTop = outputTextarea.scrollHeight;
    }

    socket.onclose = () => {
        clear();
    }
}


function disconnect() {
    if (socket !== null && socket.readyState !== WebSocket.CLOSED) {
        socket.close();
        socket = null;
    }

    toggleLoginVisibility(false);
}


function clear() {
    terminalOutput = "";
    document.getElementById("output").value = terminalOutput;
}


function send() {
    if (socket === null || socket.readyState === WebSocket.CLOSED)
        return;

    let textarea = document.getElementById("input");
    let msg = textarea.value;

    if (working) {
        textarea.value = msg;
        return;
    }

    textarea.value = "";

    terminalOutput += msg + "\n";

    if (msg.toLowerCase() === "clear") {
        clear();
        return;
    }

    if (msg.toLowerCase() === "exit") {
        disconnect();
        return;
    }

    working = true;
    toggleWorkingState(working);
    socket.send(msg);
}
