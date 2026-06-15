<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Client extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'address',
        'latitude',
        'longitude',
        'logo',
        'industry',
    ];
    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];
    public function partnerships()
    {
        return $this->hasMany(Partnership::class);
    }
}
