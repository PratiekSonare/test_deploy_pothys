"use client"
import React, { useState } from 'react'
import QRCodeScanner from './QRCode'
import HeaderParent from '@/app/cart/HeaderParent'
import '../../styles.css'

const page = () => {
    const [qrResult, setQrResult] = useState("");

  return (
    <div className='overflow-x-hidden w-screen'>
        {/* header */}
        <div className='top-0 header-sdw w-full'>
            <HeaderParent /> 
        </div>

        <div className='my-10'></div>

        <div className='grid grid-cols-2 space-x-10 px-10'>

            {/* barcode scanner */}
            <div className='border-2 border-black rounded-lg p-10'>
                <div className='flex flex-col'>
                    <span className='text3 text-4xl'>Scan QR/Barcode</span>
                    <QRCodeScanner onScan={setQrResult} />
                    {qrResult && 
                        <p>Scanned Result: {qrResult}</p>
                    }
                </div>
            </div>
            
            {/* manual addition of products */}
            <div className='border-2 border-black rounded-lg p-10'>
                <span className='text3 text-4xl'>Add Products Manually</span>

            </div>
        </div>



    </div>
  )
}

export default page