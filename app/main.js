let socket = null;
let connectionOpened = false;
let terminalOutput = "";
let working = false;

let canUploadData = true;

let filesize = 0;
let filename = "downloaded_file";
let sum = 0;
let fileChunks = [];


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

    socket.binaryType = "arraybuffer";

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
        socket.send("upload_policy");
    }

    filesize = 0;
    filename = "downloaded_file";
    sum = 0;
    fileChunks = [];
    socket.onmessage = receive;

    socket.onclose = () => {
        clear(false);
    }
}


function disconnect() {
    if (socket !== null && socket.readyState !== WebSocket.CLOSED) {
        socket.close();
        socket = null;
    }

    toggleLoginVisibility(false);
}


function clear(userClear) {
    terminalOutput = userClear ? "$ " : "";
    document.getElementById("output").value = terminalOutput;
    setProgressBarValue(0);
}


function send() {
    if (socket === null || socket.readyState === WebSocket.CLOSED)
        return;

    const textarea = document.getElementById("input");
    const msg = textarea.value;

    if (working) {
        textarea.value = msg;
        return;
    }

    textarea.value = "";

    terminalOutput += msg + "\n";

    if (msg.toLowerCase() === "clear") {
        clear(true);
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


function getChunkSize(fileSize) {
    if (fileSize < 1024 * 1024)// Less than 1 MB
        return 4096; // 4 KB

    if (fileSize < 10 * 1024 * 1024) // 1 MB to 10 MB
        return 16384; // 16 KB

    if (fileSize < 100 * 1024 * 1024) // 10 MB to 100 MB
        return 65536; // 64 KB

    return 1048576; // 1 MB for larger files
}


function uploadFile() {
    if (socket === null || socket.readyState === WebSocket.CLOSED)
        return;

    if (!canUploadData) {
        showError("No se permite subir archivos");
        return;
    }

    if (working) {
        showError("Un archivo esta siendo subido, intenta de nuevo más tarde");
        return;
    }

    setProgressBarValue(0);
    const selector = document.getElementById("cli_file_uploader");
    if (selector.files.length !== 1)
        return;

    let file = selector.files[0];

    terminalOutput += "put " + file.name + "\n$ ";
    working = true;
    toggleWorkingState(working);
    socket.send(file.size + "up:" + file.name);

    const chunkSize = getChunkSize(file.size);
    let offset = 0;

    function sendNextChunk() {
        if (!canUploadData)
            return;

        if (offset < file.size) {
            const end = Math.min(offset + chunkSize, file.size);
            const chunk = file.slice(offset, end);

            setProgressBarValue(Math.trunc(end * 100 / file.size));

            let reader = new FileReader();
            reader.onload = (event) => {
                socket.send(event.target.result);
                offset += chunkSize;
                sendNextChunk();
            };
            reader.readAsArrayBuffer(chunk);
        } else {
            working = false;
            toggleWorkingState(working);
        }
    }

    updateOutputArea();
    sendNextChunk();
}


function receive(event) {
    const data = event.data;

    if (data instanceof ArrayBuffer) {
        sum += data.byteLength;
        setProgressBarValue(Math.trunc(sum * 100 / filesize));
        fileChunks.push(data);

        if (sum === filesize) {
            filesize = 0;
            sum = 0;
            const blob = new Blob(fileChunks);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            fileChunks = [];

            working = false;
            toggleWorkingState(working);
        }

        return;
    }

    if (data.replace(/\d+:.+/, "").length === 0) {
        terminalOutput += "$ ";
        updateOutputArea();

        let size_name = data.split(":");
        filesize = parseInt(size_name[0]);
        filename = size_name[1];
        return;
    }

    try {
        const json_data = JSON.parse(data);
        let output = json_data.data;
        if (output.includes("Upload files is"))
            canUploadData = !output.includes("not allowed")
        else
            terminalOutput += output + (output ? "\n$ " : "$ ");
    } catch (e) {
        console.error(e);
        showError("Error al leer la salida del comando");
        terminalOutput += "$ ";
    }

    working = false;
    toggleWorkingState(working);
    updateOutputArea();
}


function updateOutputArea() {
    const outputTextarea = document.getElementById("output");
    outputTextarea.value = terminalOutput;
    outputTextarea.scrollTop = outputTextarea.scrollHeight;
}
