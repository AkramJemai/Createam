<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('jobs');

        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn('is_active');
        });

        Schema::table('agency_stats', function (Blueprint $table) {
            $table->dropColumn('order');
        });

        Schema::table('agency_teams', function (Blueprint $table) {
            $table->dropColumn('order');
        });

        Schema::table('agency_timelines', function (Blueprint $table) {
            $table->dropColumn('order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('queue')->index();
            $table->longText('payload');
            $table->unsignedTinyInteger('attempts');
            $table->unsignedInteger('reserved_at')->nullable();
            $table->unsignedInteger('available_at');
            $table->unsignedInteger('created_at');
        });

        Schema::table('clients', function (Blueprint $table) {
            $table->boolean('is_active')->default(true);
        });

        Schema::table('agency_stats', function (Blueprint $table) {
            $table->integer('order')->nullable();
        });

        Schema::table('agency_teams', function (Blueprint $table) {
            $table->integer('order')->nullable();
        });

        Schema::table('agency_timelines', function (Blueprint $table) {
            $table->integer('order')->nullable();
        });
    }
};
