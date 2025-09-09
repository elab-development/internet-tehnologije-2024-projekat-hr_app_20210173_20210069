<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Project;

class EmployeeProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::all()->each(function ($user) {
            $projects = Project::inRandomOrder()->take(2)->pluck('id');
            foreach ($projects as $projectId) {
                $user->projects()->attach($projectId, [
                    'role' => fake()->randomElement(['developer', 'manager', 'tester']),
                    'assigned_at' => fake()->dateTimeBetween('2024-01-01', '2024-12-31')->format('Y-m-d'),
                ]);
            }
        });
    }
}
