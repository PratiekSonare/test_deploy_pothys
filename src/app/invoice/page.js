"use client"
import React, { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useRouter, useSearchParams } from "next/navigation";


  const Invoice = () => {
    const searchParam = useSearchParams();
    const transactionId = searchParam.get("transaction_id");
    const [transactionData, setTransactionData] = useState(null);
    const pdfRef = useRef(null);

    console.log('search paramter: ', searchParam);
    console.log('received transactionData id: ', transactionId);
    
    useEffect(() => {
      if (transactionId) {
        const fetchTransactionData = async () => {
          try {
            const response = await fetch(`http://localhost:5000/api/transactions?transaction_id=${transactionId}`);
            const data = await response.json();
            if (data.success) {
              console.log('data output from request: ', data);
              setTransactionData(data.transaction);
            } else {
              console.error('Error fetching transactionData:', data.message);
            }
          } catch (error) {
            console.error('Fetch error:', error);
          }
        };
  
        fetchTransactionData();
      }
    }, [transactionId]);
  
    const generatePDF = () => {
      const input = pdfRef.current;
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("invoice.pdf");
      }); 
    };
  
    if (!transactionData) {
      return <div>Loading...</div>; // Show loading state while fetching data
    }

    return (
      <div className="p-20 font-serif flex flex-col items-center justify-center gap-10">
        <button onClick={generatePDF} className="rounded-lg" style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "blue", color: "white", border: "none", cursor: "pointer" }}>
          Download Invoice PDF
        </button>
  
        <div ref={pdfRef} style={{ padding: "20px", backgroundColor: "white", width: "800px", margin: "auto", border: "1px solid #ccc" }}>
          <h1 style={{ textAlign: "center" }}><strong>Tax Invoice</strong></h1>
          
          <div className="flex flex-col gap-0 my-2">
            <p className="text-[40px] font-bold">SK Super Market</p>
            <p className="text-sm">151/1 SSM COMPLEX GROUND FLOOR EAST PONDY ROAD, Koliyanur</p>
            <p className="text-sm"><strong>Phone:</strong> +91-6360529172 | <strong>GSTIN:</strong> 33KARPK3018P1Z2</p>
          </div>
          <hr />
  
          <table width="100%" cellPadding="5" style={{ textAlign: "left", width: "100%", border: "1px solid black" }} className="text-xs">
            <thead>
              <tr style={{ borderBottom: "2px solid black", backgroundColor: "#f2f2f2" }}> 
                <th style={{ padding: "10px", fontWeight: "bold", borderRight: "1px solid black" }}>Bill To:</th>
                <th style={{ padding: "10px", fontWeight: "bold" }}>Invoice Details:</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>{transactionData.customer.customer_name}</td>
                <td style={{ padding: "10px" }}>
                  <p>No: {transactionData.transaction_id}</p>
                  <p>Date: {new Date(transactionData.date_time).toLocaleDateString()}</p>
                  <p>Time: {new Date(transactionData.date_time).toLocaleTimeString()}</p>
                  <p>Place of Supply: {transactionData.customer.address}</p>
                </td>
              </tr>
            </tbody>
          </table>
  
          {/* Render Cart Items */}
          <table width="100%" cellPadding="5" style={{ borderCollapse: "collapse", textAlign: "left", width: "100%", border: "1px solid black" }} className="text-xs">
            <thead>
              <tr style={{ borderBottom: "2px solid black", backgroundColor: "#f2f2f2" }}> 
                <th style={{ padding: "5px", fontWeight: "bold", borderRight: "1px solid black" }}>#</th>
                <th style={{ padding: "5px", fontWeight: "bold", borderRight: "1px solid black" }}>Item Name</th>
                <th style={{ padding: "5px", fontWeight: "bold", borderRight: "1px solid black" }}>HSN/SAC/ID</th>
                <th style={{ padding: "5px", fontWeight: "bold", borderRight: "1px solid black" }}>MRP (₹)</th>
                <th style={{ padding: "5px", fontWeight: "bold", borderRight: "1px solid black" }}>Quantity</th>
                <th style={{ padding: "5px", fontWeight: "bold", borderRight: "1px solid black" }}>Discount (₹)</th>
                <th style={{ padding: "5px", fontWeight: "bold" }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {transactionData.cartItems.map((item, index) => (
                <tr key={item._id}>
                  <td style={{ padding: "10px", borderRight: "1px solid black" }}>{index + 1}</td>
                  <td style={{ padding: "10px", borderRight: "1px solid black" }}>{item.name}</td>
                  <td style={{ padding: "10px", borderRight: "1px solid black" }}>{item._id}</td>
                  <td style={{ padding: "10px", borderRight: "1px solid black" }}>₹ {item.price.toFixed(2)}</td>
                  <td style={{ padding: "10px", borderRight: "1px solid black" }}>{item.quantity} {item.unit}</td>
                  <td style={{ padding: "10px", borderRight: "1px solid black" }}>₹ {(item.price - item.discounted_price).toFixed(2)}</td>
                  <td style={{ padding: "10px" }}> ₹ {item.discounted_price.toFixed(2)} </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: "2px solid black", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>
                <td colSpan="6" style={{ padding: "10px", borderRight: "1px solid black" }}>Total</td>
                <td style={{ padding: "10px" }}>₹ {transactionData.total_amount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
  
          {/* Additional sections can be added here as needed */}
            <h4 className="text-md font-semibold my-2">Tax Summary:</h4>
            <table 
            width="100%" 
            cellPadding="5" 
            style={{ 
                borderCollapse: "collapse", 
                textAlign: "left",
                width: "100%",
                border: "1px solid black",
                fontSize: "0.75rem", // text-xs equivalent
            }}
            >
            <thead>
                <tr style={{ borderBottom: "2px solid black", backgroundColor: "#f2f2f2" }}>
                <th style={{ padding: "10px", fontWeight: "bold", borderRight: "1px solid black" }}>HSN/SAC</th>
                <th style={{ padding: "10px", fontWeight: "bold", borderRight: "1px solid black" }}>Taxable Amount (₹)</th>
                <th colSpan="2" style={{ padding: "10px", fontWeight: "bold", borderRight: "1px solid black" }}>CGST</th>
                <th colSpan="2" style={{ padding: "10px", fontWeight: "bold", borderRight: "1px solid black" }}>SGST</th>
                <th style={{ padding: "10px", fontWeight: "bold" }}>Total Tax (₹)</th>
                </tr>
                <tr style={{ borderBottom: "1px solid black", backgroundColor: "#f9f9f9" }}>
                <th style={{ borderRight: "1px solid black" }}></th>
                <th style={{ borderRight: "1px solid black" }}></th>
                <th style={{ padding: "10px", fontWeight: "bold", borderRight: "1px solid black" }}>Rate (%)</th>
                <th style={{ padding: "10px", fontWeight: "bold", borderRight: "1px solid black" }}>Amt (₹)</th>
                <th style={{ padding: "10px", fontWeight: "bold", borderRight: "1px solid black" }}>Rate (%)</th>
                <th style={{ padding: "10px", fontWeight: "bold", borderRight: "1px solid black" }}>Amt (₹)</th>
                <th></th>
                </tr>
            </thead>

            <tbody>
                <tr>
                {/* <td style={{ padding: "10px", borderRight: "1px solid black" }}>8908004097007</td>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>32.50</td>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>2.5</td>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>0.81</td>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>2.5</td>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>0.81</td>
                <td style={{ padding: "10px" }}>1.63</td> */}

                <td style={{ padding: "10px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "10px" }}>NA</td>
                </tr>
                <tr>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "10px" }}>NA</td>
                </tr>
            </tbody>

            <tfoot>
                <tr style={{ borderTop: "2px solid black", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>TOTAL</td>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>109.50</td>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}></td>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>5.43</td>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}></td>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>5.43</td>
                <td style={{ padding: "10px" }}>10.87</td>
                </tr>
            </tfoot>
            </table>


            <table 
            width="100%" 
            cellPadding="5" 
            style={{ 
                borderCollapse: "collapse", 
                textAlign: "left",
                width: "100%",
                fontSize: "0.75rem", // text-xs equivalent
                border: "1px solid black"
            }}
            >
            <tbody>
                <tr style={{ borderBottom: "1px solid black", fontWeight: "bold" }}>
                <td style={{ padding: "5px", width: "50%", borderRight: "1px solid black", backgroundColor: "#f2f2f2" }}>Payment Mode:</td>
                <td style={{ padding: "5px", textAlign: "left" }}>Cash</td>
                </tr>
            </tbody>
            </table>


            <table
            width="100%" 
            cellPadding="5" 
            style={{ 
                borderCollapse: "collapse", 
                textAlign: "left",
                width: "100%",
                fontSize: "0.75rem", // text-xs equivalent
                border: "1px solid black"
            }}
            >
            <thead>
                <tr style={{ borderBottom: "2px solid black", backgroundColor: "#f2f2f2", fontWeight: "bold" }}>
                <th style={{ padding: "5px", borderRight: "1px solid black" }}>Bank Details:</th>
                <th style={{ padding: "5px" }}>For SK Supermarket:</th>
                </tr>
            </thead>
            
            <tbody>
                <tr style={{ borderBottom: "1px solid black" }}>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>
                    <p><strong>Name:</strong> HDFC BANK, BANGALORE - VIJAYANAGAR</p>
                    <p><strong>Account No.:</strong> 50100534953269</p>
                    <p><strong>IFSC Code:</strong> HDFC0000312</p>
                    <p><strong>Account Holder:</strong> PREM KUMAR</p>
                </td>
                
                <td style={{ padding: "10px", height: 'auto', verticalAlign: "bottom" }}>
                    <p style={{  }}>Authorized Signatory / Date</p>
                </td>
                </tr>
            </tbody>
            </table>



            <table 
            width="100%" 
            cellPadding="5" 
            style={{ 
                borderCollapse: "collapse", 
                textAlign: "left", 
                width: "100%", 
                fontSize: "0.75rem", // Equivalent to text-xs
                border: "1px solid black"
            }}
            >
            <thead>
                <tr style={{ borderBottom: "2px solid black", backgroundColor: "#f2f2f2" }}>
                <th style={{ padding: "5px", fontWeight: "bold" }}>Terms & Conditions:</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td style={{ padding: "5px", verticalAlign: "bottom" }}>
                    Thank you for doing business with us!
                </td>
                </tr>
            </tbody>
            </table>

        </div>
      </div>
    );
  };
  
  export default Invoice;