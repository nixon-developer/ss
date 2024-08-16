"use client";

import { useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/library';

function QRCodeScanner({ onScan }) {
    const [error, setError] = useState(null);

    const handleScan = async () => {
      const codeReader = new BrowserQRCodeReader();
      try {
        const result = await codeReader.decodeOnceFromVideoDevice(undefined, 'video');
        onScan(result.text);
      } catch (err) {
        setError(err);
      }
    };

  return (
    <div>
      <button onClick={handleScan}>Scan QR Code</button>
      {error && <p>{error.message}</p>}
      <video id="video" width="300" height="200"></video>
    </div>
  )
}

export default QRCodeScanner