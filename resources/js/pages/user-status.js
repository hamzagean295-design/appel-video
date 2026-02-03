function initializeUserStatusListener() {
    const container = document.getElementById('status-user');
    if (!container) {
        return;
    }

    const channel = window.Echo.channel('test');
    channel.listen('.UserStatusUpdatedEvent', (e) => {
        console.log("User status event received: ", e);

        if (e.status == true) {
            container.innerHTML = `
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Actif
                </span>`;
        } else {
            container.innerHTML = `
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Inactif
                </span>`;
        }
    });
}

// Exécute la fonction une fois que le DOM est chargé
document.addEventListener('DOMContentLoaded', initializeUserStatusListener);
