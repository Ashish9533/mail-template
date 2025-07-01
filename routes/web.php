<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MailTemplateController;
use App\Http\Controllers\EmailController;

Route::get('/', function () {
    return view('welcome');
});

// CSRF token endpoint for debugging
Route::get('/csrf-token', function () {
    return response()->json(['token' => csrf_token()]);
});

// Mail Template Builder Routes
Route::prefix('mail-template')->group(function () {
    Route::get('/', [MailTemplateController::class, 'index'])->name('mail-template.builder');
    Route::post('/save', [MailTemplateController::class, 'save'])->name('mail-template.save');
    Route::get('/templates', [MailTemplateController::class, 'templates'])->name('mail-template.templates');
    Route::get('/load/{id}', [MailTemplateController::class, 'load'])->name('mail-template.load');
    Route::delete('/delete/{id}', [MailTemplateController::class, 'delete'])->name('mail-template.delete');
    Route::post('/preview', [MailTemplateController::class, 'preview'])->name('mail-template.preview');
    Route::post('/export', [MailTemplateController::class, 'export'])->name('mail-template.export');
});

// Email Management Routes
Route::prefix('emails')->group(function () {
    Route::get('/', [EmailController::class, 'index'])->name('emails.dashboard');
    Route::get('/preview/{templateId}', [EmailController::class, 'previewTemplate'])->name('emails.preview');
    Route::post('/test/{templateId}', [EmailController::class, 'sendTestEmail'])->name('emails.test');
    Route::post('/newsletter', [EmailController::class, 'sendNewsletter'])->name('emails.newsletter');
    Route::post('/welcome/{user}', [EmailController::class, 'sendWelcomeEmail'])->name('emails.welcome');
    Route::post('/promotion', [EmailController::class, 'sendPromotion'])->name('emails.promotion');
    Route::get('/variables/{templateId}', [EmailController::class, 'getTemplateVariables'])->name('emails.variables');
    Route::post('/test-config', [EmailController::class, 'testMailConfig'])->name('emails.test-config');
});

// Quick test routes for development
Route::get('/test-welcome/{userId}', function($userId) {
    $user = App\Models\User::find($userId);
    if ($user) {
        Mail::to($user->email)->send(new App\Mail\WelcomeEmail($user));
        return "Welcome email sent to {$user->email}";
    }
    return "User not found";
});

Route::get('/test-newsletter', function() {
    $templateData = [
        'newsletter_title' => 'Test Newsletter',
        'main_article_title' => 'Welcome to Our Newsletter!',
        'main_article_content' => 'This is a test newsletter to demonstrate the email template system.',
        'cta_url' => 'https://example.com',
        'cta_text' => 'Read More',
        'user_name' => 'Test User',
        'company_name' => 'Your Company'
    ];
    
    Mail::to('test@example.com')->send(new App\Mail\NewsletterMail($templateData));
    return "Newsletter test email sent!";
});
