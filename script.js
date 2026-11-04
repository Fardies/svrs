
 // ================================
 // SVRS - Navigation
 // ================================

const scanPage = document.getElementById("scanPage");
const recordsPage = document.getElementById("recordsPage");

const goRecordsBtn = document.getElementById("goRecordsBtn");
const backRecordsBtn = document.getElementById("backRecordsBtn");

// Camera elements
const camera = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const preview = document.getElementById("preview");

const scanBtn = document.getElementById("scanBtn");
const captureBtn = document.getElementById("captureBtn");
const stopBtn = document.getElementById("stopBtn");
const uploadInput = document.getElementById("uploadInput");
const message = document.getElementById("message");

let cameraStream = null;
let previewUrl = null;

// Show visitor records
goRecordsBtn.addEventListener("click", () => {
    stopCamera();
    scanPage.hidden = true;
    recordsPage.hidden = false;
});

// Return to scanner
backRecordsBtn.addEventListener("click", () => {
    recordsPage.hidden = true;
    scanPage.hidden = false;
});
