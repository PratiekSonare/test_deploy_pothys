"use client";
import React, { useState, useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import '../../styles.css';

const QRCodeScanner = ({ onScan }) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const videoRef = React.useRef(null);
  const codeReader = new BrowserMultiFormatReader();
  const scannedValues = useRef([]); // To store scanned values

  useEffect(() => {
    const startScan = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");

        if (videoDevices.length === 0) {
          setError("No camera found.");
          return;
        }

        const backCamera = videoDevices.find(device => device.label.toLowerCase().includes("back")) || videoDevices[0];
        const deviceId = backCamera.deviceId;

        // Start continuous scanning
        codeReader.decodeFromVideoDevice(deviceId, videoRef.current, (result, err) => {
          if (result) {
            if (!scannedValues.current.includes(result.text)) {
              scannedValues.current.push(result.text); // Store unique scanned values
              onScan(result.text); // Call the onScan function with the scanned result
            }
          }
          // if (err && !(err instanceof NotFoundException)) {
          //   console.error(err);
          // }
        });
      } catch (err) {
        setError("Error accessing camera.");
      }
    };

    if (scanning) {
      startScan();
    } else {
      codeReader.reset(); // Stop scanning
    }

    return () => codeReader.reset();
  }, [scanning, onScan]);

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        className='text0 flex flex-row justify-center items-center rounded-lg p-2 bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-[20s] ease-in-out'
        onClick={() => setScanning(prev => !prev)}
      >
        {scanning ? "Stop Scanning" : "Start Scanning"}
      </button> 

      <div className="my-4"></div>

      <video ref={videoRef} className="w-full max-w-md border-2 border-gray-300 rounded-lg" autoPlay />

      {scanning && (
        <div className="flex flex-col items-center mb-4">
          <div className="spinner mt-2"></div>
          <span>Scanning...</span>
        </div>
      )}

      {error && <span style={{ color: "red" }}>{error}</span>}
    </div>
  );
};

export default QRCodeScanner;