from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from config import GEMINI_API_KEY


app = Flask(__name__)
app.config.from_pyfile('config.py')

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

@app.route('/')
def index():
    """Render the chat interface"""
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    """Handle chat messages"""
    try:
        user_message = request.json.get('message')
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Get response from Gemini
        response = model.generate_content(user_message)
        
        return jsonify({
            'response': response.text
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)