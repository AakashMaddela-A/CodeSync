const Loader = ({ size = 'md', className = '' }) => {
  return <div className={`loader ${size === 'sm' ? 'loader-sm' : ''} ${className}`} />;
};

export default Loader;
