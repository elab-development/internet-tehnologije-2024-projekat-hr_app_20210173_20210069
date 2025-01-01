<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RequestController;

Route::post('/register', [AuthController::class, 'register']); 
Route::post('/login', [AuthController::class, 'login']); 

Route::middleware('auth:sanctum')->group(function () {
    
// Radnik rute
Route::get('/requests', [RequestController::class, 'index']); 
Route::post('/requests', [RequestController::class, 'store']); 
Route::put('/requests/{request}', [RequestController::class, 'update']); 
Route::delete('/requests/{request}', [RequestController::class, 'destroy']); 

// HR rute
Route::get('/all-requests', [RequestController::class, 'allRequests']); 
Route::get('/requests/{request}', [RequestController::class, 'show']); 
Route::patch('/requests/{request}/status', [RequestController::class, 'updateStatus']); 

    Route::post('/logout', [AuthController::class, 'logout']);
});