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
        Schema::table('partnerships', function (Blueprint $table) {
            $table->dropColumn(['address', 'city', 'latitude', 'longitude']);
        });

        Schema::table('agency_teams', function (Blueprint $table) {
            $table->dropColumn(['photo', 'bio']);
        });

        Schema::table('agency_timelines', function (Blueprint $table) {
            $table->dropColumn(['image']);
        });

        Schema::table('contacts', function (Blueprint $table) {
            $table->dropColumn(['admin_reply']);
        });

        Schema::table('invitations', function (Blueprint $table) {
            $table->dropColumn(['project_id']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['email_verified_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('email_verified_at')->nullable();
        });

        Schema::table('invitations', function (Blueprint $table) {
            $table->foreignId('project_id')->nullable();
        });

        Schema::table('contacts', function (Blueprint $table) {
            $table->text('admin_reply')->nullable();
        });

        Schema::table('agency_timelines', function (Blueprint $table) {
            $table->string('image')->nullable();
        });

        Schema::table('agency_teams', function (Blueprint $table) {
            $table->string('photo')->nullable();
            $table->text('bio')->nullable();
        });
        Schema::table('partnerships', function (Blueprint $table) {
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
        });
    }
};
