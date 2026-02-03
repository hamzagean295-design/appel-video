import './bootstrap';

import Alpine from 'alpinejs';

window.Alpine = Alpine;

Alpine.start();

document.addEventListener('DOMContentLoaded', () => {
    // --- Page-specific script loader ---

    // Load room script if we are on the video call page
    if (document.getElementById('video-chat-container')) {
        import('./pages/room.js');
    }

    // Load user status script if the status element exists
    if (document.getElementById('status-user')) {
        import('./pages/user-status.js');
    }
});
