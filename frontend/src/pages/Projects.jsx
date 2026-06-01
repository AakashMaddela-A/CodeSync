import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProjects, deleteProject } from '../services/projectService.js';
import MainLayout from '../layouts/MainLayout.jsx';
import Button from '../components/Button.jsx';
import Loader from '../components/Loader.jsx';
import Modal from '../components/Modal.jsx';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data.projects || []);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteProject(deleteId);
      toast.success('Project deleted');
      setProjects((prev) => prev.filter((p) => p._id !== deleteId));
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="center-screen" style={{ minHeight: '300px' }}>
          <Loader size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 className="title-lg mb-2">My Projects</h1>
      <p className="subtitle mb-6">Your saved code</p>

      {projects.length === 0 ? (
        <div className="box text-center">
          <p className="text-muted mb-4">No projects yet.</p>
          <Button onClick={() => navigate('/create-room')}>Create Room</Button>
        </div>
      ) : (
        <div className="grid-3">
          {projects.map((project) => (
            <div key={project._id} className="box">
              <h3 className="title" style={{ fontSize: '1rem' }}>
                {project.title}
              </h3>
              <span className="badge">{project.language}</span>
              <p className="text-muted" style={{ margin: '0.5rem 0 1rem' }}>
                {formatDate(project.createdAt)}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button size="sm" onClick={() => navigate(`/projects/${project._id}`)}>
                  Open
                </Button>
                <Button size="sm" variant="danger" onClick={() => setDeleteId(project._id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Project"
        confirmText={deleting ? 'Deleting...' : 'Delete'}
        onConfirm={handleDelete}
        variant="danger"
      >
        <p>Delete this project? This cannot be undone.</p>
      </Modal>
    </MainLayout>
  );
};

export default Projects;
