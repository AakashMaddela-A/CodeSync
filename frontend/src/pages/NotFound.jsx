import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';

const NotFound = () => {
  return (
    <div className="page-center">
      <div className="text-center">
        <h1 className="title-lg" style={{ fontSize: '4rem', color: '#3b82f6' }}>
          404
        </h1>
        <h2 className="title mb-2">Page Not Found</h2>
        <p className="text-muted mb-6">This page does not exist.</p>
        <Link to="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
