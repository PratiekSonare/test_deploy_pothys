"use client"
import React from 'react'
import { useState, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

const QRCodeScanner = ({ onScan }) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    const startScan = async () => {
      try {
        const videoDevices = await codeReader.getVideoInputDevices();
        if (videoDevices.length === 0) {
          setError("No camera found.");
          return;
        }

        setScanning(true);
        codeReader.decodeFromInputVideoDevice(
          videoDevices[0].deviceId,
          "video"
        ).then(result => {
          onScan(result.text);
          codeReader.reset(); // Stop scanning after detecting one QR code
          setScanning(false);
        }).catch((err) => setError("Scanning failed. Try again."));
      } catch (err) {
        setError("Error accessing camera.");
      }
    };

    startScan();

    return () => codeReader.reset();
  }, [onScan]);

  return (
    <div>
      <video id="video" width="100%" height="300px" />
      {scanning && <p>Scanning...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default QRCodeScanner;
