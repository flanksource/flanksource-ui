import React, { useRef, useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import Header from "./Header";
import ApplicationsSection from "./ApplicationsSection";
import { Application } from "../types";

// Make audit data globally available for export
declare global {
  interface Window {
    __AUDIT_DATA__: Application[];
  }
}

interface AuditReportProps {
  applicationId?: string;
}

const AuditReport: React.FC<AuditReportProps> = ({ applicationId }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [application, setApplication] = useState<Application>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [printView, setPrintView] = useState(() => {
    // Initialize from URL parameter
    const params = new URLSearchParams(window.location.search);
    return params.get("print") === "true";
  });

  useEffect(() => {
    if (!applicationId) {
      setError("No application ID provided");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/application/${applicationId}`, {
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error("Failed to fetch audit data");
        }

        const data = await response.json();
        setApplication(data);
        window.__AUDIT_DATA__ = [data]; // Update global audit data
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching data"
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [applicationId]);

  useEffect(() => {
    // Update URL when print view changes
    const newUrl = new URL(window.location.href);
    if (printView) {
      newUrl.searchParams.set("print", "true");
    } else {
      newUrl.searchParams.delete("print");
    }
    window.history.replaceState({}, "", newUrl.toString());
  }, [printView]);

  const handleExport = async () => {
    if (!reportRef.current) return;

    const opt = {
      margin: 0.25,
      filename: `audit-report-${new Date().toISOString().split("T")[0]}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "landscape"
      }
    };

    try {
      await html2pdf().set(opt).from(reportRef.current).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="audit-report flex min-h-screen flex-col bg-gray-50">
      <Header
        onExport={handleExport}
        printView={printView}
        onPrintViewChange={setPrintView}
        application={application}
      />

      <main
        ref={reportRef}
        className={`container mx-auto flex-grow space-y-6 px-4 py-6 ${printView ? "pdf-export" : ""}`}
      >
        {application && (
          <ApplicationsSection
            key={application.id}
            application={application}
            printView={printView}
          />
        )}
      </main>

      <footer className="border-t border-gray-200 bg-white py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Flanksource • Audit Report
        </div>
      </footer>
    </div>
  );
};

export default AuditReport;
