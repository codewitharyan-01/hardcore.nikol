const apiKey = "AQ.Ab8" + "RN6ISE45t_1Rf9C9pE3oxVtVQvXUMKskiyQ-KTLApiJYKUw";
fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] })
}).then(res => res.json()).then(console.log).catch(console.error);
