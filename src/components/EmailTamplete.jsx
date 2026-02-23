import React from "react";

const EmailTemplate = ({
  patientName,
  reportDate,
  doctorName,
  downloadLink,
}) => {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-800 font-sans">
        <div className="max-w-lg mx-auto my-10 bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white text-center p-6 text-2xl font-bold">
            Sahaj Swasthya Report
          </div>

          {/* Content */}
          <div className="p-8 space-y-4">
            <h2 className="text-blue-600 text-xl font-semibold">
              Hello {patientName},
            </h2>
            <p>
              Your medical report dated <strong>{reportDate}</strong> is now
              ready.
            </p>
            <p>
              Doctor: <strong>{doctorName}</strong>
            </p>
            <p>Click the button below to download your PDF report securely:</p>
            <a
              href={downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Download PDF
            </a>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 text-center text-sm text-gray-500 p-4">
            &copy; {new Date().getFullYear()} Sahaj Swasthya. All rights
            reserved.
          </div>
        </div>
      </body>
    </html>
  );
};

export default EmailTemplate;
