<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class AgencyInfo extends Model
{
    use HasFactory;
    protected $fillable = ['tagline', 'about_text', 'founded_year'];
}
