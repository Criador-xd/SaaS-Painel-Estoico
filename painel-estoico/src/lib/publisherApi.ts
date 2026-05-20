const API_BASE = 'http://localhost:3001/api';

async function request(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${path}`, opts);
  return res.json();
}

export const publisherApi = {
  health: () => request('GET', '/health'),
  getContents: () => request('GET', '/contents'),
  getPreview: (filePath) => request('GET', `/preview?path=${encodeURIComponent(filePath)}`),
  generate: (files) => request('POST', '/generate', { files }),
  getQueue: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request('GET', `/queue?${q}`);
  },
  approve: (id) => request('POST', '/approve', { id }),
  update: (id, fields) => request('POST', '/update', { id, fields }),
  schedule: (id) => request('POST', '/schedule', { id }),
  publishNow: (id) => request('POST', '/publish-now', { id }),
  regenerate: (id) => request('POST', '/regenerate', { id }),
  bulkSchedule: () => request('POST', '/bulk-schedule'),
  delete: (id) => request('POST', '/delete', { id }),
  setContentFolder: (folder) => request('POST', '/set-content-folder', { folder }),
  setPublishedFolder: (folder) => request('POST', '/set-published-folder', { folder }),
  getFolders: () => request('GET', '/folders'),
};