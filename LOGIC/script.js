const chatHistory = document.getElementById('chat-history');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// --- API Configuration ---
// We use the ngrok URL you provided.
const API_URL = "https://roseanne-figgy-interrelatedly.ngrok-free.dev/api/chat";

// --- Event Listeners ---
// Ensure the form element exists before adding an event listener
if (messageForm) {
    messageForm.addEventListener('submit', handleFormSubmit);
} else {
    console.error("Error: Message form not found.");
}

/**
 * Handles the form submission event.
 */
async function handleFormSubmit(e) {
    e.preventDefault(); // Prevent default form submission
    
    if (!messageInput) {
        console.error("Error: Message input not found.");
        return;
    }

    const prompt = messageInput.value.trim();
    if (!prompt) return; // Don't send empty messages

    // 1. Add user's message to the chat history
    addMessageToHistory('user', prompt);

    // 2. Clear the input field
    messageInput.value = '';

    // 3. Add a loading indicator
    const loadingBubble = addMessageToHistory('bot', '', true);

    try {
        // 4. Send the prompt to the backend
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const data = await response.json();
        
        // 5. Remove loading indicator and show bot's response
        updateLoadingBubble(loadingBubble, data.response);

    } catch (error) {
        console.error("Error fetching bot response:", error);
        // 5b. Show an error message if the request fails
        const errorMsg = "Sorry, I couldn't connect to the server. Please check if your backend and ngrok are running.";
        updateLoadingBubble(loadingBubble, errorMsg, true);
    }
}

/**
 * Adds a message to the chat history DOM.
 * @param {string} role - 'user' or 'bot'
 ** @param {string} text - The message content
 * @param {boolean} isLoading - If true, shows a loading indicator
 * @returns {HTMLElement | null} The created message bubble element or null if chat history isn't found
 */
function addMessageToHistory(role, text, isLoading = false) {
    if (!chatHistory) {
        console.error("Error: Chat history element not found.");
        return null;
    }

    const wrapper = document.createElement('div');
    wrapper.classList.add('flex');
    
    const bubble = document.createElement('div');
    bubble.classList.add('p-3', 'max-w-xs', 'md:max-w-md', 'break-words');

    if (role === 'user') {
        wrapper.classList.add('justify-end');
        bubble.classList.add('bg-blue-600', 'text-white', 'rounded-l-lg', 'rounded-br-lg');
        bubble.textContent = text;
    } else {
        wrapper.classList.add('justify-Dstart');
        bubble.classList.add('bg-gray-100', 'text-gray-800', 'rounded-r-lg', 'rounded-bl-lg');
        
        if (isLoading) {
            bubble.innerHTML = `
                <div class="flex space-x-1">
                    <div class="loading-dot w-2 h-2 bg-gray-500 rounded-full"></div>
                    <div class="loading-dot w-2 h-2 bg-gray-500 rounded-full"></div>
                    <div class="loading-dot w-2 h-2 bg-gray-500 rounded-full"></div>
                </div>
            `;
        } else {
            bubble.textContent = text;
        }
    }

    wrapper.appendChild(bubble);
    chatHistory.appendChild(wrapper);

    // Scroll to the bottom
    scrollToBottom();
    
    return bubble;
}

/**
 * Updates a loading bubble with the final text or an error.
 * @param {HTMLElement} bubble - The loading bubble element
 * @param {string} text - The final text to display
 * @param {boolean} isError - If true, styles as an error
 */
function updateLoadingBubble(bubble, text, isError = false) {
    if (!bubble) return; // Don't try to update a non-existent bubble
    
    bubble.innerHTML = ''; // Clear loading dots
    bubble.textContent = text;
    
    if (isError) {
        bubble.classList.remove('bg-gray-100', 'text-gray-800');
        bubble.classList.add('bg-red-100', 'text-red-700', 'border', 'border-red-300');
    }
}

/**
 * Scrolls the chat history to the most recent message.
 */
function scrollToBottom() {
    if (chatHistory) {
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
}
