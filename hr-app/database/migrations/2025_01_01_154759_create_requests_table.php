<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRequestsTable extends Migration
{
    public function up()
    {
        Schema::create('requests', function (Blueprint $table) {
            $table->id();
            $table->date('dates_from');
            $table->date('dates_to');
            $table->enum('leave_type', ['sick', 'vacation', 'other']);
            $table->enum('status', ['sent', 'accepted', 'declined'])->default('sent');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('requests');
    }
}

