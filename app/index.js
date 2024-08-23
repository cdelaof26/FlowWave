let error_count = 0;


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
    error_count = hide ? 0 : error_count + 1;
    toggleElementVisibility("error_popup", hide);
    document.getElementById("error_count").innerText = error_count;
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

    toggleAppMode(true);
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
