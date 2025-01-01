<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AttendanceController extends Controller
{
    // HR radnik vidi ceo attendance sheet sa filtriranjem po zaposlenom i paginacijom
    public function index(Request $request)
    {
        if (Auth::user()->user_role !== 'hr worker') {
            return response()->json(['error' => 'Samo HR može videti ceo attendance sheet!'], 403);
        }

        $query = Attendance::query();

        if ($request->filled('user_name')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->input('user_name') . '%');
            });
        }

        $attendances = $query->with('user', 'project')->paginate(10);

        return response()->json($attendances);
    }

    // Radnik vidi svoj ceo attendance sheet
    public function myAttendance()
    {
        if (Auth::user()->user_role !== 'worker') {
            return response()->json(['error' => 'Samo radnici mogu videti svoj attendance sheet!'], 403);
        }

        $attendances = Attendance::where('user_id', Auth::id())
            ->with('project')
            ->get();

        return response()->json($attendances);
    }

    // Radnik kreira novi attendance
    public function store(Request $request)
    {
        if (Auth::user()->user_role !== 'worker') {
            return response()->json(['error' => 'Samo radnici mogu kreirati novi attendance!'], 403);
        }

        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'status' => 'required|in:present,absent,on_leave',
            'hours_worked' => 'nullable|integer|min:0|max:8',
            'leave_type' => 'nullable|in:sick,vacation,other',
            'remarks' => 'nullable|string|max:255',
        ]);

        // Proverava da li radnik radi na izabranom projektu
        $project = Auth::user()->projects()->where('id', $validated['project_id'])->exists();
        if (!$project) {
            return response()->json(['error' => 'Ne možete prijaviti prisustvo za projekat na kojem ne radite!'], 403);
        }

        $attendance = Attendance::create([
            'user_id' => Auth::id(),
            'project_id' => $validated['project_id'],
            'date' => now()->toDateString(),
            'status' => $validated['status'],
            'hours_worked' => $validated['status'] === 'present' ? $validated['hours_worked'] : null,
            'leave_type' => $validated['status'] !== 'present' ? $validated['leave_type'] : null,
            'remarks' => $validated['remarks'],
        ]);

        return response()->json(['message' => 'Attendance uspešno kreiran!', 'attendance' => $attendance]);
    }

    // Metrika: Radnici sa najviše sati
    public function topEmployeesByHours()
    {
        if (Auth::user()->user_role !== 'hr worker') {
            return response()->json(['error' => 'Samo HR može videti metrike!'], 403);
        }

        $metrics = DB::table('attendances')
            ->join('users', 'attendances.user_id', '=', 'users.id')
            ->select('users.id as user_id', 'users.name', DB::raw('SUM(attendances.hours_worked) as total_hours'))
            ->groupBy('users.id', 'users.name')
            ->orderByDesc('total_hours')
            ->limit(10)
            ->get();

        return response()->json($metrics);
    }
}
