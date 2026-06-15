<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Client extends Model
{
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
