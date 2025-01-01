<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::factory()->create(['name' => 'Miljana Srcic', 'department' => 'HR', 'position' => 'HR Associate', 'user_role' => 'hr worker']);
        User::factory()->create(['name' => 'Sebastijan Hadziprodic', 'department' => 'IT', 'position' => 'Manager']);
        User::factory(5)->create(['department' => 'Finance', 'position' => 'Employee']);
    }
}

