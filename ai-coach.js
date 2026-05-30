// ====== AI COACH WIDGET LOGIC ======

document.addEventListener('DOMContentLoaded', () => {
    const API_KEYS = [
        'AQ.Ab8RN6KpHWMpXDHcEsE2RI6wr3Y8wvKq-BaSh0OQ44Bi2FIvkw',
        'AQ.Ab8RN6KpHWMpXDHcEsE2RI6wr3Y8wvKq-BaSh0OQ44Bi2FIvkw','AQ.Ab8RN6KpHWMpXDHcEsE2RI6wr3Y8wvKq-BaSh0OQ44Bi2FIvkw',
        'AQ.Ab8RN6KpHWMpXDHcEsE2RI6wr3Y8wvKq-BaSh0OQ44Bi2FIvkw','AQ.Ab8RN6KpHWMpXDHcEsE2RI6wr3Y8wvKq-BaSh0OQ44Bi2FIvkw'
    ];
    
    const getApiUrl = () => {
        const randomKey = API_KEYS[Math.floor(Math.random() * API_KEYS.length)];
        return `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${randomKey}`;
    };

    // DOM Elements
    const toggleBtn = document.getElementById('ai-coach-toggle');
    const chatWindow = document.getElementById('ai-coach-window');
    const closeBtn = document.getElementById('ai-coach-close');
    const overlay = document.getElementById('ai-coach-overlay');
    const messagesContainer = document.getElementById('ai-coach-messages');
    const inputField = document.getElementById('ai-coach-input');
    const sendBtn = document.getElementById('ai-coach-send');
    const typingIndicator = document.getElementById('typing-indicator');

    let conversationHistory = [];

    const getSystemPrompt = () => {
        const currentDate = new Date().toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        return `You are the 'Hardcore AI Coach', an intense, highly motivating, and knowledgeable fitness expert representing 'Hardcore Fitness' gym. 
You talk with high energy, often using words like 'beast', 'grind', 'no excuses'. 
You give practical fitness and nutrition advice. 
FORMATTING RULES (CRITICAL):
1. ALWAYS use rich Markdown to make your responses look amazing and structured.
2. Use Markdown Tables for workout plans, schedules, or meal plans (e.g. | Day | Workout |).
3. Use Horizontal Rules (---) to separate sections.
4. Use Headings (###) for structure.
5. Use bullet points and bold text heavily to make it readable.
Keep responses highly practical.

CRITICAL INFORMATION: Today's exact date and time is ${currentDate}. If asked about the current date, time, or day of the week, refer to this exact timestamp.`;
    };

    const openChat = () => {
        chatWindow.classList.add('active');
        toggleBtn.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scrolling

        if (messagesContainer.querySelectorAll('.message').length === 0) {
            addMessage("What's up, warrior? Ready to crush your goals today? Ask me anything about fitness, nutrition, or our Hardcore facility.", 'ai');
        }
        setTimeout(() => inputField.focus(), 400);
    };

    const closeChat = () => {
        chatWindow.classList.remove('active');
        toggleBtn.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore background scrolling
    };

    toggleBtn.addEventListener('click', openChat);
    closeBtn.addEventListener('click', closeChat);
    overlay.addEventListener('click', closeChat);

    // Add listener for navigation links
    const navLinks = document.querySelectorAll('.open-ai-coach');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openChat();

            // If mobile menu is open, close it (assuming there's a close mobile menu function or class)
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = ''; // reset overflow from mobile menu
                setTimeout(() => openChat(), 50); // Re-apply openChat to lock scroll again for AI Coach
            }
        });
    });

    const handleSend = async () => {
        const text = inputField.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        inputField.value = '';
        inputField.disabled = true;
        sendBtn.disabled = true;

        typingIndicator.classList.add('active');
        scrollToBottom();

        let promptText = text;
        if (conversationHistory.length === 0) {
            promptText = `${getSystemPrompt()}\n\nUser: ${text}`;
        }

        conversationHistory.push({
            role: 'user',
            parts: [{ text: promptText }]
        });

        try {
            const currentApiUrl = getApiUrl();
            const response = await fetch(currentApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: conversationHistory })
            });

            if (!response.ok) throw new Error('API request failed');

            const data = await response.json();
            const aiText = data.candidates[0].content.parts[0].text;

            conversationHistory.push({
                role: 'model',
                parts: [{ text: aiText }]
            });

            typingIndicator.classList.remove('active');
            addMessage(formatText(aiText), 'ai', true);

        } catch (error) {
            console.error("Gemini API Error:", error);
            typingIndicator.classList.remove('active');
            addMessage("Network error or API issue. Keep pushing and try again later!", 'ai');
            conversationHistory.pop();
        } finally {
            inputField.disabled = false;
            sendBtn.disabled = false;
            inputField.focus();
            scrollToBottom();
        }
    };

    sendBtn.addEventListener('click', handleSend);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    function addMessage(text, sender, isHtml = false) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);

        if (isHtml) msgDiv.innerHTML = text;
        else msgDiv.textContent = text;

        messagesContainer.insertBefore(msgDiv, typingIndicator);
        scrollToBottom();
    }

    function scrollToBottom() {
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 50);
    }

    function formatText(text) {
        if (typeof marked !== 'undefined') {
            return marked.parse(text);
        }
        // Fallback if marked fails to load
        let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/\n/g, '<br>');
        return formatted;
    }
});
