const variants = {
  primary: 'bg-primary-container text-white hover:bg-primary',
  secondary: 'bg-secondary-container text-white hover:brightness-95',
  outline: 'border-2 border-primary-container text-primary-container bg-transparent hover:bg-surface-container-high',
};

export default function Button({
  as = 'a',
  href,
  type,
  variant = 'primary',
  className = '',
  disabled = false,
  onClick,
  children,
}) {
  const base =
    'inline-flex min-h-[44px] items-center justify-center gap-2 rounded px-6 py-3 text-[13px] font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60';
  const classes = `${base} ${variants[variant]} ${className}`;

  if (as === 'button' || type) {
    return (
      <button type={type || 'button'} className={classes} disabled={disabled} onClick={onClick}>
        {children}
      </button>
    );
  }

  return (
    <a href={href} className={classes} onClick={onClick}>
      {children}
    </a>
  );
}
