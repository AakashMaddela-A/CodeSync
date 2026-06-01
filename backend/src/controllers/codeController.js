import { runCode } from '../services/judge0Service.js';

export const executeCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ success: false, message: 'Code and language are required' });
    }

    const supportedLanguages = ['javascript', 'java'];
    if (!supportedLanguages.includes(language.toLowerCase())) {
      return res.status(400).json({ success: false, message: 'Unsupported language' });
    }

    const result = await runCode(code, language.toLowerCase());

    res.status(200).json({
      success: true,
      output: result.stdout,
      error: result.stderr || result.compile_output,
      status: result.status,
      time: result.time,
      memory: result.memory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Code execution failed',
    });
  }
};
