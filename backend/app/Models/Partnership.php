<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
class Partnership extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'client_id',
        'cat',
        'img',
        'video',
        'year',
        'month',
        'clicks',
        'status',
        'description',
    ];
    public function getImgAttribute($value)
    {
        return $this->publicStorageUrl($value);
    }
    public function getVideoAttribute($value)
    {
        return $this->publicStorageUrl($value);
    }
    public function getMediaAttribute($value)
    {
        $media = is_array($value) ? $value : (json_decode($value ?? '[]', true) ?: []);
        return array_map(function ($item) {
            if (is_string($item)) {
                return $this->publicStorageUrl($item);
            }
            if (is_array($item) && isset($item['url'])) {
                $item['url'] = $this->publicStorageUrl($item['url']);
            }
            return $item;
        }, $media);
    }
    private function publicStorageUrl($value)
    {
        if (!$value || preg_match('/^(https?:)?\/\//', $value) || str_starts_with($value, '/storage/')) {
            return $value;
        }
        return asset(Storage::url($value));
    }
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
    public function client()
    {
        return $this->belongsTo(Client::class);
    }
    public function clickLogs()
    {
        return $this->hasMany(PartnershipClick::class);
    }
}
