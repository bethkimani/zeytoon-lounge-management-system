import React, { useState } from 'react';
import { CheckCircle2Icon, MailIcon, MapPinIcon, MessageCircleIcon, PhoneIcon } from 'lucide-react';
import { images } from '../../data/images';
import { lounge, whatsappLink } from '../../data/lounge';
import { PageHero } from '../../components/public/PageHero';
import { Field, inputClass } from '../../components/ui/Field';
import { Button } from '../../components/ui/Button';

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v: Record<string, string> = {};
    if (form.name.trim().length < 2) v.name = 'Enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) v.email = 'Enter a valid email.';
    if (form.message.trim().length < 10) v.message = 'Tell us a little more (10+ characters).';
    setErrors(v);
    if (Object.keys(v).length) return;
    window.location.href = `mailto:${lounge.email}?subject=${encodeURIComponent(`Enquiry from ${form.name}`)}&body=${encodeURIComponent(`${form.message}\n\nReply to: ${form.email}`)}`;
    setSent(true);
  };

  return (
    <>
      <PageHero title="Contact us" subtitle="Bookings, private events and general enquiries." image={images.terrace} />
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 md:px-8">
        <div className="space-y-8">
          <ul className="space-y-5">
            <li className="flex gap-4"><MapPinIcon className="mt-1 h-5 w-5 text-gold" /><div><p className="font-medium">Address</p><p className="text-sm text-muted">{lounge.address}</p></div></li>
            <li className="flex gap-4"><PhoneIcon className="mt-1 h-5 w-5 text-gold" /><div><p className="font-medium">Phone & WhatsApp</p><a href={`tel:+${lounge.whatsapp}`} className="text-sm text-muted hover:text-gold">{lounge.phone}</a></div></li>
            <li className="flex gap-4"><MailIcon className="mt-1 h-5 w-5 text-gold" /><div><p className="font-medium">Email</p><a href={`mailto:${lounge.email}`} className="break-all text-sm text-muted hover:text-gold">{lounge.email}</a></div></li>
          </ul>
          <a href={whatsappLink()} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-[#062e16]">
            <MessageCircleIcon className="h-4 w-4" /> Chat on WhatsApp
          </a>
          <iframe title="Map to Zeytoon Lounge" src={lounge.mapEmbed} loading="lazy" className="h-72 w-full rounded-2xl border border-gold/15 grayscale invert-[0.9] hue-rotate-180" />
        </div>

        <div className="rounded-2xl border border-gold/15 bg-charcoal p-6 md:p-8">
          {sent ?
          <div className="flex flex-col items-center py-12 text-center">
              <CheckCircle2Icon className="h-10 w-10 text-gold" />
              <h2 className="mt-4 font-display text-3xl font-semibold">Your email is ready to send</h2>
              <p className="mt-2 text-sm text-muted">We opened your email app with the message addressed to {lounge.email}.</p>
              <Button variant="secondary" className="mt-6" onClick={() => {setSent(false);setForm({ name: '', email: '', message: '' });}}>Write another message</Button>
            </div> :

          <form onSubmit={submit} noValidate className="space-y-4">
              <h2 className="font-display text-3xl font-semibold">Send us a message</h2>
              <Field label="Your name" htmlFor="ct-name" required error={errors.name}>
                <input id="ct-name" className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="Email" htmlFor="ct-email" required error={errors.email}>
                <input id="ct-email" type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </Field>
              <Field label="Message" htmlFor="ct-msg" required error={errors.message}>
                <textarea id="ct-msg" rows={5} className={inputClass} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Private event, group booking, feedback…" />
              </Field>
              <Button type="submit" size="lg" className="w-full">Send message</Button>
            </form>
          }
        </div>
      </section>
    </>);

}