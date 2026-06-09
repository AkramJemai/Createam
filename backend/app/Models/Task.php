<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'partnership_id',
        'assigned_to',
        'title',
        'description',
        'status',
        'progress',
        'priority',
        'due_date'
    ];

    public function partnership()
    {
        return $this->belongsTo(Partnership::class);
    }

    public function assigned_user()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
