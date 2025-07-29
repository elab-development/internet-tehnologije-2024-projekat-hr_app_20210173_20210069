<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\EmployeeProjectController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

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

    // HR rute
    Route::post('/employee-projects/assign', [EmployeeProjectController::class, 'assignEmployeeToProject']); 
    Route::get('/employee-projects/metrics', [EmployeeProjectController::class, 'getEmployeeProjectMetrics']); 

    // Radnik rute
    Route::get('/employee-projects', [EmployeeProjectController::class, 'getEmployeeProjects']); 

    //Ruta za sve ulogovane
    Route::get('/all-employee-projects', [EmployeeProjectController::class, 'index']);

    // HR rute
    Route::get('/attendances/metrics', [AttendanceController::class, 'topEmployeesByHours']); 

    // Radnik rute
    Route::get('/my-attendance', [AttendanceController::class, 'myAttendance']);
    
    // Resursne rute za Attendance
    Route::resource('attendances', AttendanceController::class)->only(['index', 'store']);

    //Rute za sve ulogovane
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/users',    [UserController::class,  'index']);

    // za izmenu projekta
    Route::patch('/projects/{project}', [ProjectController::class, 'update']);

    //Ruta samo za HR radnika
    Route::delete('/employee-projects/{id}', [EmployeeProjectController::class, 'destroy']);

    Route::post('/logout', [AuthController::class, 'logout']);
});