"use client";
import React, { useState, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import '../../styles.css'

const QRCodeScanner = ({ onScan }) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const videoRef = React.useRef(null);
  const codeReader = new BrowserMultiFormatReader();

  useEffect(() => {
    const startScan = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");

        if (videoDevices.length === 0) {
          setError("No camera found.");
          return;
        }

        const deviceId = videoDevices[0].deviceId;

        codeReader.decodeOnceFromVideoDevice(deviceId, videoRef.current)
          .then(result => {
            onScan(result.text);
            handleAddToCart(result.text); // Call handleAddToCart with the scanned barcode
            setScanning(false);
          })
          .catch(() => setError("Scanning failed. Try again."));
      } catch (err) {
        setError("Error accessing camera.");
      }
    };

    if (scanning) {
      startScan();
    }

    return () => codeReader.reset();
  }, [scanning, onScan]);

  const handleAddToCart = async (barcode) => {
    try {
      const response = await fetch(`/api/products?barcode=${barcode}`); // Adjust the API endpoint as needed
      if (!response.ok) {
        throw new Error("Failed to fetch product data.");
      }
      const productData = await response.json();
      console.log("Product data:", productData);
      // Here you can add the product to the cart or handle it as needed
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">

      <button
        className='text0 flex flex-row justify-center items-center rounded-lg p-2 bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-[20s] ease-in-out'
        onClick={() => setScanning(prev => !prev)}
      >
        {scanning ? "Stop Scanning" : "Start Scanning"}
      </button> 

      {scanning && 
        <video ref={videoRef} width="50%" height="auto" />
      }

      {scanning && <span>Scanning...</span>}

      {error && <span style={{ color: "red" }}>{error}</span>}

    </div>
  );
};

export default QRCodeScanner;