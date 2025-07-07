<?php

namespace App\View\Components\MailBuilder\Modals;

use Illuminate\View\Component;

class SignatureModal extends Component
{
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view('components.mail-builder.modals.signature-modal');
    }
} 