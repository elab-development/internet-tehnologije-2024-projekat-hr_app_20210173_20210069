<?php

namespace Database\Factories;

use App\Models\Attendance;
use App\Models\User;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class AttendanceFactory extends Factory
{
    protected $model = Attendance::class;

    public function definition()
    {
        $status = $this->faker->randomElement(['present', 'absent', 'on_leave']);
        
        return [
            'user_id' => User::factory(),
            'project_id' => Project::factory(),
            'date' => $this->faker->dateTimeBetween('2025-01-01', '2030-12-31')->format('Y-m-d'), 
            'status' => $status,
            'hours_worked' => $this->faker->optional()->numberBetween(1, 8),
            'leave_type' => $status === 'present' ? null : $this->faker->randomElement(['sick', 'vacation', 'other']),
            'remarks' => $this->faker->sentence(),
        ];
    }
}


