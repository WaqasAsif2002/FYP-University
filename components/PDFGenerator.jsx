"use client"

export const generateBookingPDF = (booking) => {
  // Create PDF content as HTML
  const pdfContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>ParkEase Booking Receipt</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .receipt {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          max-width: 600px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }
        .title {
          font-size: 18px;
          color: #666;
          margin-top: 5px;
        }
        .booking-info {
          margin-bottom: 30px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .label {
          font-weight: bold;
          color: #333;
        }
        .value {
          color: #666;
        }
        .amount-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin: 20px 0;
        }
        .amount {
          font-size: 24px;
          font-weight: bold;
          color: #28a745;
        }
        .qr-section {
          text-align: center;
          margin: 30px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          color: #666;
          font-size: 12px;
        }
        @media print {
          body { background: white; }
          .receipt { box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <div class="logo">ParkEase</div>
          <div class="title">Parking Booking Receipt</div>
        </div>
        
        <div class="booking-info">
          <div class="info-row">
            <span class="label">Booking ID:</span>
            <span class="value">${booking.id}</span>
          </div>
          <div class="info-row">
            <span class="label">Parking Slot:</span>
            <span class="value">${booking.slot}</span>
          </div>
          <div class="info-row">
            <span class="label">Customer Name:</span>
            <span class="value">${booking.userName || "N/A"}</span>
          </div>
          <div class="info-row">
            <span class="label">Car Number:</span>
            <span class="value">${booking.carNumber}</span>
          </div>
          <div class="info-row">
            <span class="label">Start Time:</span>
            <span class="value">${new Date(booking.startDateTime).toLocaleString()}</span>
          </div>
          <div class="info-row">
            <span class="label">End Time:</span>
            <span class="value">${new Date(booking.endDateTime).toLocaleString()}</span>
          </div>
          <div class="info-row">
            <span class="label">Duration:</span>
            <span class="value">${booking.hours} hour(s)</span>
          </div>
          <div class="info-row">
            <span class="label">Payment Method:</span>
            <span class="value">${booking.paymentMethod === "easypaisa" ? "EasyPaisa" : "Cash"}</span>
          </div>
          <div class="info-row">
            <span class="label">Status:</span>
            <span class="value">${booking.status}</span>
          </div>
          <div class="info-row">
            <span class="label">Booking Date:</span>
            <span class="value">${new Date(booking.bookingDate).toLocaleString()}</span>
          </div>
        </div>

        <div class="amount-section">
          <div style="font-size: 16px; margin-bottom: 10px;">Total Amount</div>
          <div class="amount">Rs. ${booking.totalAmount}</div>
        </div>

        <div class="qr-section">
          <h4>QR Code</h4>
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Booking-${booking.id}" alt="QR Code" style="border: 1px solid #ddd; border-radius: 5px;">
          <p style="font-size: 12px; color: #666; margin-top: 10px;">
            Show this QR code at the parking entrance
          </p>
        </div>

        <div class="footer">
          <p>Thank you for choosing ParkEase!</p>
          <p>Location: Millennium Mall, Karachi</p>
          <p>Contact: 03343282332 | waqas.khokhar2002@gmail.com</p>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `

  // Create a new window and print
  const printWindow = window.open("", "_blank")
  printWindow.document.write(pdfContent)
  printWindow.document.close()

  // Wait for content to load then print
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 500)
}
