import RegisterForm from './RegisterForm';

export default function RegisterSection() {
  return (
    <section id="register" className="section-alt">
      <div className="wrap">
        <div className="register-panel reveal">
          <div className="section-head" style={{ marginBottom: 32 }}>
            <div>
              <div className="eyebrow">Bring Nava Dishe to Your School</div>
              <h2>Register Your<br />School</h2>
            </div>
            <p>Leave your details and our Karnataka bureau team will call you back to complete your school&rsquo;s registration.</p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </section>
  );
}
