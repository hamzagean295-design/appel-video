<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js', 'resources/js/pages/user-status.js', 'resources/js/pages/room.js'])
</head>

<body class="font-sans antialiased relative">
    <div id="notification-container"
        class="absolute right-2 top-16 border rounded bg-blue-400 p-1 animate-slide-down shadow-md hidden"> </div>
    <div class="min-h-screen bg-gray-100">
        @include('layouts.navigation')

        <!-- Page Heading -->
        @isset($header)
            <header class="bg-white shadow">
                <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    {{ $header }}
                </div>
            </header>
        @endisset

        <!-- Page Content -->
        <main>
            {{ $slot }}
        </main>
    </div>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const notificationContainer = document.getElementById('notification-container');
            const userId = '{{ auth()->user()->id }}';
            const privateChannel = window.Echo.private(`App.Models.User.${userId}`);
            // console.log(privateChannel);
            privateChannel.listen('.chat.notification', (e) => {
                // Play a notification sound (Creative Commons 0 from freesound.org)
                const audio = new Audio("{{ asset('notif.mp3') }}");
                audio.play();

                const message = e.message;
                const roomUrl = e.url;
                notificationContainer.classList.remove('hidden');
                notificationContainer.innerHTML = `
                        <div class="w-full flex justify-between items-center">
                            <p class="flex-1 font-normal italic">${message}</p>
                            <button type="button" id="close-button" class="w-8 text-center text-red-800 font-bold">X</button>
                        </div>
                        <a href="${roomUrl}" id="rejoindre-btn" class="bg-red-600 p-1 border z-10  rounded-sm">Rejoindre</a>
                    `
                const closeButton = document.getElementById('close-button');
                closeButton.onclick = function() {
                    notificationContainer.classList.add('animate-disappear');
                }

            });
        });
    </script>
</body>

</html>
