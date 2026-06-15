<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class PartnershipClick extends Model
{
    protected $table = 'partnership_clicks';
    protected $fillable = ['partnership_id'];
    public function partnership()
    {
        return $this->belongsTo(Partnership::class);
    }
}
