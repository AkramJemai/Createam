<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class AgencyInfo extends Model
{
    protected $fillable = ['tagline', 'about_text', 'founded_year'];
}
