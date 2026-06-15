<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Invitation extends Model
{
    protected $fillable = [
        'email',
        'role',
        'token',
        'expires_at',
        'job_title',
        'accepted_at',
    ];
    protected $casts = [
        'expires_at' => 'datetime',
    ];
}
