<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string',
            'department' => 'nullable|string',
            'position' => 'nullable|string',
            'user_role' => 'nullable|in:worker,hr worker',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'department' => $validated['department'] ?? 'General',
            'position' => $validated['position'] ?? 'Employee',
            'user_role' => $validated['user_role'] ?? 'worker',
        ]);

        return response()->json([
            'message' => 'Registracija uspešna! Dobrodošli u aplikaciju! 🎉',
            'id' => $user->id,
            'role' => $user->user_role,
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt(['email' => $validated['email'], 'password' => $validated['password']])) {
            return response()->json(['error' => 'Neispravni podaci za prijavu! ⚠️'], 401);
        }

        $user = Auth::user();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Welcome!',
            'id' => $user->id,
            'email' => $user->email,
            'role' => $user->user_role,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $user->tokens()->delete();

        return response()->json(['message' => "Korisnik $user->name se uspešno odjavio iz aplikacije! 👋"]);
    }
}
