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
        Schema::table('partnership_user', function (Blueprint $table) {
            $table->timestamp('accepted_at')->nullable()->after('user_id');
            $table->timestamp('read_at')->nullable()->after('accepted_at');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('partnership_user', function (Blueprint $table) {
            $table->dropColumn(['accepted_at', 'read_at']);
        });
    }
};
