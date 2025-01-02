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
<<<<<<< HEAD
            'assigned_at' => $this->faker->dateTimeBetween('2024-01-01', '2024-12-31')->format('Y-m-d'),
=======
            'assigned_at' => $this->faker->dateTimeBetween('2024-01-01', '2024-12-31')->format('Y-m-d'), // Datum u 2024. godini
>>>>>>> 5d2dbb56bf071db75e020f743c883a0bcf68b230
        ];
    }
}
