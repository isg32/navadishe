'use client';

import { useRef, useState } from 'react';

export default function RegisterForm() {
  const formRef = useRef(null);
  const statusRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { kind: 'success' | 'error', message }
  const [hidden, setHidden] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = formRef.current;

    // Honeypot: if this hidden field got filled, it's a bot — silently stop
    if (form.website && form.website.value) return;

    setSubmitting(true);
    const formData = new FormData(form);

    try {
      const res = await fetch('/api/register', { method: 'POST', body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.result === 'error') {
        throw new Error(data.error || 'Request failed');
      }

      setHidden(true);
      setStatus({
        kind: 'success',
        message: "Thank you! Your school's registration has been received. Our team will reach out shortly.",
      });
      requestAnimationFrame(() => {
        statusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    } catch {
      setStatus({
        kind: 'error',
        message: 'Something went wrong sending your registration. Please try again in a moment.',
      });
      setSubmitting(false);
    }
  }

  return (
    <>
      {!hidden && (
        <form ref={formRef} className="register-form" onSubmit={handleSubmit}>
          <input type="hidden" name="source" value="Website" />

          <div className="field field-wide">
            <label htmlFor="name">Name <span className="req">*</span></label>
            <input type="text" id="name" name="name" required aria-required="true" />
          </div>
          <div className="field">
            <label htmlFor="district">District <span className="req">*</span></label>
            <input type="text" id="district" name="district" required aria-required="true" />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone Number <span className="req">*</span></label>
            <input type="tel" id="phone" name="phone" required aria-required="true" />
          </div>

          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp-field" aria-hidden="true" />

          <div className="field field-wide consent-field">
            <input type="checkbox" id="requestCallback" name="requestCallback" />
            <label htmlFor="requestCallback">Request a callback from our Karnataka bureau team.</label>
          </div>

          <div className="field field-wide">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </form>
      )}

      {status && (
        <div ref={statusRef} className={`form-status ${status.kind}`} aria-live="polite">
          {status.message}
        </div>
      )}
    </>
  );
}
