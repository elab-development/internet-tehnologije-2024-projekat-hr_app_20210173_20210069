<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition()
    {
        $startDate = $this->faker->dateTimeBetween('2024-01-01', '2024-12-31')->format('Y-m-d'); // Datum početka u 2024.
        $endDate = $this->faker->dateTimeBetween($startDate, '2024-12-31')->format('Y-m-d'); // Datum završetka u 2024.

        return [
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->paragraph(),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => $this->faker->randomElement(['active', 'completed', 'cancelled']),
        ];
    }
}
