<?php
namespace App\Mail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
class InvitationMail extends Mailable
{
    use Queueable, SerializesModels;
    public $invitation;
    public $inviteLink;
    public function __construct($invitation, $inviteLink)
    {
        $this->invitation = $invitation;
        $this->inviteLink = $inviteLink;
    }
    public function envelope()
    {
        return new Envelope(
            subject: 'You are invited to join Createam Agency',
        );
    }
    public function content()
    {
        return new Content(
            view: 'emails.invitation',
        );
    }
    public function attachments()
    {
        return [];
    }
}
