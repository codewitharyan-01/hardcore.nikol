document.addEventListener('DOMContentLoaded', () => {
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatBox = document.getElementById('chat-box');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const clearChatBtn = document.getElementById('clear-chat-btn');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat-btn');
    const chatMessages = document.getElementById('chat-messages');
    const typingIndicator = document.getElementById('chat-typing-indicator');


    if (!chatToggleBtn || !chatBox) return;

    // Load history
    const loadHistory = () => {
        const history = JSON.parse(localStorage.getItem('hc_chat_history') || '[]');
        if (history.length === 0) {
            appendMessage("Hi! I'm your Hardcore Fitness AI assistant. How can I help you today?", 'ai', false);
        } else {
            history.forEach(msg => appendMessage(msg.text, msg.sender, false, true));
        }
    };

    const saveMessage = (text, sender) => {
        const history = JSON.parse(localStorage.getItem('hc_chat_history') || '[]');
        history.push({ text, sender });
        localStorage.setItem('hc_chat_history', JSON.stringify(history));
    };

    // Toggle logic
    chatToggleBtn.addEventListener('click', () => {
        chatBox.classList.remove('hidden');
        chatToggleBtn.style.transform = 'scale(0)';
        document.body.style.overflow = 'hidden';
    });

    closeChatBtn.addEventListener('click', () => {
        chatBox.classList.add('hidden');
        chatToggleBtn.style.transform = 'scale(1)';
        document.body.style.overflow = '';
    });

    clearChatBtn.addEventListener('click', () => {
        localStorage.removeItem('hc_chat_history');
        chatMessages.innerHTML = '';
        appendMessage("Hi! I'm your Hardcore Fitness AI assistant. How can I help you today?", 'ai', true);
    });

    const parseMarkdown = (text) => {
        if (typeof marked !== 'undefined') {
            return marked.parse(text);
        }
        let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/\n/g, '<br>');
        return html;
    };

    const appendMessage = (text, sender, save = true, isHtml = false) => {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender === 'ai' ? 'ai-msg' : 'user-msg');
        if (sender === 'ai' || isHtml) {
            msgDiv.innerHTML = parseMarkdown(text);
        } else {
            msgDiv.textContent = text;
        }
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        if (save) saveMessage(text, sender);
    };

    const showTyping = () => {
        typingIndicator.classList.remove('hidden');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const hideTyping = () => {
        typingIndicator.classList.add('hidden');
    };

    const fetchAIResponse = async (userText) => {
        const apiKey = typeof GEMINI_API_KEY !== 'undefined' ? GEMINI_API_KEY : '';
        if (!apiKey) {
            appendMessage("Error: API Key is missing.", 'ai');
            return;
        }

        showTyping();

        try {
            const history = JSON.parse(localStorage.getItem('hc_chat_history') || '[]');
            const contents = history.slice(-5).map(msg => ({
                role: msg.sender === 'ai' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            }));
            
            // Add current message with system instruction prepended if it's the first
            const instruction = `You are the Hardcore AI Coach, an energetic gym assistant for Hardcore Fitness in Naroda area, Ahmedabad. 
Keep answers brief, structured, and engaging. FORMAT: Use markdown tables for plans/timings and horizontal lines (---) to separate sections.
GYM INFO:
- Timings: Mon-Sat 5:30 AM - 11:00 PM, Sun 6:00 AM - 11:00 AM
- Plans: 1 Month (₹4,000), 3 Months (₹6,500), 6 Months (₹7,500), 12 Months (₹12,000)
- Contact: Phone/WhatsApp +91 96872 22006.
User: `;
            contents.push({
                role: 'user',
                parts: [{ text: instruction + userText }]
            });

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents })
            });

            const data = await response.json();
            hideTyping();

            if (data && data.candidates && data.candidates.length > 0) {
                const aiText = data.candidates[0].content.parts[0].text;
                appendMessage(aiText, 'ai');
            } else {
                appendMessage("Sorry, I couldn't understand that.", 'ai');
            }
        } catch (error) {
            console.error(error);
            hideTyping();
            appendMessage("Sorry, an error occurred while connecting to the AI.", 'ai');
        }
    };

    const handleSend = (text) => {
        if (!text) return;
        appendMessage(text, 'user');
        chatInput.value = '';
        chatInput.style.height = 'auto'; // Reset height
        fetchAIResponse(text);
    };

    sendChatBtn.addEventListener('click', () => handleSend(chatInput.value.trim()));

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(chatInput.value.trim());
        }
    });

    // Auto-resize textarea
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.value === '') this.style.height = 'auto';
    });


    // Init
    loadHistory();
});
