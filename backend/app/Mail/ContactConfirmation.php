<?php

namespace App\Mail;

use App\Models\Contact;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Contact $contact)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            from: 'contact@createam.tn',
            subject: 'We received your message — Ref ' . $this->contact->getReferenceNumber(),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contact-confirmation',
            with: [
                'contact' => $this->contact,
                'firstName' => explode(' ', $this->contact->full_name)[0],
                'referenceNumber' => $this->contact->getReferenceNumber(),
            ],
        );
    }
}
