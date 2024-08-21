let error_count = 0;


function getText(elementId) {
    let element = document.getElementById(elementId);
    return element.innerText.length !== 0 ? element.innerText : element.value;
}


function toggleElementVisibility(elementId, hide) {
    if (hide)
        document.getElementById(elementId).classList.add("hidden");
    else
        document.getElementById(elementId).classList.remove("hidden");
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
    toggleElementVisibility("connect_button_text", showSpinner);
    toggleElementVisibility("connect_button_spinner", !showSpinner);
}
