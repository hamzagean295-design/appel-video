<x-app-layout>
    <div class="py-4 sm:py-12">
        <div id="video-chat-container" 
             data-receiver-id="{{ $receveir->id }}" 
             data-sender-id="{{ auth()->id() }}"
             class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            
            <!-- Main container for the video call -->
            <div class="bg-gray-900 rounded-lg shadow-lg overflow-hidden relative">

                <!-- Remote Video (main screen) -->
                <video id="remoteVideo" autoplay playsinline class="w-full h-full object-cover" style="height: 75vh;"></video>

                <!-- Local Video (picture-in-picture) -->
                <div class="absolute bottom-4 right-4 w-1/4 max-w-xs rounded-lg overflow-hidden shadow-xl border-2 border-gray-700">
                    <video id="localVideo" autoplay playsinline muted class="w-full h-full object-cover"></video>
                </div>

                <!-- Call Controls -->
                <div class="absolute bottom-0 left-0 w-full p-4 flex justify-center items-center bg-black bg-opacity-50">
                    <!-- Start Call Button -->
                    <button id="startCallBtn" class="p-4 bg-green-500 rounded-full text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </button>

                    <!-- End Call Button (initially hidden) -->
                    <button id="endCallBtn" class="hidden p-4 bg-red-500 rounded-full text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8l2-2m0 0l2 2m-2-2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h12z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div class="text-center mt-2 text-sm text-gray-500">
                Statut de {{ $receveir->name }}: <span class="font-bold {{ $receveir->status ? 'text-green-500' : 'text-red-500' }}">{{ $receveir->status ? 'Actif' : 'Inactif' }}</span>
            </div>
        </div>
    </div>
</x-app-layout>
