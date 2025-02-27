from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ Added CORS support
import tensorflow as tf
import numpy as np
import cv2
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS to fix frontend request issues

# Load model
MODEL_PATH = "models/tumor_model.h5"
try:
    model = tf.keras.models.load_model(MODEL_PATH)
except Exception as e:
    print(f"Error loading model: {e}")
    model = None  # Prevent crashing if model fails to load

# Class mapping
CLASS_NAMES = {2: "Glioma", 1: "Meningioma", 3: "Pituitary Tumor", 4: "Non-Tumor"}
CLASS_WEIGHTS = np.array([1.2, 0.8, 1.1, 1.3])  # Adjusted for bias correction

def apply_clahe(image):
    """Apply CLAHE for contrast enhancement."""
    image = cv2.normalize(image, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    return clahe.apply(image)

def preprocess_image(image):
    """Preprocess the input image to match model requirements."""
    image = image.convert("L")  # Convert to grayscale
    image = image.resize((224, 224))
    image_array = np.array(image, dtype=np.float32) / 255.0  # Normalize
    image_array = apply_clahe(image_array)  # Apply CLAHE
    image_array = np.expand_dims(image_array, axis=-1)  # Add channel back
    image_rgb = np.repeat(image_array, 3, axis=-1)  # Convert to 3-channel RGB
    image_rgb = np.expand_dims(image_rgb, axis=0)  # Add batch dimension
    return image_rgb

@app.route("/predict", methods=["POST"])
def predict_tumor():
    try:
        # ✅ Fix: Ensure correct file key ("image" instead of "file")
        if "image" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        file = request.files["image"]

        # Check if file is empty
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        # Read and preprocess the image
        image = Image.open(io.BytesIO(file.read()))
        processed_image = preprocess_image(image)

        # Ensure model is loaded
        if model is None:
            return jsonify({"error": "Model failed to load"}), 500

        # Make prediction
        prediction = model.predict(processed_image)[0] * CLASS_WEIGHTS
        class_index = np.argmax(prediction) + 1  # Adjust index
        confidence = np.max(prediction)

        return jsonify({
            "tumor_type": CLASS_NAMES[class_index],
            "confidence": f"{confidence:.2f}"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
