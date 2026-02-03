<x-app-layout>
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="flex flex-col sm:flex-row justify-center sm:align-items-center gap-2 p-2 z-10">
                <video width="500" height="500" controls id="source"></video>
                <div class="flex flex-col">
                    <video width="500" height="500" controls id="destinaire"></video>
                    <span class="align-center">{{ $receveir->status ? 'actif' : 'non actif' }}</span>
                </div>
            </div>
            <script>
                document.addEventListener('DOMContentLoaded', async function() {

                    // 1. Define what media you need
                    const constraints = {
                        audio: true, // Request microphone access
                        video: true  // Request camera access
                    };

                    async function startMedia() {
                        try {
                            // 2. This call triggers the browser's permission prompt
                            const stream = await navigator.mediaDevices.getUserMedia(constraints);

                            // 3. Success: Pass the stream to your RTCPeerConnection
                            const peerConnection = new RTCPeerConnection();
                            stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

                            console.log("Permissions granted and tracks added.");
                        } catch (error) {
                            // 4. Handle denial or missing hardware
                            if (error.name === 'NotAllowedError') {
                                console.error("User denied camera/mic permissions.");
                            } else if (error.name === 'NotFoundError') {
                                console.error("No camera or microphone found.");
                            }
                        }
                    }

                    startMedia();
                });
            </script>
        </div>
    </div>
</x-app-layout>

