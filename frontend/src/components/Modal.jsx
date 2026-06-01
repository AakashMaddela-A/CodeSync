import Button from './Button.jsx';

const Modal = ({ isOpen, onClose, title, children, confirmText = 'Confirm', onConfirm, variant = 'primary' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="title mb-2">{title}</h3>
        <div className="text-muted mb-4">{children}</div>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          {onConfirm && (
            <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
