<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Task extends Model
{
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
    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }
    public function assigned_user()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
