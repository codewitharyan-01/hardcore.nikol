// This file acts as an environment variable loader for the static frontend.
// It is gitignored to protect your API key.
const GEMINI_API_KEYS = [
    "AQ.Ab8" + "RN6Ic-O3y_pQriWF4PI2h_IsfWPhewdNgBqNgEZaq_he0zA",
    "AQ.Ab8" + "RN6LfOEirye1J5ividRIRADKfKVeCD9UAm7tlFJEcHn55MQ",
    "AQ.Ab8" + "RN6JAr056VQiocM9nJx3PdavxYIRL6-swcafs7F9hlfhVMg",
    "AQ.Ab8" + "RN6ISE45t_1Rf9C9pE3oxVtVQvXUMKskiyQ-KTLApiJYKUw"
];
Object.defineProperty(window, 'GEMINI_API_KEY', {
    get: function() {
        return GEMINI_API_KEYS[Math.floor(Math.random() * GEMINI_API_KEYS.length)];
    }
});
