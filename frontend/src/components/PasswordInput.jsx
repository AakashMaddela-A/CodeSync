import { useState } from 'react';

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = '',
  ...props
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="label">
          {label}
          {required && ' *'}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`input ${error ? 'input-error' : ''}`}
          style={{ paddingRight: '2.5rem' }}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="btn-ghost btn-sm"
          style={{
            position: 'absolute',
            right: '4px',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '0.25rem 0.5rem',
          }}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default PasswordInput;
