<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        //
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, \Closure $next)
    {
        // Add debug logging for CSRF token issues
        if ($request->isMethod('post') && $request->is('mail-template/*')) {
            \Log::info('CSRF Debug', [
                'url' => $request->url(),
                'has_token_header' => $request->hasHeader('X-CSRF-TOKEN'),
                'token_header' => $request->header('X-CSRF-TOKEN') ? 'present' : 'missing',
                'session_token' => $request->session()->token(),
                'tokens_match' => $request->header('X-CSRF-TOKEN') === $request->session()->token()
            ]);
        }

        return parent::handle($request, $next);
    }
} 