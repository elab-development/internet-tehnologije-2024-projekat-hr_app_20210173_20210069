<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;
use App\Http\Resources\UserResource;

class UserController extends Controller
{
    public function index()
    {
        // exclude HR users if you like, or filter on the front–end
        $users = User::all();
        return UserResource::collection($users);
    }
}
