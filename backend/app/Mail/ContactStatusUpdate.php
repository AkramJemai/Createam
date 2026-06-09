<?php

namespace App\Mail;

use App\Models\Contact;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactStatusUpdate extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Contact $contact,
        public string $newStatus,
        public ?string $reply = null
    ) {
    }

    public function envelope(): Envelope
    {
        $subject = match($this->newStatus) {
            'In Progress' => 'Your request is being reviewed — Ref ' . $this->contact->getReferenceNumber(),
            'Resolved' => 'Your request has been resolved — Ref ' . $this->contact->getReferenceNumber(),
            default => 'Update on your request — Ref ' . $this->contact->getReferenceNumber(),
        };

        return new Envelope(
            from: 'contact@createam.tn',
            subject: $subject,
        );
    }

    public function content(): Content
    {
        $viewName = match($this->newStatus) {
            'In Progress' => 'emails.contact-in-progress',
            'Resolved' => 'emails.contact-resolved',
            default => 'emails.contact-status-update',
        };

        return new Content(
            view: $viewName,
            with: [
                'contact' => $this->contact,
                'firstName' => explode(' ', $this->contact->full_name)[0],
                'referenceNumber' => $this->contact->getReferenceNumber(),
                'reply' => $this->reply,
            ],
        );
    }
}
