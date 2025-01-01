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
        return [
            'user_id' => User::factory(),
            'project_id' => Project::factory(),
            'date' => $this->faker->date(),
            'status' => $this->faker->randomElement(['present', 'absent', 'on_leave']),
            'hours_worked' => $this->faker->optional()->randomFloat(2, 0, 8),
            'leave_type' => $this->faker->optional()->randomElement(['sick', 'vacation', 'other']),
            'remarks' =>$this->faker->sentence()
        ];
    }
}
