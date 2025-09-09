<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Attendance;
use App\Models\User;
use App\Models\Project;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::all()->each(function ($user) {
            $projects = Project::inRandomOrder()->take(2)->pluck('id');
            foreach ($projects as $projectId) {
                Attendance::factory(3)->create([
                    'user_id' => $user->id,
                    'project_id' => $projectId,
                ]);
            }
        });
    }
}
