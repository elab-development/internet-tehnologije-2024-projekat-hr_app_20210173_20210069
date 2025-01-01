<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'description', 
        'start_date', 
        'end_date', 
        'status'
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'employee_project')
                    ->withPivot('role', 'assigned_at')
                    ->withTimestamps();
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}

