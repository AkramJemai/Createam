<x-mail::message>
# Message Received!

Hello {{ $firstName }},

Thank you for reaching out to **Createam Agency**! We've successfully received your message and our team is reviewing it now.

**Your Reference Number:** {{ $referenceNumber }}

We typically respond to all inquiries within **24 hours**. If your matter is urgent, feel free to reach out directly to us at **contact@createam.tn**.

---

**Your Message Summary:**
- **Subject:** {{ $contact->subject }}
- **Submitted:** {{ $contact->created_at->format('M d, Y \a\t H:i') }}

Thank you for your patience!

<x-mail::footer>
© 2026 Createam Agency. All rights reserved.
</x-mail::footer>
</x-mail::message>
