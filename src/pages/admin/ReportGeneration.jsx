import React, { useState } from 'react';
import '../../styles/admin/Reports.css';

function ReportGeneration() {
  const [reportType, setReportType] = useState('shipments');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleGenerateReport = async (format) => {
    if (!dateFrom || !dateTo) {
      alert('Please select date range');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch(
        `/api/reports/generate?type=${reportType}&format=${format}&from=${dateFrom}&to=${dateTo}`,
        { credentials: 'include' }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType}-report.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      alert('Error generating report: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="management-container">
      <h1>Report Generation</h1>

      <div className="report-options">
        <div className="report-section">
          <h2>Generate Reports</h2>
          <div className="form-group">
            <label>Report Type</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="shipments">Shipment Report</option>
              <option value="customers">Customer Report</option>
              <option value="revenue">Revenue Report</option>
              <option value="delivery">Delivery Report</option>
            </select>
          </div>

          <div className="date-range">
            <div className="form-group">
              <label>From Date</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="form-group">
              <label>To Date</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>

          <div className="export-buttons">
            <button
              onClick={() => handleGenerateReport('pdf')}
              disabled={generating}
              className="btn btn-primary"
            >
              📄 Export as PDF
            </button>
            <button
              onClick={() => handleGenerateReport('csv')}
              disabled={generating}
              className="btn btn-secondary"
            >
              📊 Export as CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportGeneration;
