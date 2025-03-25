"use client"
import React, { useState } from 'react'
import QRCodeScanner from './QRCode'
import HeaderParent from '@/app/cart/HeaderParent'

const page = () => {
    const [qrResult, setQrResult] = useState("");

  return (
    <div className='overflow-x-hidden w-screen'>
        {/* header */}
        <div className='top-0 header-sdw w-full'>
            <HeaderParent /> 
        </div>

        <div>
            <h2>Scan a QR Code</h2>
            <QRCodeScanner onScan={setQrResult} />
            {qrResult && <p>Scanned Result: {qrResult}</p>}
        </div>
    </div>
  )
}

export default page