<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PartnershipCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\PartnershipCategory::create(['name' => 'Branding']);
        \App\Models\PartnershipCategory::create(['name' => 'Digital']);
        \App\Models\PartnershipCategory::create(['name' => 'Strategy']);
        \App\Models\PartnershipCategory::create(['name' => 'Marketing']);
    }
}
