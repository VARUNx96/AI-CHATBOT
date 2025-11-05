import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

# Initialize the Flask application
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS) to allow
# requests from a web browser frontend
CORS(app)

# Define the URL for your local Ollama server
# This is the default address and port for Ollama.
OLLAMA_API_URL = "http://localhost:11434/api/chat"

# Define the model you want to use
MODEL_NAME = "phi3:mini"

@app.route('/api/chat', methods=['POST'])
def chat_with_llm():
    """
    Handles POST requests to /api/chat.
    Expects a JSON body with a "prompt" key.
    Forwards the prompt to the local Ollama server and returns the response.
    """
    try:
        # 1. Get the prompt from the incoming request's JSON body
        data = request.get_json()
        user_prompt = data.get('prompt')

        if not user_prompt:
            return jsonify({"error": "Missing 'prompt' in request body"}), 400

        # 2. Construct the payload for the Ollama API
        # We use the /api/chat endpoint which expects a list of messages.
        ollama_payload = {
            "model": MODEL_NAME,
            "messages": [
                {
                    "role": "user",
                    "content": user_prompt
                }
            ],
            "stream": False  # Set to False to get the full response at once
        }

        # 3. Send the request to the local Ollama server
        try:
            response = requests.post(
                OLLAMA_API_URL,
                data=json.dumps(ollama_payload),
                headers={"Content-Type": "application/json"}
            )
            
            # Raise an exception if the request failed
            response.raise_for_status()

            # 4. Extract the response content from Ollama
            # The response JSON from /api/chat contains a 'message' object
            response_data = response.json()
            llm_message = response_data.get('message', {}).get('content', '')

            # 5. Send the LLM's response back to the original client
            return jsonify({"response": llm_message})

        except requests.exceptions.ConnectionError:
            return jsonify({
                "error": f"Could not connect to Ollama server at {OLLAMA_API_URL}. Is Ollama running?"
            }), 503  # 503 Service Unavailable
        
        except requests.exceptions.RequestException as e:
            # Handle other potential errors from the Ollama request
            return jsonify({"error": f"Error from Ollama: {str(e)}"}), 500

    except Exception as e:
        # Handle any other unexpected errors
        app.logger.error(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An internal server error occurred"}), 500

if __name__ == '__main__':
    # Run the Flask app
    # host='0.0.0.0' makes it accessible on your local network,
    # not just from 'localhost'
    app.run(host='0.0.0.0', port=5001, debug=True)