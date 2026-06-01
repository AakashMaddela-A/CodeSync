const Card = ({ children, className = '', onClick }) => {
  const baseClass = onClick ? 'menu-card' : 'box';
  return (
    <div onClick={onClick} className={`${baseClass} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
