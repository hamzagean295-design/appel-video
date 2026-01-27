import './bootstrap';

import Alpine from 'alpinejs';

window.Alpine = Alpine;

Alpine.start();

document.addEventListener('DOMContentLoaded', () => {
    const channel = window.Echo.channel('test');
    channel.listen('.UserStatusUpdatedEvent', (e) => {
        // 1. Trouver la cellule spécifique à l'utilisateur
        const container = document.getElementById('status-user');
        console.log("here's the event: ", e);

        if (container) {
            // 2. Définir le nouveau HTML selon l'état
            console.log(e)
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
        }
    });
});
