<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Contact extends Model
{
    use HasFactory;
    protected $fillable = [
        'full_name',
        'email',
        'subject',
        'message',
        'status',
        'admin_reply'
    ];
    protected $attributes = [
        'status' => 'Received'
    ];
    public function getReferenceNumber()
    {
        return '#' . str_pad($this->id, 4, '0', STR_PAD_LEFT);
    }
}
