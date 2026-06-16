<?php
namespace App\Http\Controllers;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
class ContactController extends Controller
{
    public function getAllContacts()
    {
        return response()->json(Contact::latest()->get());
    }
    public function createContact(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'FullName' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        try {
            $contact = Contact::create([
                'full_name' => $request->FullName,
                'email' => $request->email,
                'subject' => $request->subject,
                'message' => $request->message,
                'status' => 'Pending',
            ]);
            try {
                $firstName = explode(' ', $contact->full_name)[0];
                $refNum = $contact->getReferenceNumber();
                Mail::raw(
                    "Hello {$firstName},\n\n" .
                    "Thank you for reaching out to Createam ! We've successfully received your message and our team is reviewing it now.\n\n" .
                    "Your Reference Number: {$refNum}\n\n" .
                    "We typically respond to all inquiries within 24 hours. If your matter is urgent, feel free to reach out directly at contact@createam.tn.\n\n" .
                    "Best regards,\nCreateam Agency Team",
                    function ($message) use ($contact, $refNum) {
                        $message->to($contact->email)
                                ->subject("We received your message — {$refNum}");
                    }
                );
            } catch (\Exception $e) {
                Log::warning('Email failed but form was saved: ' . $e->getMessage());
            }
            return response()->json([
                'success' => true,
                'id' => $contact->id,
                'referenceNumber' => $contact->getReferenceNumber(),
                'message' => 'Your message has been received.'
            ], 201);
        } catch (\Exception $e) {
            Log::error('Contact form error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to submit contact form.'], 500);
        }
    }
    public function updateContactStatus(Request $request, Contact $contact)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:Pending,Received,In Progress,Resolved,Closed',
            'admin_reply' => 'nullable|string|max:5000',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        try {
            $newStatus = $request->status;
            $adminReply = $request->admin_reply;
            $contact->update([
                'status' => $newStatus,
                'admin_reply' => $adminReply,
            ]);
            try {
                $firstName = explode(' ', $contact->full_name)[0];
                $refNum = $contact->getReferenceNumber();
                if ($newStatus === 'In Progress') {
                    Mail::raw(
                        "Hello {$firstName},\n\n" .
                        "Great news! Our team is actively reviewing your request and looking into it.\n\n" .
                        "Reference Number: {$refNum}\n\n" .
                        "We're making good progress and will have an update for you soon. Thank you for your patience!\n\n" .
                        "Best regards,\nCreateam Agency Team",
                        function ($message) use ($contact, $refNum) {
                            $message->to($contact->email)
                                    ->subject("Your request is being reviewed — {$refNum}");
                        }
                    );
                } elseif ($newStatus === 'Resolved') {
                    $bodyText = "Hello {$firstName},\n\n" .
                                "Your request has been successfully resolved!\n\n" .
                                "Reference Number: {$refNum}\n\n";
                    if ($adminReply) {
                        $bodyText .= "Our Response:\n{$adminReply}\n\n";
                    } else {
                        $bodyText .= "Thank you for reaching out. We appreciate your inquiry and hope everything is working well now.\n\n";
                    }
                    $bodyText .= "If you have any further questions or need additional assistance, feel free to reach out at contact@createam.tn.\n\n" .
                                 "Best regards,\nCreateam Agency Team";
                    Mail::raw($bodyText, function ($message) use ($contact, $refNum) {
                        $message->to($contact->email)
                                ->subject("Your request has been resolved — {$refNum}");
                    });
                }
            } catch (\Exception $e) {
                Log::warning('Status update email failed: ' . $e->getMessage());
            }
            return response()->json([
                'success' => true,
                'contact' => $contact,
                'message' => 'Contact status updated.'
            ]);
        } catch (\Exception $e) {
            Log::error('Contact update error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update contact.'], 500);
        }
    }
    public function deleteContact(Contact $contact)
    {
        $contact->delete();
        return response()->json(null, 204);
    }
}
