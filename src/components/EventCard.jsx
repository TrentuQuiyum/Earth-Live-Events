import { useState } from 'react';

export default function EventCard({ event }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Unknown';
    }
  };

  const getCategory = () => {
    if (!event.categories || event.categories.length === 0) {
      return 'Unknown';
    }
    return event.categories[0].title || 'Unknown';
  };

  const getCoordinates = () => {
    if (
      event.geometry &&
      event.geometry.length > 0 &&
      event.geometry[0].coordinates
    ) {
      const [lon, lat] = event.geometry[0].coordinates;
      return { lat, lon };
    }
    return null;
  };

  const coordinates = getCoordinates();
  const eventDate = event.closeDate ? formatDate(event.closeDate) : formatDate(event.createdDate);
  const category = getCategory();

  return (
    <div
      className="event-card"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="event-card-header">
        <h3 className="event-title">{event.title}</h3>
        <span className={`event-status status-${event.closed ? 'closed' : 'open'}`}>
          {event.closed ? 'Closed' : 'Open'}
        </span>
      </div>

      <div className="event-card-meta">
        <span className="event-category">{category}</span>
        <span className="event-date">{eventDate}</span>
      </div>

      {isExpanded && (
        <div className="event-card-details">
          <p className="detail-label">Description:</p>
          <p className="detail-text">
            {event.description || 'No description available'}
          </p>

          {coordinates && (
            <div className="detail-coordinates">
              <p className="detail-label">Location:</p>
              <p className="detail-text">
                Lat: {coordinates.lat.toFixed(4)}, Lon: {coordinates.lon.toFixed(4)}
              </p>
            </div>
          )}

          {event.links && event.links.length > 0 && (
            <div className="detail-links">
              <p className="detail-label">Resources:</p>
              <a
                href={event.links[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-link"
              >
                View on EONET →
              </a>
            </div>
          )}
        </div>
      )}

      <div className="event-card-footer">
        <span className="expand-hint">
          {isExpanded ? '▼ Click to collapse' : '▶ Click for details'}
        </span>
      </div>
    </div>
  );
}
