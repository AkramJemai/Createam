<x-mail::message>
# Your Request Has Been Resolved

Hello {{ $firstName }},

Your request has been successfully resolved!

**Reference Number:** {{ $referenceNumber }}

@if($reply)
**Our Response:**

{!! nl2br(e($reply)) !!}
@else
Thank you for reaching out. We appreciate your inquiry and hope everything is working well now.
@endif

If you have any further questions or need additional assistance, feel free to reach out at **contact@createam.tn**.

<x-mail::footer>
© 2026 Createam Agency. All rights reserved.
</x-mail::footer>
</x-mail::message>
