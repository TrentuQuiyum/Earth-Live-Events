import { useState } from 'react';
import {
  formatEventDate,
  getEventCategoryTitle,
  getEventCoordinates,
  getEventDate,
  getEventLocation,
} from '../utils/eventUtils';

export default function EventCard({ event }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const coordinates = getEventCoordinates(event);
  const eventDate = formatEventDate(getEventDate(event));
  const location = getEventLocation(event);
  const status = event.closed ? 'closed' : 'open';
  const sourceUrl = event.link || event.links?.[0]?.url || event.sources?.[0]?.url;

  return (
    <article className="event-card">
      <button
        type="button"
        className="event-card-toggle"
        onClick={() => setIsExpanded((current) => !current)}
        aria-expanded={isExpanded}
      >
        <span className="event-card-header">
          <span className="event-title">{event.title || 'Untitled event'}</span>
          <span className={`event-status status-${status}`}>{status}</span>
        </span>

        <span className="event-card-meta">
          <span className="event-category">{getEventCategoryTitle(event)}</span>
          <time className="event-date">{eventDate}</time>
        </span>

        <span className="event-location">{location}</span>
      </button>

      {isExpanded && (
        <div className="event-card-details">
          <div>
            <h4>Location</h4>
            <p>{location}</p>
          </div>

          <div>
            <h4>Description</h4>
            <p>{event.description || 'No description available.'}</p>
          </div>

          {coordinates && (
            <div>
              <h4>Precise point</h4>
              <p>
                {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
              </p>
            </div>
          )}

          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="detail-link"
            >
              View EONET source
            </a>
          )}
        </div>
      )}
    </article>
  );
}
