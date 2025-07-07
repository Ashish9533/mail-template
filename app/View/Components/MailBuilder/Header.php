<?php

namespace App\View\Components\MailBuilder;

use Illuminate\View\Component;

class Header extends Component
{
    public $templateName;

    public function __construct($templateName = '')
    {
        $this->templateName = $templateName;
    }

    public function render()
    {
        return view('components.mail-builder.header');
    }
} 