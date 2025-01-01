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
        $datesFrom = $this->faker->dateTimeBetween('2025-01-01', '2030-12-31')->format('Y-m-d');
        $datesTo = $this->faker->dateTimeBetween($datesFrom, '2035-12-31')->format('Y-m-d');

        return [
            'user_id' => User::factory(),
            'dates_from' => $datesFrom, 
            'dates_to' => $datesTo,     
            'leave_type' => $this->faker->randomElement(['sick', 'vacation', 'other']),
            'status' => $this->faker->randomElement(['sent', 'accepted', 'declined']),
        ];
    }
}


