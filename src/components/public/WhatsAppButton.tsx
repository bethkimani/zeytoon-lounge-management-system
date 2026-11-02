import React from 'react';
import { MessageCircleIcon } from 'lucide-react';
import { whatsappLink } from '../../data/lounge';

export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Reserve on WhatsApp: 0745 104 247"
      className="fixed bottom-5 right-5 z-30 inline-flex h-14 items-center gap-2 rounded-full bg-[#25D366] px-5 font-semibold text-[#062e16] shadow-xl transition-transform duration-150 ease-out hover:scale-[1.03] active:scale-[0.97]">
      
      <MessageCircleIcon className="h-5 w-5" />
      <span className="hidden sm:inline">Reserve on WhatsApp</span>
    </a>);

}