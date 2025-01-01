<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'department',
        'position',
        'user_role'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    

    public function requests()
    {
        return $this->hasMany(Request::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function projects()
    {
        return $this->belongsToMany(Project::class, 'employee_projects')
                    ->withPivot('role', 'assigned_at')
                    ->withTimestamps();
    }
}
