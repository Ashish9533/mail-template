<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MailTemplateController;
use App\Http\Controllers\EmailController;

Route::get('/', function () {
    return view('welcome');
});

// Mail Template Dashboard
Route::get('/mail-templates', [MailTemplateController::class, 'dashboard'])->name('mail-templates.dashboard');

// Mail Template Builder
Route::get('/mail-templates/builder', [MailTemplateController::class, 'builder'])->name('mail-templates.builder');

// Mail Template API Routes
Route::prefix('api/mail-templates')->group(function () {
    Route::get('/', [MailTemplateController::class, 'index']);
    Route::post('/', [MailTemplateController::class, 'store']);
    Route::get('/{id}', [MailTemplateController::class, 'show']);
    Route::put('/{id}', [MailTemplateController::class, 'update']);
    Route::delete('/{id}', [MailTemplateController::class, 'destroy']);
    Route::get('/{id}/preview', [MailTemplateController::class, 'preview']);
    Route::get('/{id}/variables', [MailTemplateController::class, 'variables']);
    Route::get('/{id}/export', [MailTemplateController::class, 'export']);
    Route::post('/{id}/duplicate', [MailTemplateController::class, 'duplicate']);
    Route::post('/upload-image', [MailTemplateController::class, 'uploadImage']);
});


