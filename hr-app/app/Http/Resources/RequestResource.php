<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RequestResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'user_name' => $this->user->name,
            'dates_from' => $this->dates_from,
            'dates_to' => $this->dates_to,
            'leave_type' => $this->leave_type,
            'status' => $this->status,
        ];
    }
}
