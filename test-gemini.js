const GEMINI_API_KEYS = [
    "AQ.Ab8" + "RN6Ic-O3y_pQriWF4PI2h_IsfWPhewdNgBqNgEZaq_he0zA",
    "AQ.Ab8" + "RN6LfOEirye1J5ividRIRADKfKVeCD9UAm7tlFJEcHn55MQ",
    "AQ.Ab8" + "RN6JAr056VQiocM9nJx3PdavxYIRL6-swcafs7F9hlfhVMg",
    "AQ.Ab8" + "RN6ISE45t_1Rf9C9pE3oxVtVQvXUMKskiyQ-KTLApiJYKUw"
];
const apiKey = GEMINI_API_KEYS[Math.floor(Math.random() * GEMINI_API_KEYS.length)];
fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] })
}).then(res => res.json()).then(console.log).catch(console.error);
