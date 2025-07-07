<?php

namespace App\View\Components\MailBuilder;

use Illuminate\View\Component;

class ComponentCategory extends Component
{
    public $title;
    public $icon;
    public $expanded;

    public function __construct($title = '', $icon = 'default', $expanded = false)
    {
        $this->title = $title;
        $this->icon = $icon;
        $this->expanded = $expanded;
    }

    public function render()
    {
        return view('components.mail-builder.component-category');
    }
} 