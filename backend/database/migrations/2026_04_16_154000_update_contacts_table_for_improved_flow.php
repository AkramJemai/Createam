<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations - Update contacts table with new fields
     */
    public function up()
    {
        // Check if table exists and update it
        if (Schema::hasTable('contacts')) {
            Schema::table('contacts', function (Blueprint $table) {
                // Rename FullName to full_name if it exists and not already renamed
                try {
                    if (Schema::hasColumn('contacts', 'FullName')) {
                        $table->renameColumn('FullName', 'full_name');
                    }
                } catch (\Exception $e) {
                    // Column might already be renamed
                }

                // Rename Status to status if it exists and not already renamed
                try {
                    if (Schema::hasColumn('contacts', 'Status')) {
                        $table->renameColumn('Status', 'status');
                    }
                } catch (\Exception $e) {
                    // Column might already be renamed
                }

                // Add admin_reply column if it doesn't exist
                if (!Schema::hasColumn('contacts', 'admin_reply')) {
                    $table->text('admin_reply')->nullable()->after('message');
                }
            });
        } else {
            // Create table if it doesn't exist
            Schema::create('contacts', function (Blueprint $table) {
                $table->id();
                $table->string('full_name');
                $table->string('email');
                $table->string('subject');
                $table->text('message');
                $table->string('status')->default('Received');
                $table->text('admin_reply')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('contacts');
    }
};
