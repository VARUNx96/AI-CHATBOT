# Local LLM Chatbot API

This project is a simple yet powerful backend server built with **Python** and **Flask**. It acts as an API bridge to connect any frontend application to a locally running Large Language Model (LLM), such as **Gemma** or **Phi-3**.

It's designed to be lightweight, easy to set up, and simple to expose publicly using **ngrok** for testing and integration.

## 🚀 Features

* **Simple API Endpoint:** A single `/chat` endpoint to send prompts and receive responses.
* **Local LLM Integration:** Connects to your own LLM running on your machine (e.g., via Ollama, llama.cpp, etc.).
* **Flask Powered:** Uses the lightweight Flask web framework for a minimal footprint.
* **CORS Enabled:** Includes `flask-cors` for easy integration with web-based frontends.
* **Easy to Test:** Can be easily tested with tools like `curl`, Postman, or by using `ngrok` to create a public URL.

## 🛠️ Tech Stack

* **Backend:** Python 3
* **Framework:** Flask
* **API:** REST
* **Local LLM:** (User's choice, e.g., Gemma, Phi-3, Llama 3)
* **Tunnelling (Optional):** ngrok

## ⚙️ Setup and Installation

Follow these steps to get the server running on your local machine.

### 1. Prerequisites

* **Python 3.10+**
* **A locally running LLM:** This server *connects* to an LLM, it doesn't *run* it. Make sure you have an LLM running (e.g., using [Ollama](https://ollama.com/)) and that it's accessible (e.g., at `http://localhost:11434`).
* **ngrok (Optional):** If you want to expose your API publicly. [Install ngrok here](https://ngrok.com/download).

### 2. Clone the Repository

```bash
git clone [https://github.com/YOUR_USERNAME/YOUR_PROJECT_NAME.git](https://github.com/YOUR_USERNAME/YOUR_PROJECT_NAME.git)
cd YOUR_PROJECT_NAME
```

### 3. Create a Virtual Environment

It's highly recommended to use a virtual environment.

```bash
# For macOS/Linux
python3 -m venv venv
source venv/bin/activate

# For Windows
python -m venv venv
.\venv\Scripts\activate
```

### 4. Install Dependencies

This project requires a few Python libraries. A sample `requirements.txt` is provided.

```bash
pip install -r requirements.txt
```

## 🏃‍♂️ How to Run

### 1. Run the Flask Server

Once your dependencies are installed, start the Flask application:

```bash
python app.py
```

Your server should now be running on `http://localhost:5000`.

### 2. (Optional) Expose with ngrok

If you want a public URL to test with a different device or service, open a **new terminal window** and use `ngrok` to expose your local port 5000.

```bash
ngrok http 5000
```

ngrok will give you a public `https*.ngrok.io` URL. Use this as your new base URL.

## 🧪 Usage & API

You can send prompts to your chatbot by making a `POST` request to the `/chat` endpoint.

### API Endpoint

* **URL:** `/chat`
* **Method:** `POST`
* **Body (JSON):**

    ```json
    {
      "message": "Your prompt to the AI goes here"
    }
    ```

### Example using `curl`

Here is a simple test you can run from your terminal:

```bash
curl -X POST http://localhost:5000/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello! What is Python?"}'
```

### Example Response

The server will respond with the LLM's answer in a JSON format:

```json
{
  "response": "Python is a high-level, interpreted programming language known for its clear syntax and readability..."
}
```
