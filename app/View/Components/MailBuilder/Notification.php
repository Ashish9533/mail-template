<?php

namespace App\View\Components\MailBuilder;

use Illuminate\View\Component;

class Notification extends Component
{
    public function render()
    {
        return view('components.mail-builder.notification');
    }
} 