<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EmployeeProjectController extends Controller
{
    public function index()
    {
        $rows = DB::table('employee_projects')->get();
        return response()->json($rows);
    }

    public function destroy($id)
    {
        if (Auth::user()->user_role !== 'hr worker') {
            return response()->json(['error' => 'Samo HR može bristi angazovanje!'], 403);
        }
        DB::table('employee_projects')->where('id', $id)->delete();
        return response()->json(['message' => 'Angažovanje obrisano.']);
    }

    // HR radnik dodeljuje radnika na projekat
    public function assignEmployeeToProject(Request $request)
    {
        if (Auth::user()->user_role !== 'hr worker') {
            return response()->json(['error' => 'Samo HR može dodeljivati radnike na projekte!'], 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'project_id' => 'required|exists:projects,id',
            'role' => 'nullable|string',
        ]);

        $user = User::find($validated['user_id']);
        $project = Project::find($validated['project_id']);

        $user->projects()->attach($project->id, [
            'role' => $validated['role'] ?? 'employee',
            'assigned_at' => now(),
        ]);

        return response()->json([
            'message' => "Radnik {$user->name} je uspešno dodeljen na projekat {$project->name}!",
        ]);
    }

    // Radnik vidi sve projekte na kojima trenutno radi
    public function getEmployeeProjects()
    {
        if (Auth::user()->user_role !== 'worker') {
            return response()->json(['error' => 'Samo radnici mogu videti projekte na kojima rade!'], 403);
        }

        $projects = Auth::user()->projects;

        return response()->json($projects);
    }

    // Vraćanje metrika: lista radnika i broj projekata
    public function getEmployeeProjectMetrics()
    {
        if (Auth::user()->user_role !== 'hr worker') {
            return response()->json(['error' => 'Samo HR može videti metrike!'], 403);
        }

        $metrics = DB::table('employee_projects')
            ->join('users', 'employee_projects.user_id', '=', 'users.id')
            ->select('users.id as user_id', 'users.name', DB::raw('COUNT(employee_projects.project_id) as project_count'))
            ->groupBy('users.id', 'users.name')
            ->get();

        return response()->json($metrics);
    }

    /**
     * Export svih zapisa iz employee_projects u CSV formatu.
    */
    public function exportCsv()
    {
        if (Auth::user()->user_role !== 'hr worker') {
            return response()->json(['error' => 'Samo HR može eksportovati podatke!'], 403);
        }

        $fileName = 'employee_projects_' . date('Ymd_His') . '.csv';
        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"$fileName\"",
        ];

        $callback = function() {
            $handle = fopen('php://output', 'w');

            // zaglavlje
            fputcsv($handle, [
                'id',
                'user_name',
                'project_name',
                'role'
            ]);

            // formatiramo created_at u string
            $rows = DB::table('employee_projects')
                ->join('users',    'employee_projects.user_id',    '=', 'users.id')
                ->join('projects', 'employee_projects.project_id', '=', 'projects.id')
                ->select([
                    'employee_projects.id',
                    'users.name as user_name',
                    'projects.name as project_name',
                    'employee_projects.role'
                ])
                ->get();

            foreach ($rows as $row) {
                fputcsv($handle, [
                    $row->id,
                    $row->user_name,
                    $row->project_name,
                    $row->role
                ]);
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

}
