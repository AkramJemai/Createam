<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'client_name',
        'meeting_date',
        'notes',
        'chef_id',
        'created_by'
    ];

    public function chef()
    {
        return $this->belongsTo(User::class, 'chef_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
