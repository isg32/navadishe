import RegisterForm from './RegisterForm';

export default function RegisterSection() {
  return (
    <section className="section register" id="register">
      <div className="wrap">
        <div className="section-head center reveal">
          <div className="eyebrow">Bring Nava Dishe to Your School</div>
          <h2>Register Your School</h2>
          <p>Leave your details and our Karnataka bureau team will call you back to complete your school&rsquo;s registration.</p>
        </div>
        <div className="register-panel reveal">
          <RegisterForm />
        </div>
      </div>
    </section>
  );
}
