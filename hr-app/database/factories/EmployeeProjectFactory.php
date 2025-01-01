<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Project;

class EmployeeProjectFactory extends Factory
{
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'project_id' => Project::factory(),
            'role' => $this->faker->randomElement(['developer', 'manager', 'tester']),
            'assigned_at' => $this->faker->dateTime(),
        ];
    }
}
