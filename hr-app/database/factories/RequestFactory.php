<?php

namespace Database\Factories;

use App\Models\Request;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class RequestFactory extends Factory
{
    protected $model = Request::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'dates_from' => $this->faker->date(),
            'dates_to' => $this->faker->date(),
            'leave_type' => $this->faker->randomElement(['sick', 'vacation', 'other']),
            'status' => $this->faker->randomElement(['sent', 'accepted', 'declined']),
        ];
    }
}

