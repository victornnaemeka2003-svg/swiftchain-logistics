import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const Reports = () => {
  const [reportType, setReportType] = useState('shipments');
  const [generating, setGenerating] = useState(false);

  const handleGenerateReport = async (type, format) => {
    setGenerating(true);
    try {
      const endpoint = `/reports/${type}/${format}`;
      window.open(`/api${endpoint}`, '_blank');
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setGenerating(false);
    }
  };

  const reports = [
    {
      id: 'shipments',
      title: 'Shipment Report',
      description: 'Generate a detailed report of all shipments',
      icon: '📦'
    },
    {
      id: 'revenue',
      title: 'Revenue Report',
      description: 'Generate revenue analysis and statistics',
      icon: '💰'
    },
    {
      id: 'customer',
      title: 'Customer Report',
      description: 'Generate customer information and statistics',
      icon: '👥'
    },
    {
      id: 'delivery',
      title: 'Delivery Report',
      description: 'Generate delivery performance statistics',
      icon: '🚚'
    },
    {
      id: 'driver',
      title: 'Driver Performance',
      description: 'Generate driver performance metrics',
      icon: '👨‍✈️'
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card key={report.id}>
            <div className="text-4xl mb-4">{report.icon}</div>
            <h3 className="text-xl font-bold mb-2">{report.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{report.description}</p>
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleGenerateReport(report.id, 'pdf')}
                disabled={generating}
              >
                PDF
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleGenerateReport(report.id, 'csv')}
                disabled={generating}
              >
                CSV
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reports;
