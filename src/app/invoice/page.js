'use client';

import React, { Suspense, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

// Dynamically import jsPDF and html2canvas for SSR compatibility
const jsPDF = dynamic(() => import("jspdf"), { ssr: false });
const html2canvas = dynamic(() => import("html2canvas"), { ssr: false });

const Invoice = () => {
  const [transactionData, setTransactionData] = useState(null);
  const pdfRef = useRef(null);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsWrapper setTransactionData={setTransactionData} />
      {transactionData ? (
        <InvoiceContent transactionData={transactionData} pdfRef={pdfRef} />
      ) : (
        <div>Loading...</div>
      )}
    </Suspense>
  );
};

const SearchParamsWrapper = ({ setTransactionData }) => {
  const searchParam = useSearchParams();
  const transactionId = searchParam.get("transaction_id");

  useEffect(() => {
    if (transactionId) {
      const fetchTransactionData = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/transactions?transaction_id=${transactionId}`
          );
          const data = await response.json();
          if (data.success) {
            setTransactionData(data.transaction);
          } else {
            console.error("Error fetching transactionData:", data.message);
          }
        } catch (error) {
          console.error("Fetch error:", error);
        }
      };

      fetchTransactionData();
    }
  }, [transactionId, setTransactionData]);

  return null; // This component does not render anything
};


const InvoiceContent = ({ transactionData, pdfRef }) => {

  const generatePDF = async () => {
    if (!pdfRef.current) return;

    const canvas = await html2canvas(pdfRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("invoice.pdf");
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="p-20 font-serif flex flex-col items-center justify-center gap-10">
        <button
          onClick={generatePDF}
          className="rounded-lg"
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Download Invoice PDF
        </button>

        <div
          ref={pdfRef}
          style={{
            padding: "20px",
            backgroundColor: "white",
            width: "800px",
            margin: "auto",
            border: "1px solid #ccc",
          }}
        >
          <h1 style={{ textAlign: "center" }}>
            <strong>Tax Invoice</strong>
          </h1>

          <div className="flex flex-col gap-0 my-2">
            <p className="text-[40px] font-bold">SK Super Market</p>
            <p className="text-sm">
              151/1 SSM COMPLEX GROUND FLOOR EAST PONDY ROAD, Koliyanur
            </p>
            <p className="text-sm">
              <strong>Phone:</strong> +91-6360529172 | <strong>GSTIN:</strong>{" "}
              33KARPK3018P1Z2
            </p>
          </div>
          <hr />

          <table
            width="100%"
            cellPadding="5"
            style={{
              textAlign: "left",
              width: "100%",
              border: "1px solid black",
            }}
            className="text-xs"
          >
            <thead>
              <tr
                style={{
                  borderBottom: "2px solid black",
                  backgroundColor: "#f2f2f2",
                }}
              >
                <th
                  style={{
                    padding: "10px",
                    fontWeight: "bold",
                    borderRight: "1px solid black",
                  }}
                >
                  Bill To:
                </th>
                <th style={{ padding: "10px", fontWeight: "bold" }}>
                  Invoice Details:
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{ padding: "10px", borderRight: "1px solid black" }}
                >
                  {transactionData.customer.customer_name}
                </td>
                <td style={{ padding: "10px" }}>
                  <p>No: {transactionData.transaction_id}</p>
                  <p>
                    Date:{" "}
                    {new Date(transactionData.date_time).toLocaleDateString()}
                  </p>
                  <p>
                    Time:{" "}
                    {new Date(transactionData.date_time).toLocaleTimeString()}
                  </p>
                  <p>Place of Supply: {transactionData.customer.address}</p>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Render Cart Items */}
          <table
            width="100%"
            cellPadding="5"
            style={{
              borderCollapse: "collapse",
              textAlign: "left",
              width: "100%",
              border: "1px solid black",
            }}
            className="text-xs"
          >
            <thead>
              <tr
                style={{
                  borderBottom: "2px solid black",
                  backgroundColor: "#f2f2f2",
                }}
              >
                <th
                  style={{
                    padding: "5px",
                    fontWeight: "bold",
                    borderRight: "1px solid black",
                  }}
                >
                  #
                </th>
                <th
                  style={{
                    padding: "5px",
                    fontWeight: "bold",
                    borderRight: "1px solid black",
                  }}
                >
                  Item Name
                </th>
                <th
                  style={{
                    padding: "5px",
                    fontWeight: "bold",
                    borderRight: "1px solid black",
                  }}
                >
                  HSN/SAC/ID
                </th>
                <th
                  style={{
                    padding: "5px",
                    fontWeight: "bold",
                    borderRight: "1px solid black",
                  }}
                >
                  MRP (₹)
                </th>
                <th
                  style={{
                    padding: "5px",
                    fontWeight: "bold",
                    borderRight: "1px solid black",
                  }}
                >
                  Quantity
                </th>
                <th
                  style={{
                    padding: "5px",
                    fontWeight: "bold",
                    borderRight: "1px solid black",
                  }}
                >
                  Discount (₹)
                </th>
                <th style={{ padding: "5px", fontWeight: "bold" }}>
                  Amount (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              {transactionData.cartItems.map((item, index) => (
                <tr key={item._id}>
                  <td style={{ padding: "10px", borderRight: "1px solid black" }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: "10px", borderRight: "1px solid black" }}>
                    {item.name}
                  </td>
                  <td style={{ padding: "10px", borderRight: "1px solid black" }}>
                    {item._id}
                  </td>
                  <td style={{ padding: "10px", borderRight: "1px solid black" }}>
                    ₹ {item.price.toFixed(2)}
                  </td>
                  <td style={{ padding: "10px", borderRight: "1px solid black" }}>
                    {item.quantityType}
                  </td>
                  <td style={{ padding: "10px", borderRight: "1px solid black" }}>
                    ₹ {(item.price - item.discounted_price).toFixed(2)}
                  </td>
                  <td style={{ padding: "10px" }}>
                    ₹ {item.discounted_price.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tax Summary */}
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
              {/* Example Tax Data */}
              <tr>
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
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "10px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "10px" }}>NA</td>
              </tr>
            </tfoot>
          </table>

          {/* Payment Mode */}
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

          {/* Bank Details */}
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
                  <p style={{}}>Authorized Signatory / Date</p>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Terms & Conditions */}
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
    </Suspense>
  );
};

export default Invoice;
