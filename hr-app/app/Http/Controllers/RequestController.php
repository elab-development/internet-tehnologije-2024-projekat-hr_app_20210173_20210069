<?php

namespace App\Http\Controllers;

use App\Models\Request;
use Illuminate\Http\Request as HttpRequest;
use App\Http\Resources\RequestResource;
use Illuminate\Support\Facades\Auth;

class RequestController extends Controller
{
    // Radnik kreira novi request
    public function store(HttpRequest $request)
    {
        if (Auth::user()->user_role !== 'worker') {
            return response()->json(['error' => 'Samo radnici mogu kreirati zahteve!'], 403);
        }

        $validated = $request->validate([
            'dates_from' => 'required|date|after_or_equal:today',
            'dates_to' => 'required|date|after_or_equal:dates_from',
            'leave_type' => 'required|string|in:sick,vacation,other',
        ]);

        $newRequest = Request::create([
            'user_id' => Auth::id(),
            'dates_from' => $validated['dates_from'],
            'dates_to' => $validated['dates_to'],
            'leave_type' => $validated['leave_type'],
            'status' => 'sent',
        ]);

        return new RequestResource($newRequest);
    }

    // Radnik izmeni svoj request
    public function update(HttpRequest $request, Request $requestModel)
    {
        if (Auth::user()->user_role !== 'worker') {
            return response()->json(['error' => 'Samo radnici mogu izmeniti svoje zahteve!'], 403);
        }

        $this->authorize('update', $requestModel);

        $validated = $request->validate([
            'dates_from' => 'required|date|after_or_equal:today',
            'dates_to' => 'required|date|after_or_equal:dates_from',
            'leave_type' => 'required|string|in:sick,vacation,other',
        ]);

        $requestModel->update($validated);

        return new RequestResource($requestModel);
    }

    // Radnik obriše svoj request
    public function destroy(Request $requestModel)
    {
        if (Auth::user()->user_role !== 'worker') {
            return response()->json(['error' => 'Samo radnici mogu obrisati svoje zahteve!'], 403);
        }

        $this->authorize('delete', $requestModel);

        $requestModel->delete();

        return response()->json(['message' => 'Request uspešno obrisan!']);
    }

    // Radnik vidi svoje requestove
    public function index()
    {
        if (Auth::user()->user_role !== 'worker') {
            return response()->json(['error' => 'Samo radnici mogu videti svoje zahteve!'], 403);
        }

        $requests = Auth::user()->requests;

        return RequestResource::collection($requests);
    }

    // HR vidi sve requestove
    public function allRequests()
    {
        if (Auth::user()->user_role !== 'hr worker') {
            return response()->json(['error' => 'Samo HR može videti sve zahteve!'], 403);
        }

        $requests = Request::all();

        return RequestResource::collection($requests);
    }

    // HR vidi jedan request
    public function show(Request $requestModel)
    {
        if (Auth::user()->user_role !== 'hr worker') {
            return response()->json(['error' => 'Samo HR može videti pojedinačne zahteve!'], 403);
        }

        $this->authorize('view', $requestModel);

        return new RequestResource($requestModel);
    }

    // HR ažurira status na accepted/declined
    public function updateStatus(HttpRequest $request, Request $requestModel)
    {
        if (Auth::user()->user_role !== 'hr worker') {
            return response()->json(['error' => 'Samo HR može ažurirati status zahteva!'], 403);
        }

        $this->authorize('updateStatus', $requestModel);

        $validated = $request->validate([
            'status' => 'required|in:accepted,declined',
        ]);

        $requestModel->update(['status' => $validated['status']]);

        return new RequestResource($requestModel);
    }
}

