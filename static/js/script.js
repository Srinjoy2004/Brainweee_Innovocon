document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("uploadForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission
        
        let fileInput = document.getElementById("imageInput");
        let file = fileInput.files[0];

        if (!file) {
            alert("Please select an image!");
            return;
        }

        let formData = new FormData();
        formData.append("image", file);

        fetch("http://127.0.0.1:5000/predict", { // Flask API URL
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Tumor Prediction:", data.tumor); // Log result
            document.getElementById("result").innerText = `Tumor: ${data.tumor}`; // Update UI
        })
        .catch(error => console.error("Error:", error));
    });
});
