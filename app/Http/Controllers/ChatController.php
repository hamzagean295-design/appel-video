<?php

namespace App\Http\Controllers;

use App\Events\ChatNotificationEvent;
use App\Events\WebRTCSignalEvent;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    public function notify(User $receveir)
    {
        broadcast(new ChatNotificationEvent(auth()->user(), $receveir));
        return to_route('room', $receveir);
    }
    public function room(User $receveir)
    {
        return view('room', compact('receveir'));
    }

    public function signal(Request $request)
    {
        // Récuper le signal (infos WebRTC + destinataire)
        $validated = $request->validate([
            'receiverId' => 'required|integer',
            'signal' => 'required'
        ]);
        $data = $validated['signal']; // contient le type et signal
        $receiverId = $validated['receiverId'];

        // difusse le signal au destinataire via websocket.
        broadcast(new WebRTCSignalEvent($data, $receiverId));

        return response()->json([
            'status' => 'Signal transmis'
        ]);
    }
}
