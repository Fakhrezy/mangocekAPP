import sys
import tensorflow as tf
import numpy as np
from PIL import Image
import io

model = tf.keras.models.load_model('cnn_model_mangga.h5')

def prepare_image(image_path):
    image = Image.open(image_path).convert('RGB')
    image = image.resize((224, 224))
    image = np.array(image) / 255.0
    return np.expand_dims(image, axis=0)

if __name__ == "__main__":
    img_path = sys.argv[1]
    image = prepare_image(img_path)
    prediction = model.predict(image)[0]
    labels = ['Busuk', 'Masak', 'Muda']
    label_index = int(np.argmax(prediction))
    confidence = float(np.max(prediction))
    print(f"{labels[label_index]},{confidence:.4f}")
