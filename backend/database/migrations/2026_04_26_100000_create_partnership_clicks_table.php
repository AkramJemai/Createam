<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('partnership_clicks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('partnership_id');
            $table->timestamps();

            // Foreign key relationship
            $table->foreign('partnership_id')
                ->references('id')
                ->on('partnerships')
                ->onDelete('cascade');

            // Index for efficient querying
            $table->index(['partnership_id', 'created_at']);
            $table->index('created_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('partnership_clicks');
    }
};
