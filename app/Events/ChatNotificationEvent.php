<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ChatNotificationEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public User $user, public User $receveir) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('App.Models.User.' . $this->receveir->id),
        ];
    }

    public function broadcastWith(): array
    {
        // Log::info($this->user->name);
        Log::info($this->user->id);
        return [
            'message' => $this->user->name . " wants to call you",
            'url' => route('room', ['receveir' => $this->user->id])
        ];
    }

    public function broadcastAs(): string
    {
        return 'chat.notification';
    }
}
