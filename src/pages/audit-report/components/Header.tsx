import React, { useState, useRef, useEffect } from "react";
import { ClipboardCheck, Download, Eye, ChevronDown } from "lucide-react";
import { Application } from "../types";

interface HeaderProps {
  onExport: () => void;
  printView: boolean;
  onPrintViewChange: (printView: boolean) => void;
  application?: Application;
}

const Header: React.FC<HeaderProps> = ({
  onExport,
  printView,
  onPrintViewChange,
  application
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExportJSON = () => {
    // Check if window is available and audit data exists
    if (typeof window === "undefined" || !window.__AUDIT_DATA__) {
      console.error("Audit data not available for export");
      setMenuOpen(false);
      return;
    }

    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(window.__AUDIT_DATA__, null, 2)
    )}`;
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
      "download",
      `audit-report-${new Date().toISOString().split("T")[0]}.json`
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    setMenuOpen(false);
  };

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center">
          <ClipboardCheck className="mr-3 h-8 w-8 text-teal-600" />
          <div>
            <h1 className="text-2xl font-semibold">
              {application?.name || "Loading..."}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onPrintViewChange(!printView)}
            className={`flex items-center rounded-md px-4 py-2 transition-colors ${
              printView
                ? "bg-teal-100 text-teal-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            <Eye className="mr-2 h-4 w-4" />
            Print View
          </button>

          <div className="relative inline-flex" ref={menuRef}>
            <button
              onClick={onExport}
              className="inline-flex items-center whitespace-nowrap rounded-l-md bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Export as PDF
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center rounded-r-md border-l border-teal-500 bg-teal-600 px-2 py-2 text-white transition-colors hover:bg-teal-700"
            >
              <ChevronDown className="h-4 w-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    onClick={handleExportJSON}
                    className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export as JSON
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
