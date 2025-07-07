<?php

namespace App\View\Components\MailBuilder;

use Illuminate\View\Component;

class Main extends Component
{
    public $templateName;
    public $template;

    public function __construct($templateName = '', $template = null)
    {
        $this->templateName = $templateName;
        $this->template = $template;
    }

    public function render()
    {
        return view('components.mail-builder.main');
    }
} 