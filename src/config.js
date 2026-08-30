// React Native has no import.meta.env / .env file support out of the box like Vite.
// Simplest approach: set this constant directly. For multiple environments,
// switch to `expo-constants` + an `extra` block in app.json later.
//
// IMPORTANT: "localhost" means the PHONE, not your dev machine. If you're
// testing on a physical device or emulator, use your computer's LAN IP
// (e.g. http://192.168.1.23:8000) or a deployed HTTPS URL.
export const API_BASE_URL = 'http://10.12.169.190:8000';
