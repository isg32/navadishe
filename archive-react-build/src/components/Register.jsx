import { useRef, useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import { TextField, SelectField, TextareaField } from './ui/FormFields.jsx';
import { SCRIPT_URL } from '../config.js';
import Reveal from './Reveal.jsx';

const CITIES = [
  'Belagavi',
  'Hubballi-Dharwad',
  'Kalaburagi',
  'Shivamogga',
  'Udupi',
  'Mangaluru',
  'Mysuru',
  'Bengaluru',
  'Other',
];

const BOARDS = ['CBSE', 'ICSE', 'State Board', 'Other'];
const CLASS_LEVELS = ['Class 10', 'Class 11 & 12', 'Both'];

export default function Register() {
  const formRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  async function handleSubmit(e) {
    e.preventDefault();
    const form = formRef.current;

    // Honeypot: if this hidden field got filled, it's a bot — silently stop
    if (form.website && form.website.value) return;

    setStatus('submitting');

    const formData = new FormData(form);

    try {
      // Apps Script's CORS handling is limited, so we POST as a simple
      // multipart/form-data request in no-cors mode. We can't read the
      // response body, but a resolved fetch (no thrown network error)
      // is a reliable enough signal that the request reached the sheet.
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  }

  return (
    <section id="register" className="bg-surface py-16 md:py-28">
      <div className="mx-auto max-w-container px-6">
        <Reveal>
          <div className="mx-auto max-w-3xl rounded-lg bg-surface-container-low p-6 shadow-level2 md:p-12">
            <h2 className="text-headline-lg-mobile md:text-headline-lg text-on-surface">
              Register Your School
            </h2>
            <p className="mt-3 text-body-lg text-on-surface-variant">
              Tell us about your school and our Karnataka bureau team will get in touch to
              schedule your exam day.
            </p>

            <div
              id="formStatus"
              role="status"
              aria-live="polite"
              hidden={status !== 'success' && status !== 'error'}
              className={`mt-8 rounded-lg p-6 text-body-md ${
                status === 'success'
                  ? 'bg-surface-container text-on-surface'
                  : status === 'error'
                  ? 'bg-error-container text-on-error-container'
                  : ''
              }`}
            >
              {status === 'success' && (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <CheckCircle2 className="h-10 w-10 text-success" strokeWidth={1.75} aria-hidden="true" />
                  <p className="text-body-lg font-semibold text-on-surface">
                    Thank you! Your school's registration has been received. Our team will reach
                    out shortly.
                  </p>
                </div>
              )}
              {status === 'error' && (
                <p>Something went wrong sending your registration. Please try again in a moment.</p>
              )}
            </div>

            {status !== 'success' && (
              <form
                id="registerForm"
                ref={formRef}
                onSubmit={handleSubmit}
                className="mt-8 grid gap-6 sm:grid-cols-2"
                noValidate={false}
              >
                <TextField label="School Name" name="schoolName" required />
                <TextField label="Contact Person" name="contactName" required />
                <TextField label="Designation" name="designation" placeholder="e.g. Principal, Coordinator" />
                <TextField label="Phone Number" name="phone" type="tel" required />
                <TextField label="Email Address" name="email" type="email" required className="sm:col-span-2" />
                <SelectField label="City / District" name="city" options={CITIES} required />
                <SelectField label="Board" name="board" options={BOARDS} required />
                <SelectField
                  label="Participating Class(es)"
                  name="classLevel"
                  options={CLASS_LEVELS}
                  required
                />
                <TextField label="Approx. Number of Students" name="approxStudents" type="number" min="0" />
                <TextareaField label="Message / Notes" name="message" className="sm:col-span-2" />

                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ position: 'absolute', left: '-9999px' }}
                  aria-hidden="true"
                />

                <div className="flex items-start gap-3 sm:col-span-2">
                  <input
                    id="consent"
                    name="consent"
                    type="checkbox"
                    required
                    aria-required="true"
                    className="mt-1 h-5 w-5 shrink-0 rounded border-outline-variant text-primary-container focus-visible:outline-primary-container"
                  />
                  <label htmlFor="consent" className="text-body-md text-on-surface-variant">
                    I agree to be contacted by the News First Nava Dishe team regarding this
                    registration.
                  </label>
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded bg-secondary-container px-6 py-3 text-label-md font-semibold text-white transition-colors duration-200 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {status === 'submitting' ? (
                      'Submitting…'
                    ) : (
                      <>
                        <Send className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                        Submit Registration
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
