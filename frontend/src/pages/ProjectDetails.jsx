import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import { getProject, updateProject } from '../services/projectService.js';
import { runCode } from '../services/codeService.js';
import MainLayout from '../layouts/MainLayout.jsx';
import Button from '../components/Button.jsx';
import Loader from '../components/Loader.jsx';
import { LANGUAGES } from '../utils/constants.js';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProject(id);
        setProject(data.project);
        setCode(data.project.code);
        setLanguage(data.project.language);
        setTitle(data.project.title);
      } catch {
        toast.error('Project not found');
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProject(id, { title, language, code });
      toast.success('Saved');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput('Running...');
    try {
      const result = await runCode(code, language);
      let text = '';
      if (result.output) text += result.output;
      if (result.error) text += (text ? '\n' : '') + result.error;
      if (!text) text = `Status: ${result.status}`;
      setOutput(text);
    } catch {
      setOutput('Execution failed');
    } finally {
      setRunning(false);
    }
  };

  const monacoLanguage = LANGUAGES.find((l) => l.value === language)?.monaco || 'javascript';

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
      <Button variant="ghost" size="sm" onClick={() => navigate('/projects')} className="mb-4">
        ← Back
      </Button>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input mb-2"
        style={{ maxWidth: '400px', fontSize: '1.125rem', fontWeight: 600 }}
      />
      <p className="text-muted mb-4">
        <span className="badge">{project?.language}</span>
        {' · '}
        Created {new Date(project?.createdAt).toLocaleDateString()}
      </p>

      <div className="box" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="toolbar">
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input" style={{ width: 'auto' }}>
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          <Button variant="success" size="sm" onClick={handleRun} disabled={running}>
            Run
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>

        <div style={{ height: '400px' }}>
          <Editor
            height="100%"
            language={monacoLanguage}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true }}
          />
        </div>

        <div className="output-box">
          <p className="text-muted mb-2">Output</p>
          <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{output || 'Run code to see output...'}</pre>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProjectDetails;
