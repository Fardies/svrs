
document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // 1. GET HTML ELEMENTS
    // =====================================

    const scanPage = document.getElementById("scanPage");
    const recordsPage = document.getElementById("recordsPage");

    const goRecordsBtn = document.getElementById("goRecordsBtn");
    const backRecordsBtn = document.getElementById("backRecordsBtn");

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

    // =====================================
    // 2. CAMERA FUNCTIONS
    // =====================================

    function stopCamera() {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            cameraStream = null;
        }

        camera.srcObject = null;
        camera.hidden = true;

        scanBtn.hidden = false;
        captureBtn.hidden = true;
        stopBtn.hidden = true;
    }

    function clearPreview() {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            previewUrl = null;
        }

        preview.removeAttribute("src");
        preview.hidden = true;
    }

    // =====================================
    // 3. OPEN CAMERA
    // =====================================

    scanBtn.addEventListener("click", async () => {
        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error(
                    "Camera requires HTTPS or localhost."
                );
            }

            message.textContent = "Opening camera...";
            clearPreview();

            cameraStream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    facingMode: { ideal: "environment" }
                }
            });

            camera.srcObject = cameraStream;
            camera.hidden = false;

            await camera.play();

            scanBtn.hidden = true;
            captureBtn.hidden = false;
            stopBtn.hidden = false;

            message.textContent =
                "Camera ready. Position the IC inside the frame.";

        } catch (error) {
            stopCamera();
            message.textContent =
                "Camera error: " + error.message;

            console.error("Camera error:", error);
        }
    });

    // =====================================
    // 4. CAPTURE IMAGE
    // =====================================

    captureBtn.addEventListener("click", () => {
        if (!cameraStream || !camera.videoWidth) {
            message.textContent = "Camera is not ready.";
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

        message.textContent =
            "Image captured successfully!";
    });

    // =====================================
    // 5. CLOSE CAMERA
    // =====================================

    stopBtn.addEventListener("click", () => {
        stopCamera();
        message.textContent = "Camera closed.";
    });

    // =====================================
    // 6. UPLOAD IMAGE
    // =====================================

    uploadInput.addEventListener("change", (event) => {
        const file = event.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            message.textContent =
                "Please select a valid image.";
            return;
        }

        stopCamera();
        clearPreview();

        previewUrl = URL.createObjectURL(file);
        preview.src = previewUrl;
        preview.hidden = false;

        message.textContent =
            "Image uploaded successfully!";
    });

    // =====================================
    // 7. VISITOR RECORDS NAVIGATION
    // =====================================

    goRecordsBtn.addEventListener("click", () => {
        stopCamera();

        scanPage.hidden = true;
        recordsPage.hidden = false;
    });

    backRecordsBtn.addEventListener("click", () => {
        recordsPage.hidden = true;
        scanPage.hidden = false;
    });

    // =====================================
    // 8. CLEAN UP
    // =====================================

    window.addEventListener("pagehide", stopCamera);

    // Start on scanner page
    scanPage.hidden = false;
    recordsPage.hidden = true;

    console.log("SVRS initialized successfully.");
});
