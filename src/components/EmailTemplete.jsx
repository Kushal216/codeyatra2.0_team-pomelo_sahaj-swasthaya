import React from "react";

const EmailTemplate = ({
  patientName,
  reportDate,
  doctorName,
  downloadLink,
}) => {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        padding: 0,
        backgroundColor: "#f8fafc",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        color: "#334155",
        lineHeight: 1.6,
      }}>
        <div style={{
          maxWidth: "600px",
          margin: "20px auto",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
        }}>
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            padding: "28px 32px",
            textAlign: "center",
            color: "#ffffff",
          }}>
            <div style={{
              width: "56px",
              height: "56px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "14px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <h1 style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: "700",
              letterSpacing: "-0.02em",
            }}>
              Sahaj Swasthya
            </h1>
            <p style={{
              margin: "8px 0 0",
              fontSize: "14px",
              opacity: 0.9,
              fontWeight: "500",
            }}>
              Medical Report Ready
            </p>
          </div>

          {/* Content */}
          <div style={{ padding: "32px" }}>
            {/* Greeting */}
            <h2 style={{
              margin: "0 0 20px",
              fontSize: "22px",
              fontWeight: "700",
              color: "#1e293b",
              lineHeight: 1.3,
            }}>
              Hello {patientName},
            </h2>

            {/* Report Card */}
            <div style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "24px",
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
              }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  backgroundColor: "#dbeafe",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "13px", color: "#64748b", fontWeight: "500" }}>
                    Report Date
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "16px", fontWeight: "700", color: "#1e293b" }}>
                    {reportDate}
                  </p>
                </div>
              </div>

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  backgroundColor: "#dcfce7",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z"/>
                  </svg>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "13px", color: "#64748b", fontWeight: "500" }}>
                    Doctor
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "16px", fontWeight: "700", color: "#1e293b" }}>
                    {doctorName}
                  </p>
                </div>
              </div>
            </div>

            {/* Message */}
            <p style={{
              margin: "0 0 24px",
              fontSize: "16px",
              color: "#475569",
              lineHeight: 1.7,
            }}>
              Your medical report dated <strong style={{ color: "#1e293b" }}>{reportDate}</strong> is now ready for download. Please click the button below to access your PDF report securely.
            </p>

            {/* Download Button */}
            <div style={{ textAlign: "center", margin: "28px 0" }}>
              <a
                href={downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: "600",
                  padding: "14px 32px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)",
                  transition: "background-color 0.2s ease",
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
              >
                Download PDF Report
              </a>
            </div>

            {/* Security Note */}
            <div style={{
              backgroundColor: "#fef3c7",
              border: "1px solid #fcd34d",
              borderRadius: "10px",
              padding: "14px 18px",
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: "2px", flexShrink: 0 }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
              <p style={{
                margin: 0,
                fontSize: "14px",
                color: "#92400e",
                lineHeight: 1.5,
              }}>
                <strong>Secure Link:</strong> This download link is unique to you and will expire in 7 days for your privacy.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            backgroundColor: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
            padding: "24px 32px",
            textAlign: "center",
          }}>
            <p style={{
              margin: "0 0 12px",
              fontSize: "13px",
              color: "#64748b",
            }}>
              Need help? Contact our support team
            </p>
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginBottom: "16px",
            }}>
              <a href="mailto:support@sahajswasthya.com" style={{
                fontSize: "13px",
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: "500",
              }}>
                ✉️ support@sahajswasthya.com
              </a>
              <a href="tel:+97714221119" style={{
                fontSize: "13px",
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: "500",
              }}>
                📞 +977 1-4221119
              </a>
            </div>
            <p style={{
              margin: 0,
              fontSize: "12px",
              color: "#94a3b8",
            }}>
              &copy; {new Date().getFullYear()} Sahaj Swasthya. All rights reserved.
            </p>
            <p style={{
              margin: "8px 0 0",
              fontSize: "11px",
              color: "#cbd5e1",
            }}>
              Mahabauddha, Kathmandu, Nepal
            </p>
          </div>
        </div>
      </body>
    </html>
  );
};

export default EmailTemplate;