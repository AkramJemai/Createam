<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::updateOrCreate(
            ['email' => 'admin@createam.tn'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'job_title' => 'Chief Administrator'
            ]
        );

        User::updateOrCreate(
            ['email' => 'chef@createam.tn'],
            [
                'name' => 'Chef User',
                'password' => Hash::make('chef123'),
                'role' => 'chef',
                'job_title' => 'Project Manager'
            ]
        );

        User::updateOrCreate(
            ['email' => 'member@createam.tn'],
            [
                'name' => 'Member User',
                'password' => Hash::make('member123'),
                'role' => 'member',
                'job_title' => 'Senior Developer'
            ]
        );
    }
}
