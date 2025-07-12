import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

app = Flask(__name__)
CORS(app)  # Allow requests from any origin (for development)

@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    try:
        data = request.get_json()
        question = data.get("question", "").strip()
        if not question:
            return jsonify({"error": "No question provided!"}), 400

        if not API_KEY:
            return jsonify({"error": "GEMINI_API_KEY not set in environment."}), 500

        prompt = f"""
        You are a financial literacy AI chatbot for students and young professionals in India.
        Answer finance-related questions in simple, friendly language.
        Include tips on budgeting, saving, loans, credit scores, and avoiding scams. For complex queries, give practical examples and mention government resources if relevant. Never give explicit investment advice.

        Q: {question}
        """

        genai.configure(api_key=API_KEY)
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        return jsonify({"answer": response.text})
    except Exception as e:
        print("Error in /api/chatbot:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)