'use client';

import { useRef, useState } from 'react';

export default function DashboardRegisterForm() {
  const formRef = useRef(null);
  const statusRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = formRef.current;
    if (form.website && form.website.value) return; // honeypot

    setSubmitting(true);
    const formData = new FormData(form);

    try {
      const res = await fetch('/api/register', { method: 'POST', body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.result === 'error') {
        throw new Error(data.error || 'Request failed');
      }

      form.reset(); // restores state's defaultValue ("Karnataka") along with everything else
      setStatus({ kind: 'success', message: 'Registration saved. You can enter the next one below.' });
      requestAnimationFrame(() => {
        statusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    } catch {
      setStatus({ kind: 'error', message: 'Something went wrong saving this registration. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <p className="panel-intro">Full registration details, same as the Disha registration form. Saves to the &quot;School Registrations&quot; table — separate from the website&rsquo;s quick-lead form.</p>

      <form ref={formRef} className="register-form" onSubmit={handleSubmit}>
        <input type="hidden" name="source" value="Dashboard" />

        <div className="field field-wide">
          <label htmlFor="schoolName">School Name <span className="req">*</span></label>
          <input type="text" id="schoolName" name="schoolName" required />
        </div>
        <div className="field field-wide">
          <label htmlFor="schoolAddress">School Address <span className="req">*</span></label>
          <input type="text" id="schoolAddress" name="schoolAddress" required />
        </div>
        <div className="field">
          <label htmlFor="city">City <span className="req">*</span></label>
          <input type="text" id="city" name="city" required />
        </div>
        <div className="field">
          <label htmlFor="district">District <span className="req">*</span></label>
          <input type="text" id="district" name="district" required />
        </div>
        <div className="field">
          <label htmlFor="state">State <span className="req">*</span></label>
          <input type="text" id="state" name="state" defaultValue="Karnataka" required />
        </div>
        <div className="field">
          <label htmlFor="pincode">Pin-code <span className="req">*</span></label>
          <input type="text" id="pincode" name="pincode" inputMode="numeric" pattern="[0-9]{6}" required />
        </div>
        <div className="field">
          <label htmlFor="board">School Board <span className="req">*</span></label>
          <select id="board" name="board" defaultValue="" required>
            <option value="" disabled>Select board</option>
            <option>CBSE</option>
            <option>ICSE</option>
            <option>State Board</option>
            <option>Other</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="branchName">Branch Name</label>
          <input type="text" id="branchName" name="branchName" placeholder="If part of a school group" />
        </div>
        <div className="field">
          <label htmlFor="schoolPhone">School Contact Number <span className="req">*</span></label>
          <input type="tel" id="schoolPhone" name="schoolPhone" required />
        </div>
        <div className="field">
          <label htmlFor="schoolEmail">School Email Id <span className="req">*</span></label>
          <input type="email" id="schoolEmail" name="schoolEmail" required />
        </div>

        <div className="field-wide form-subhead">Principal Details</div>
        <div className="field">
          <label htmlFor="principalName">Principal Name <span className="req">*</span></label>
          <input type="text" id="principalName" name="principalName" required />
        </div>
        <div className="field">
          <label htmlFor="principalPhone">Mobile Number <span className="req">*</span></label>
          <input type="tel" id="principalPhone" name="principalPhone" required />
        </div>
        <div className="field field-wide">
          <label htmlFor="principalEmail">Principal Email Id</label>
          <input type="email" id="principalEmail" name="principalEmail" />
        </div>

        <div className="field-wide form-subhead">Coordinator Details</div>
        <div className="field">
          <label htmlFor="coordinatorName">Coordinator Name <span className="req">*</span></label>
          <input type="text" id="coordinatorName" name="coordinatorName" required />
        </div>
        <div className="field">
          <label htmlFor="coordinatorPhone">Mobile Number <span className="req">*</span></label>
          <input type="tel" id="coordinatorPhone" name="coordinatorPhone" required />
        </div>
        <div className="field field-wide">
          <label htmlFor="coordinatorEmail">Coordinator Email Id</label>
          <input type="email" id="coordinatorEmail" name="coordinatorEmail" />
        </div>

        <div className="field-wide form-subhead">Student Strength <span className="form-subhead-note">(based on the numbers provided, we will issue question papers &amp; OMR sheets)</span></div>
        <div className="field-wide strength-grid">
          <div className="field">
            <label htmlFor="studentsClass1to9">Class 1st&ndash;9th</label>
            <input type="number" id="studentsClass1to9" name="studentsClass1to9" min="0" />
          </div>
          <div className="field">
            <label htmlFor="studentsClass10">Class 10th</label>
            <input type="number" id="studentsClass10" name="studentsClass10" min="0" />
          </div>
          <div className="field">
            <label htmlFor="studentsClass11">Class 11th</label>
            <input type="number" id="studentsClass11" name="studentsClass11" min="0" />
          </div>
          <div className="field">
            <label htmlFor="studentsClass12">Class 12th</label>
            <input type="number" id="studentsClass12" name="studentsClass12" min="0" />
          </div>
        </div>

        <div className="field-wide form-subhead">News First &amp; Vendor Coordination</div>
        <div className="field">
          <label htmlFor="newsFirstPocName">News First POC Name</label>
          <input type="text" id="newsFirstPocName" name="newsFirstPocName" />
        </div>
        <div className="field">
          <label htmlFor="newsFirstPocPhone">Mobile Number</label>
          <input type="tel" id="newsFirstPocPhone" name="newsFirstPocPhone" />
        </div>
        <div className="field">
          <label htmlFor="vendorName">Vendor Name</label>
          <input type="text" id="vendorName" name="vendorName" />
        </div>
        <div className="field">
          <label htmlFor="vendorPhone">Mobile Number</label>
          <input type="tel" id="vendorPhone" name="vendorPhone" />
        </div>

        <div className="field">
          <label htmlFor="testDate">Test Date</label>
          <input type="date" id="testDate" name="testDate" />
          <p className="field-hint">Please fill the test date as provided to the Nava Dishe coordinator.</p>
        </div>

        <div className="field field-wide">
          <label htmlFor="message">Message / Notes</label>
          <textarea id="message" name="message" rows={4} />
        </div>

        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp-field" aria-hidden="true" />

        <div className="field field-wide">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save Registration'}
          </button>
        </div>
      </form>

      {status && (
        <div ref={statusRef} className={`form-status ${status.kind}`} aria-live="polite">
          {status.message}
        </div>
      )}
    </>
  );
}
