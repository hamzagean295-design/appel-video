function initializeUserStatusListener() {
    const channel = window.Echo.channel('test');
    channel.listen('UserStatusUpdatedEvent', (e) => {
        console.log("User status event received: ", e);

        const container = document.getElementById('status-user-' + e.user_id);

        if (!container) {
            return;
        }

        if (e.is_active) {
            container.innerHTML = `
                <span class="status-badge px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Actif
                </span>`;
        } else {
            container.innerHTML = `
                <span class="status-badge px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Inactif
                </span>`;
        }
    });
}

// Exécute la fonction une fois que le DOM est chargé
document.addEventListener('DOMContentLoaded', initializeUserStatusListener);