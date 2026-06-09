<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Drop the job_categories table (no longer needed)
        Schema::dropIfExists('job_categories');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create('job_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        // Re-add the column
        \Illuminate\Support\Facades\DB::statement('ALTER TABLE job_titles ADD COLUMN job_category_id BIGINT UNSIGNED NULL AFTER id');
        \Illuminate\Support\Facades\DB::statement('ALTER TABLE job_titles ADD CONSTRAINT job_titles_job_category_id_foreign FOREIGN KEY (job_category_id) REFERENCES job_categories(id) ON DELETE CASCADE');
    }
};
