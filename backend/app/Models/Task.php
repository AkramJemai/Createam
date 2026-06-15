<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Task extends Model
{
    use HasFactory;
    protected $fillable = [
        'meeting_id',
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
