from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # Mengizinkan akses dari React

# Load model CNN
model = tf.keras.models.load_model('cnn_model_mangga.h5')

# Ubah sesuai kebutuhan model (ukuran input dan preprocessing)
def prepare_image(img_bytes):
    image = Image.open(io.BytesIO(img_bytes)).convert('RGB')
    image = image.resize((224, 224))  # Sesuaikan dengan input model
    image = np.array(image) / 255.0
    return np.expand_dims(image, axis=0)

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    img_file = request.files['image'].read()
    image = prepare_image(img_file)

    prediction = model.predict(image)[0]

    # Contoh label: Sesuaikan dengan label dari model kamu
    labels = ['Busuk', 'Masak', 'Muda']  # Ganti dengan label asli
    label_index = int(np.argmax(prediction))
    confidence = float(np.max(prediction))

    return jsonify({
        'label': labels[label_index],
        'confidence': round(confidence * 100, 2)
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
