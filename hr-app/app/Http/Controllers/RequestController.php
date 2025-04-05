<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Request as RequestModel;
use App\Http\Resources\RequestResource;
use Illuminate\Support\Facades\Auth;

class RequestController extends Controller
{
    // Radnik kreira novi request
    public function store(Request $request)
    {
        if (Auth::user()->user_role !== 'worker') {
            return response()->json(['error' => 'Samo radnici mogu kreirati zahteve!'], 403);
        }

        $validated = $request->validate([
            'dates_from' => 'required|date|after_or_equal:today',
            'dates_to' => 'required|date|after_or_equal:dates_from',
            'leave_type' => 'required|string|in:sick,vacation,other',
        ]);

        $newRequest = RequestModel::create([
            'user_id' => Auth::id(),
            'dates_from' => $validated['dates_from'],
            'dates_to' => $validated['dates_to'],
            'leave_type' => $validated['leave_type'],
            'status' => 'sent',
        ]);

        return new RequestResource($newRequest);
    }

    // Radnik izmeni svoj request
    public function update(Request $request, $id)
    {
        if (Auth::user()->user_role !== 'worker') {
            return response()->json(['error' => 'Samo radnici mogu izmeniti svoje zahteve!'], 403);
        }

        $requestModel = RequestModel::find($id);

        if (!$requestModel || $requestModel->user_id !== Auth::id() || $requestModel->status !== 'sent') {
            return response()->json(['error' => 'Nemate dozvolu za izmenu ovog zahteva ili zahtev ne postoji!'], 403);
        }

        $validated = $request->validate([
            'dates_from' => 'required|date|after_or_equal:today',
            'dates_to' => 'required|date|after_or_equal:dates_from',
            'leave_type' => 'required|string|in:sick,vacation,other',
        ]);

        $requestModel->update($validated);

        return new RequestResource($requestModel);
    }

    // Radnik obriše svoj request
    public function destroy($id)
    {
        if (Auth::user()->user_role !== 'worker') {
            return response()->json(['error' => 'Samo radnici mogu obrisati svoje zahteve!'], 403);
        }

        $requestModel = RequestModel::find($id);

        if (!$requestModel || $requestModel->user_id !== Auth::id() || $requestModel->status !== 'sent') {
            return response()->json(['error' => 'Nemate dozvolu za brisanje ovog zahteva ili zahtev ne postoji!'], 403);
        }

        $requestModel->delete();

        return response()->json(['message' => 'Request uspešno obrisan!']);
    }

    // Radnik vidi svoje requestove
    public function index()
    {
        if (Auth::user()->user_role !== 'worker') {
            return response()->json(['error' => 'Samo radnici mogu videti svoje zahteve!'], 403);
        }

        $requests = RequestModel::where('user_id', Auth::id())->get();

        return RequestResource::collection($requests);
    }

    // HR vidi sve requestove
    public function allRequests()
    {
        if (Auth::user()->user_role !== 'hr worker') {
            return response()->json(['error' => 'Samo HR može videti sve zahteve!'], 403);
        }

        $requests = RequestModel::all();

        return RequestResource::collection($requests);
    }

    // HR vidi jedan request
    public function show($id)
    {
        if (Auth::user()->user_role !== 'hr worker') {
            return response()->json(['error' => 'Samo HR može videti pojedinačne zahteve!'], 403);
        }

        $requestModel = RequestModel::find($id);

        if (!$requestModel) {
            return response()->json(['error' => 'Zahtev ne postoji!'], 404);
        }

        return new RequestResource($requestModel);
    }

    // HR ažurira status na accepted/declined
    public function updateStatus(Request $request, $id)
    {
        if (Auth::user()->user_role !== 'hr worker') {
            return response()->json(['error' => 'Samo HR može ažurirati status zahteva!'], 403);
        }

        $requestModel = RequestModel::find($id);

        if (!$requestModel || $requestModel->status !== 'sent') {
            return response()->json(['error' => 'Zahtev ne postoji ili nije u statusu "sent"!'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:accepted,declined',
        ]);

        $requestModel->update(['status' => $validated['status']]);

        return new RequestResource($requestModel);
    }
}
