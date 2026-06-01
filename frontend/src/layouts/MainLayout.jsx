import Navbar from '../components/Navbar.jsx';

const MainLayout = ({ children }) => {
  return (
    <div className="page">
      <Navbar />
      <main className="container">{children}</main>
    </div>
  );
};

export default MainLayout;
