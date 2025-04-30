import { useState } from 'react';

export default function CSVUploader() {
  const [file, setFile] = useState(null);

  const uploadCSV = async () => {
    if (!file) return alert('Select a CSV file first.');

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('http://localhost:8000/upload-csv/', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();
    alert(result.status);
  };

  return (
    <div>
      <h3>Upload CSV</h3>
      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadCSV}>Upload</button>
    </div>
  );
}
