const inputClasses =
  'w-full min-h-[44px] rounded border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant/60 transition-shadow duration-150 focus:border-2 focus:border-primary-container focus:outline-none focus:shadow-[0_0_0_4px_rgba(20,35,63,0.15)]';

const labelClasses = 'block text-label-md font-medium text-on-surface';

export function TextField({ label, name, type = 'text', required = false, className = '', ...props }) {
  return (
    <div className={className}>
      <label htmlFor={name} className={labelClasses}>
        {label}
        {required && <span className="text-error"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        aria-required={required}
        className={`mt-2 ${inputClasses}`}
        {...props}
      />
    </div>
  );
}

export function SelectField({ label, name, options, required = false, className = '', ...props }) {
  return (
    <div className={className}>
      <label htmlFor={name} className={labelClasses}>
        {label}
        {required && <span className="text-error"> *</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        aria-required={required}
        defaultValue=""
        className={`mt-2 ${inputClasses}`}
        {...props}
      >
        <option value="" disabled>
          Select {label.toLowerCase()}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export function TextareaField({ label, name, required = false, className = '', ...props }) {
  return (
    <div className={className}>
      <label htmlFor={name} className={labelClasses}>
        {label}
        {required && <span className="text-error"> *</span>}
      </label>
      <textarea
        id={name}
        name={name}
        required={required}
        aria-required={required}
        rows={4}
        className={`mt-2 ${inputClasses}`}
        {...props}
      />
    </div>
  );
}
