<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition()
    {
        $startDate = $this->faker->dateTimeBetween('2025-01-01', '2030-12-31')->format('Y-m-d');
        $endDate = $this->faker->optional()->dateTimeBetween($startDate, '2035-12-31');
        $endDate = $endDate ? $endDate->format('Y-m-d') : null;

        return [
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->paragraph(),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => $this->faker->randomElement(['active', 'completed', 'cancelled']),
        ];
    }
}
