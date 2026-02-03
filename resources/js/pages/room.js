document.addEventListener('DOMContentLoaded', async function() {
    const videoContainer = document.getElementById('video-chat-container');
    if (!videoContainer) return;

    // --- Elements ---
    const localVideo = document.getElementById('localVideo');
    const remoteVideo = document.getElementById('remoteVideo');
    const startCallBtn = document.getElementById('startCallBtn');
    const endCallBtn = document.getElementById('endCallBtn');

    // --- Data from Blade ---
    // 🆕 Convertir en string pour éviter les problèmes de comparaison
    const receiverId = String(videoContainer.dataset.receiverId);
    const senderId = String(videoContainer.dataset.senderId);

    console.log('🔧 Configuration:', { senderId, receiverId });

    // --- WebRTC State ---
    let peerConnection;
    let localStream;
    let pendingCandidates = [];
    let isInitiator = false;

    // --- UI Logic ---
    startCallBtn.addEventListener('click', startCall);
    endCallBtn.addEventListener('click', endCall);

    function showEndButton() {
        startCallBtn.classList.add('hidden');
        endCallBtn.classList.remove('hidden');
    }

    function showStartButton() {
        endCallBtn.classList.add('hidden');
        startCallBtn.classList.remove('hidden');
    }

    // Helper functions Base64
    function encodeSDP(sessionDescription) {
        return {
            type: sessionDescription.type,
            sdp: btoa(unescape(encodeURIComponent(sessionDescription.sdp)))
        };
    }

    function decodeSDP(encoded) {
        return {
            type: encoded.type,
            sdp: decodeURIComponent(escape(atob(encoded.sdp)))
        };
    }

    // 1. Get local media
    try {
        localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        localVideo.srcObject = localStream;
        console.log('✅ Média local initialisé');
    } catch (error) {
        console.error("Erreur d'accès média : ", error);
        alert("Impossible d'accéder à la caméra ou au microphone.");
        return;
    }

    // --- WebRTC Core Logic ---
    function initializePeerConnection() {
        const config = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        };

        peerConnection = new RTCPeerConnection(config);

        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });

        peerConnection.ontrack = event => {
            console.log('🎥 Stream distant reçu');
            if (remoteVideo.srcObject !== event.streams[0]) {
                remoteVideo.srcObject = event.streams[0];
            }
        };

        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                console.log('📤 Envoi ICE candidate');
                sendSignal({
                    type: 'ice-candidate',
                    candidate: {
                        candidate: event.candidate.candidate,
                        sdpMLineIndex: event.candidate.sdpMLineIndex,
                        sdpMid: event.candidate.sdpMid
                    }
                });
            } else {
                console.log('✅ Tous les ICE candidates envoyés');
            }
        };

        peerConnection.oniceconnectionstatechange = () => {
            console.log('🔌 ICE Connection State:', peerConnection.iceConnectionState);
        };

        peerConnection.onconnectionstatechange = () => {
            console.log('🔗 Connection State:', peerConnection.connectionState);
            if (peerConnection.connectionState === 'connected') {
                console.log('✅✅✅ Connexion WebRTC établie !');
            }
        };

        peerConnection.onsignalingstatechange = () => {
            console.log('📡 Signaling State:', peerConnection.signalingState);
        };
    }

    // --- Echo Listener ---
    window.Echo.private(`App.Models.User.${senderId}`)
        .listen('.webrtc.signal', async (signal) => {
            // 🆕 Convertir en string pour comparaison
            const signalSenderId = String(signal.senderId);

            console.log('📥 Signal brut reçu:', {
                type: signal.type,
                senderId: signalSenderId,
                expectedSenderId: receiverId,
                match: signalSenderId === receiverId
            });

            // 🆕 Vérifier que le signal vient bien de l'autre utilisateur
            if (signalSenderId !== receiverId) {
                console.log('❌ Signal ignoré (expéditeur:', signalSenderId, '/ attendu:', receiverId, ')');
                return;
            }

            console.log('✅ Signal accepté:', signal.type, '| isInitiator:', isInitiator);

            try {
                if (signal.type === 'offer') {
                    // Ne traiter l'offer que si on n'est PAS l'initiateur
                    if (isInitiator) {
                        console.log('⚠️ Offer ignoré (je suis l\'initiateur)');
                        return;
                    }

                    if (!peerConnection) {
                        console.log('🔧 Initialisation de la peer connection (receveur)');
                        initializePeerConnection();
                    }

                    const offer = decodeSDP(signal.offer);
                    console.log('📄 Offer décodé:', offer.type);

                    await peerConnection.setRemoteDescription(
                        new RTCSessionDescription(offer)
                    );

                    console.log('✅ Remote description (offer) définie');
                    await processPendingCandidates();

                    const answer = await peerConnection.createAnswer();
                    await peerConnection.setLocalDescription(answer);

                    console.log('📤 Envoi de la réponse (answer)');
                    sendSignal({
                        type: 'answer',
                        answer: encodeSDP(answer)
                    });

                    showEndButton();

                } else if (signal.type === 'answer') {
                    // Ne traiter l'answer que si on EST l'initiateur
                    if (!isInitiator) {
                        console.log('⚠️ Answer ignoré (je ne suis pas l\'initiateur)');
                        return;
                    }

                    // Vérifier l'état de signalisation
                    if (peerConnection.signalingState !== 'have-local-offer') {
                        console.log('⚠️ Answer ignoré (état incorrect):', peerConnection.signalingState);
                        return;
                    }

                    const answer = decodeSDP(signal.answer);
                    console.log('📄 Answer décodé:', answer.type);

                    await peerConnection.setRemoteDescription(
                        new RTCSessionDescription(answer)
                    );

                    console.log('✅ Remote description (answer) définie');
                    await processPendingCandidates();

                } else if (signal.type === 'ice-candidate') {
                    if (peerConnection && peerConnection.remoteDescription) {
                        await peerConnection.addIceCandidate(
                            new RTCIceCandidate(signal.candidate)
                        );
                        console.log('✅ ICE candidate ajouté directement');
                    } else {
                        pendingCandidates.push(signal.candidate);
                        console.log('⏳ ICE candidate mis en attente (total:', pendingCandidates.length, ')');
                    }
                }
            } catch (error) {
                console.error('❌ Erreur traitement signal:', error);
                console.error('Signal problématique:', signal);
                console.error('État de signalisation:', peerConnection?.signalingState);
            }
        });

    async function processPendingCandidates() {
        if (pendingCandidates.length > 0 && peerConnection && peerConnection.remoteDescription) {
            console.log(`🔄 Traitement de ${pendingCandidates.length} ICE candidates en attente`);

            for (const candidate of pendingCandidates) {
                try {
                    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                    console.log('✅ ICE candidate en attente ajouté');
                } catch (error) {
                    console.error('❌ Erreur ajout ICE candidate:', error);
                }
            }

            pendingCandidates = [];
        }
    }

    async function sendSignal(data) {
        try {
            const response = await fetch('/room/signal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    receiverId: receiverId,
                    signal: { ...data, senderId: senderId }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('📤 Signal envoyé avec succès:', data.type);
        } catch (error) {
            console.error('❌ Erreur envoi signal:', error);
        }
    }

    async function startCall() {
        if (peerConnection) {
            console.log('⚠️ Appel déjà en cours');
            return;
        }

        console.log('🚀 Démarrage de l\'appel (initiateur)...');
        isInitiator = true;
        initializePeerConnection();

        const offer = await peerConnection.createOffer({
            offerToReceiveVideo: true,
            offerToReceiveAudio: true
        });

        await peerConnection.setLocalDescription(offer);
        console.log('✅ Local description (offer) définie');

        sendSignal({
            type: 'offer',
            offer: encodeSDP(offer)
        });

        showEndButton();
    }

    function endCall() {
        console.log('🛑 Fin de l\'appel');

        if (peerConnection) {
            peerConnection.close();
            peerConnection = null;
        }

        isInitiator = false;
        pendingCandidates = [];

        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }

        localVideo.srcObject = null;
        remoteVideo.srcObject = null;
        showStartButton();
    }
});
