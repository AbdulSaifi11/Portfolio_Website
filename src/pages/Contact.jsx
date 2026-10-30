import { useState } from 'react';
import { asset } from '../data/navigation.js';
import SocialLinks from '../components/SocialLinks.jsx';
import { createContactMessage } from '../firebase/contactMessages.js';

const emptyForm = { name: '', email: '', phone: '', address: '' };

export default function Contact() {
  const [values, setValues] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [invalidField, setInvalidField] = useState('');
  const [sending, setSending] = useState(false);
  const change = (event) => { setValues({ ...values, [event.target.name]: event.target.value }); setMessage(''); setInvalidField(''); };
  const submit = async (event) => {
    event.preventDefault();
    if (!values.name.trim()) { setInvalidField('name'); return setMessage('Please enter a valid name.'); }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) { setInvalidField('email'); return setMessage('Please enter a valid email address.'); }
    if (!/^\d{10,}$/.test(values.phone.trim())) { setInvalidField('phone'); return setMessage('Please enter a valid phone number with at least 10 digits.'); }
    setInvalidField('');
    setSending(true);
    try {
      await createContactMessage(values);
      setValues(emptyForm);
      setMessage('Thanks for reaching out. Your message was saved successfully.');
    } catch (problem) {
      console.error('Contact message could not be saved:', problem);
      const code = String(problem?.code || 'unknown').split('/').pop();
      const reason = code === 'permission-denied'
        ? 'Firestore denied this write. Publish the project firestore.rules and make sure they allow public create access to contactMessages.'
        : code === 'failed-precondition' || code === 'not-found'
          ? 'Cloud Firestore may not be created or enabled for the Firebase project in Confige_firebase/config.js.'
          : code === 'unavailable' || code === 'deadline-exceeded'
            ? 'Firebase could not be reached. Check your connection and Firebase service status.'
            : 'Check Firebase setup and the browser developer console for the underlying error.';
      setMessage(`Message not saved (${code}). ${reason} You can also email adeebsaifi7711@gmail.com.`);
      setInvalidField('submit');
    } finally {
      setSending(false);
    }
  };
  const reset = () => { setValues(emptyForm); setMessage(''); setInvalidField(''); };

  return (
    <main className="inner-page contact-page" style={{ '--page-image': `url("${asset('formal.jpg')}")` }}>
      <section className="contact-card">
        <div className="contact-copy">
          <p className="eyebrow">Let’s connect</p><h1>Contact <span>me</span></h1>
          <p>Have a question or an opportunity in mind? Send a note, or reach me directly.</p>
          <a className="contact-email" href="mailto:adeebsaifi7711@gmail.com"><i className="ri-mail-line" /> adeebsaifi7711@gmail.com</a>
          <div className="contact-social"><SocialLinks /></div>
        </div>
        <form className="contact-form" onSubmit={submit} onReset={reset} noValidate>
          <label htmlFor="contact-name">Name <span>*</span></label><input id="contact-name" name="name" value={values.name} onChange={change} placeholder="Your name" autoComplete="name" aria-invalid={invalidField === 'name'} aria-describedby={invalidField === 'name' ? 'form-message' : undefined} required />
          <label htmlFor="contact-email">Email <span>*</span></label><input id="contact-email" name="email" type="email" value={values.email} onChange={change} placeholder="you@example.com" autoComplete="email" aria-invalid={invalidField === 'email'} aria-describedby={invalidField === 'email' ? 'form-message' : undefined} required />
          <label htmlFor="contact-phone">Phone <span>*</span></label><input id="contact-phone" name="phone" type="tel" inputMode="numeric" value={values.phone} onChange={change} placeholder="At least 10 digits" autoComplete="tel" aria-invalid={invalidField === 'phone'} aria-describedby={invalidField === 'phone' ? 'form-message' : undefined} required />
          <label htmlFor="contact-address">Address</label><input id="contact-address" name="address" value={values.address} onChange={change} placeholder="Optional" autoComplete="street-address" />
          {message && <p className={`form-message ${invalidField ? 'is-error' : 'is-success'}`} id="form-message" role={invalidField ? 'alert' : 'status'}>{message}</p>}
          <div className="form-actions"><button className="button button-primary" type="submit" disabled={sending}>{sending ? 'Saving…' : <>Send message <i className="ri-arrow-right-line" /></>}</button><button className="button button-outline" type="reset" disabled={sending}>Reset</button></div>
        </form>
      </section>
    </main>
  );
}
