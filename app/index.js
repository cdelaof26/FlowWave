let errorCount = 0;
let cliMode = false;


function getText(elementId) {
    const element = document.getElementById(elementId);
    return element.innerText.length !== 0 ? element.innerText : element.value;
}


function toggleElementVisibility(elementId, hide) {
    if (hide)
        document.getElementById(elementId).classList.add("hidden");
    else
        document.getElementById(elementId).classList.remove("hidden");
}


function toggleButton(elementId, highlight) {
    const button = document.getElementById(elementId);

    let properties = ["bg-gradient-to-br", "from-sky-400", "to-indigo-600", "dark:from-rose-500", "dark:to-red-900", "text-body-0"];
    properties.forEach((property) => {
        if (highlight)
            button.classList.add(property);
        else
            button.classList.remove(property);
    });
}


function toggleElementState(elementId, enable) {
    document.getElementById(elementId).disabled = !enable;
}


function toggleErrorNotificationVisibility(hide) {
    errorCount = hide ? 0 : errorCount + 1;
    toggleElementVisibility("error_popup", hide);
    document.getElementById("error_count").innerText = errorCount;
}


function showError(msg) {
    toggleErrorNotificationVisibility(false);
    document.getElementById("error_data").innerText = msg;
}


function waitForConnection(showSpinner) {
    toggleElementState("connection_trigger", !showSpinner);
    toggleElementState("server_ip", !showSpinner);
    toggleElementState("server_port", !showSpinner);
    toggleElementVisibility("connect_button_text", showSpinner);
    toggleElementVisibility("connect_button_spinner", !showSpinner);
}


function toggleLoginVisibility(hideLogin) {
    waitForConnection(false);
    toggleElementVisibility("login", hideLogin);
    toggleElementVisibility("app", !hideLogin);
    toggleElementVisibility("logout_button", !hideLogin);

    toggleAppMode(false);
    toggleWorkingState(false);
    canUploadData = true;
}


function toggleWorkingState(working) {
    toggleElementState("send_button", !working);
    toggleElementVisibility("send_button_icon", working);
    toggleElementVisibility("send_button_spinner", !working);
}


function toggleAppMode(showCLI) {
    if (working) {
        showError("No se puede cambiar de modo hasta que termine la operación en progreso");
        return;
    }

    cliMode = showCLI;
    toggleElementVisibility("cli", !showCLI);
    toggleElementVisibility("graphic", showCLI);
    toggleButton("cli_toggle", showCLI);
    toggleButton("graphic_toggle", !showCLI);
}


function selectFile() {
    if (!canUploadData) {
        showError("No se permite subir archivos");
        return;
    }

    document.getElementById("cli_file_uploader").click();
}


function setProgressBarValue(value) {
    if (value !== 0 && !canUploadData)
        throw new Error("Upload is not allowed");

    const progressBar = document.getElementById("progress_bar");
    if (value === 0)
        progressBar.classList.add("hidden");
    else
        progressBar.classList.remove("hidden");

    value = value + "%";
    progressBar.innerText = value;
    progressBar.style.width = value;
}


function create_name(text, isDir) {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "size-4 md:size-5 mr-1 md:mr-2 self-center");
    svg.setAttribute("fill", "currentColor");
    svg.setAttribute("strokeWidth", "1");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("viewBox", "0 0 24 24");

    let iconData;
    if (isDir)
        iconData = ["M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z"];
    else
        iconData = ["M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z",
            "M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z"];

    iconData.forEach((p) => {
        let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("strokeLinecap", "round");
        path.setAttribute("strokeLinejoin", "round");
        path.setAttribute("d", p);
        svg.appendChild(path);
    });

    let div = document.createElement("div");
    div.className = "flex";
    let p = document.createElement("p");
    p.innerText = text;
    div.appendChild(svg);
    div.appendChild(p);

    return div;
}


function create_node(dat, bodyColor) {
    dat = dat.split(";");
    let isDir = dat[2] === "True";

    let rowElement = document.createElement("tr");
    rowElement.className = "p-1 text-sm md:text-base text-left rounded-md " +
        (bodyColor ? "bg-body-0 dark:bg-body-1" : "bg-sidebar-0 dark:bg-sidebar-1");

    rowElement.addEventListener("click", () => {
        if (isDir)
            cd(dat[0]);
        // else
            // socket.send("get " + dat[0]);
    });

    function kind(data) { return data === "True" ? "Directorio" : data === "False" ? "Archivo" : data }

    for (let i = 0; i < dat.length; i++) {
        let cellElement = document.createElement("td");
        if (i === 0) {
            cellElement.appendChild(create_name(kind(dat[i]), isDir));
        } else {
            cellElement.className = "font-light text-dim-2 dark:text-dim-3";
            cellElement.innerText = kind(dat[i]);
        }

        rowElement.appendChild(cellElement);
    }

    return rowElement;
}


function handleListing(data) {
    let fileViewer = document.getElementById("file_viewer");
    let newFileViewer = document.createElement("tbody");
    newFileViewer.id = "file_viewer";

    data = data.replace("ls: ", "");
    let i = 0;
    if (data !== "")
        data.split("\n").forEach((dat) => {
            newFileViewer.appendChild(create_node(dat, i % 2 === 0));
            i += 1;
        });

    fileViewer.replaceWith(newFileViewer);
}


function updateUI(data) {
    if (data.startsWith("pwd: ")) {
        document.getElementById("path").value = data.replace("pwd: ", "");
    } else if (data.startsWith("ls: ")) {
        handleListing(data);
    } else if (data.startsWith("cd: operation not permitted")) {
        let filesystemAccess = data.includes("filesystem");
        showError("Las políticas del servidor no permiten navegar por " +
            (filesystemAccess ? "el sistema de archivos" : "los subdirectorios"));
    } else if (data.startsWith("cd: no such file or directory: ")) {
        data = data.replace("cd: no such file or directory: ", "");
        showError("La ruta '" + data + "' no existe");
    }
}
