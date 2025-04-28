<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'project' => [
                'id' => $this->project->id,
                'name' => $this->project->name,
            ],
            'date' => $this->date,
            'status' => $this->status,
            'hours_worked' => $this->hours_worked,
            'leave_type' => $this->leave_type,
            'remarks' => $this->remarks,
        ];
    }
}
