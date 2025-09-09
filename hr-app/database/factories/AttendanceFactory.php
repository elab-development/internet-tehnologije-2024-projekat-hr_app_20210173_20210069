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
            'date' => $this->faker->dateTimeBetween('2024-01-01', '2024-12-31')->format('Y-m-d'), // Datum u okviru 2024.
            'status' => $status,
            'hours_worked' => $status === 'present' 
                ? $this->faker->numberBetween(1, 8) 
                : 0, 
            'leave_type' => $status !== 'present' 
                ? $this->faker->randomElement(['sick', 'vacation', 'other']) 
                : null, 
            'remarks' => $this->faker->sentence(),
        ];
    }
}
