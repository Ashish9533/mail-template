<?php

namespace App\View\Components\MailBuilder;

use Illuminate\View\Component;

class ComponentItem extends Component
{
    public $type;
    public $name;
    public $icon;
    public $draggable;

    public function __construct($type = '', $name = '', $icon = 'default', $draggable = true)
    {
        $this->type = $type;
        $this->name = $name;
        $this->icon = $icon;
        $this->draggable = $draggable;
    }

    public function render()
    {
        return view('components.mail-builder.component-item');
    }
} 