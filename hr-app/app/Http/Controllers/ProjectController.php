<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Project;
use App\Http\Resources\ProjectResource;

class ProjectController extends Controller
{
    public function index()
    {
        // return all projects as resources
        return ProjectResource::collection(Project::all());
    }

    public function update(Request $request, Project $project)
    {
        $data = $request->validate([
            'status'     => 'required|string',
            'start_date' => 'required|date',
        ]);

        $project->update($data);

        return response()->json($project);
    }
}
