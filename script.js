
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

function clearPreview() {
    if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        previewUrl = null;
    }

    preview.removeAttribute("src");
    preview.hidden = true;
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }

    camera.srcObject = null;
    camera.hidden = true;
    captureBtn.hidden = true;
    stopBtn.hidden = true;
    scanBtn.hidden = false;
}

// Step 2: Open camera
scanBtn.addEventListener("click", async () => {
    try {
        if (!navigator.mediaDevices?.getUserMedia) {
            throw new Error(
                "Camera access is unavailable. Use HTTPS or localhost."
            );
        }

        clearPreview();
        message.textContent = "Opening camera...";

        cameraStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                facingMode: { ideal: "environment" }
            }
        });

        camera.srcObject = cameraStream;
        await camera.play();

        camera.hidden = false;
        scanBtn.hidden = true;
        captureBtn.hidden = false;
        stopBtn.hidden = false;

        message.textContent = "Position the IC inside the camera.";
    } catch (error) {
        stopCamera();
        message.textContent =
            "Could not open camera: " + error.message;
    }
});

// Step 3: Capture image
captureBtn.addEventListener("click", () => {
    if (!cameraStream || !camera.videoWidth) {
        message.textContent = "Camera is not ready yet.";
        return;
    }

    canvas.width = camera.videoWidth;
    canvas.height = camera.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(camera, 0, 0);

    clearPreview();
    preview.src = canvas.toDataURL("image/jpeg", 0.9);
    preview.hidden = false;

    stopCamera();

    message.textContent = "Image captured successfully!";
});

// Close camera
stopBtn.addEventListener("click", () => {
    stopCamera();
    message.textContent = "Camera closed.";
});

// Step 4: Upload an image instead
uploadInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        message.textContent = "Please choose an image file.";
        return;
    }

    stopCamera();
    clearPreview();

    previewUrl = URL.createObjectURL(file);
    preview.src = previewUrl;
    preview.hidden = false;

    message.textContent = "Image uploaded successfully!";
});

// Release camera when leaving the page
window.addEventListener("pagehide", stopCamera);
