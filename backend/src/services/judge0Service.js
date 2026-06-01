import axios from 'axios';

const LANGUAGE_IDS = {
  javascript: 63,
  java: 62,
};

export const runCode = async (sourceCode, language) => {
  const languageId = LANGUAGE_IDS[language.toLowerCase()];

  if (!languageId) {
    throw new Error('Unsupported language');
  }

  const baseUrl = process.env.JUDGE0_API_URL || 'https://ce.judge0.com';

  const submissionResponse = await axios.post(
    `${baseUrl}/submissions?base64_encoded=false&wait=true`,
    {
      source_code: sourceCode,
      language_id: languageId,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  );

  const result = submissionResponse.data;

  return {
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    compile_output: result.compile_output || '',
    status: result.status?.description || 'Unknown',
    time: result.time,
    memory: result.memory,
  };
};

export default runCode;
