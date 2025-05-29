import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { createHistoric } from "../api/historic";

interface Props {
  show: boolean;
  onHide: () => void;
  onUploadSuccess: () => void;
}

export default function UploadModal({ show, onHide, onUploadSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select a CSV file.");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const data = await createHistoric(formData);

      if (data.error) {
        alert("Upload failed: " + data.error);
      } else {
        alert("Upload successful!");
        onUploadSuccess();
      }
      onHide();
    } catch (e) {
      alert("Upload failed.");
      console.error(e);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Upload CSV</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="form-control"
          aria-label="Upload CSV file"
          placeholder="Select CSV file"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleUpload}>Upload</Button>
      </Modal.Footer>
    </Modal>
  );
}
