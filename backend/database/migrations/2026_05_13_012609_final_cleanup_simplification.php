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
        Schema::dropIfExists('partnership_user');

        Schema::table('meetings', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('partnerships', function (Blueprint $table) {
            $table->dropColumn('media');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('partnerships', function (Blueprint $table) {
            $table->json('media')->nullable();
        });

        Schema::table('meetings', function (Blueprint $table) {
            $table->string('status')->nullable();
        });

        Schema::create('partnership_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('partnership_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }
};
