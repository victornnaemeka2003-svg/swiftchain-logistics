import React from 'react';

function Track() {
  const [trackingNumber, setTrackingNumber] = React.useState('');
  const [shipment, setShipment] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError('');
    setShipment(null);

    try {
      const response = await fetch(`/api/shipments/track/${trackingNumber}`);
      if (!response.ok) {
        throw new Error('Shipment not found');
      }
      const data = await response.json();
      setShipment(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="track-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <h1 className="logo">⚡ SwiftChain Logistics</h1>
          </div>
        </div>
      </nav>

      <div className="container" style={{ padding: '3rem 2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Track Your Shipment</h2>

        <form onSubmit={handleTrack} style={{ maxWidth: '500px', margin: '0 auto 3rem' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number (e.g., SC202407ABCD1234)"
              style={{ flex: 1, padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
            />
            <button type="submit" disabled={loading} style={{
              padding: '0.75rem 1.5rem',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              {loading ? 'Tracking...' : 'Track'}
            </button>
          </div>
        </form>

        {error && <div style={{
          background: '#fee2e2',
          color: '#991b1b',
          padding: '1rem',
          borderRadius: '0.375rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>{error}</div>}

        {shipment && (
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            background: 'white',
            padding: '2rem',
            borderRadius: '0.75rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Tracking Information</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Tracking Number</p>
                <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>{shipment.shipment.tracking_number}</p>
              </div>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Status</p>
                <p style={{
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  color: shipment.shipment.shipment_status === 'delivered' ? '#10b981' : '#2563eb'
                }}>
                  {shipment.shipment.shipment_status.replace('_', ' ').toUpperCase()}
                </p>
              </div>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>From</p>
                <p style={{ fontWeight: '600' }}>{shipment.shipment.origin_city}, {shipment.shipment.origin_country}</p>
              </div>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>To</p>
                <p style={{ fontWeight: '600' }}>{shipment.shipment.destination_city}, {shipment.shipment.destination_country}</p>
              </div>
            </div>

            {shipment.events && shipment.events.length > 0 && (
              <div>
                <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Timeline</h4>
                <div style={{ borderLeft: '2px solid #2563eb', paddingLeft: '1.5rem' }}>
                  {shipment.events.map((event, index) => (
                    <div key={index} style={{ marginBottom: '1.5rem', position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: '-1.95rem',
                        width: '1rem',
                        height: '1rem',
                        background: '#2563eb',
                        borderRadius: '50%',
                        border: '3px solid white',
                        boxShadow: '0 0 0 2px #2563eb'
                      }}></div>
                      <p style={{ fontWeight: '600', color: '#2563eb' }}>{event.status.replace('_', ' ').toUpperCase()}</p>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{event.location}</p>
                      <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{new Date(event.event_date).toLocaleString()}</p>
                      {event.description && <p style={{ marginTop: '0.5rem' }}>{event.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Track;
