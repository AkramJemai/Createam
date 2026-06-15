<?php
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
class User extends Authenticatable
{
    use HasApiTokens, Notifiable;
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'job_title',
    ];
    protected $hidden = [
        'password',
        'remember_token',
    ];
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
    public function projects()
    {
        return $this->belongsToMany(Partnership::class, 'partnership_user');
    }
    public function tasks()
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new \App\Notifications\ResetPasswordNotification($token));
    }
}
