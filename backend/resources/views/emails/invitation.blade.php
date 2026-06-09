<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Join Createam Agency</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f6f9fc;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f6f9fc;
            padding-bottom: 60px;
        }
        .main {
            background-color: #ffffff;
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
            border-spacing: 0;
            font-family: sans-serif;
            color: #4a5568;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            margin-top: 40px;
        }
        .header {
            background-color: #000000;
            padding: 40px;
            text-align: center;
        }
        .logo {
            font-size: 24px;
            font-weight: 900;
            letter-spacing: -1px;
            color: #ffffff;
            text-transform: uppercase;
        }
        .logo span {
            color: #8B2D7C;
        }
        .body {
            padding: 40px;
            line-height: 1.6;
        }
        .welcome-text {
            font-size: 24px;
            font-weight: 800;
            color: #1a202c;
            margin-bottom: 20px;
            line-height: 1.2;
        }
        .role-badge {
            display: inline-block;
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
            padding: 4px 12px;
            border-radius: 50px;
            font-weight: 700;
            font-size: 14px;
            color: #4a5568;
            margin-bottom: 20px;
        }
        .cta-container {
            margin: 40px 0;
            text-align: center;
        }
        .button {
            background-color: #8B2D7C;
            color: #ffffff !important;
            padding: 18px 36px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 700;
            font-size: 16px;
            display: inline-block;
            transition: background-color 0.3s ease;
        }
        .footer {
            padding: 30px;
            text-align: center;
            font-size: 12px;
            color: #a0aec0;
            background-color: #ffffff;
            border-top: 1px solid #edf2f7;
        }
        .expiry-note {
            font-style: italic;
            color: #718096;
            font-size: 13px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <center>
            <table class="main" width="100%">
                <tr>
                    <td class="header">
                        <div class="logo">CREATEAM<span>.</span></div>
                    </td>
                </tr>
                <tr>
                    <td class="body">
                        <h1 class="welcome-text">Experience the Future of Agency Collaboration.</h1>
                        
                        <p>Hi there,</p>
                        
                        <p>You've been handpicked to join the <strong>Createam Agency</strong> production pipeline. Your expertise is key to our upcoming milestones.</p>
                        
                        <div class="role-badge">
                            Position: {{ strtoupper($invitation->role) }} 
                            @if($invitation->job_title)
                                — {{ $invitation->job_title }}
                            @endif
                        </div>

                        <p>Click the button below to secure your workspace and initialize your dashboard profile:</p>

                        <div class="cta-container">
                            <a href="{{ $inviteLink }}" class="button">Setup My Dashboard</a>
                        </div>

                        <p class="expiry-note">* Security Note: This invitation link is unique to your email and will expire in 48 hours.</p>
                        
                        <p>If you didn't expect this invitation, you can safely disregard this message.</p>
                    </td>
                </tr>
                <tr>
                    <td class="footer">
                        &copy; {{ date('Y') }} Createam Agency. All rights reserved.<br>
                        Confidential Invitation • Internal Use Only
                    </td>
                </tr>
            </table>
        </center>
    </div>
</body>
</html>