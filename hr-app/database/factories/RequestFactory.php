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
        $datesFrom = $this->faker->dateTimeBetween('2024-01-01', '2024-12-31')->format('Y-m-d');
        $datesTo = $this->faker->dateTimeBetween($datesFrom, (new \DateTime($datesFrom))->modify('+35 days')->format('Y-m-d'))->format('Y-m-d');

        return [
            'user_id' => User::factory(),
            'dates_from' => $datesFrom, 
            'dates_to' => $datesTo,     
            'leave_type' => $this->faker->randomElement(['sick', 'vacation', 'other']),
            'status' => $this->faker->randomElement(['sent', 'accepted', 'declined']),
        ];
    }
}
