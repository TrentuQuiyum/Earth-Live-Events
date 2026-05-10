import { useCallback, useEffect, useMemo, useState } from 'react';
import DashboardControls from './components/DashboardControls';
import EventCard from './components/EventCard';
import StateMessage from './components/StateMessage';
import { fetchEonetEvents } from './services/eonetApi';
import {
  eventMatchesSearch,
  getEventCategoryId,
  getEventCategoryTitle,
  getEventDate,
  getEventLocation,
} from './utils/eventUtils';
import './App.css';

const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000;

const INITIAL_FILTERS = {
  category: 'all',
  location: 'all',
  searchQuery: '',
  sortBy: 'date',
  groupByLocation: false,
};

function sortEvents(events, sortBy) {
  return [...events].sort((firstEvent, secondEvent) => {
    if (sortBy === 'category') {
      return getEventCategoryTitle(firstEvent).localeCompare(
        getEventCategoryTitle(secondEvent),
      );
    }

    if (sortBy === 'status') {
      return Number(Boolean(firstEvent.closed)) - Number(Boolean(secondEvent.closed));
    }

    return new Date(getEventDate(secondEvent) || 0) - new Date(getEventDate(firstEvent) || 0);
  });
}

function groupEventsByLocation(events) {
  return events.reduce((groups, event) => {
    const location = getEventLocation(event);
    const locationEvents = groups[location] ?? [];

    return {
      ...groups,
      [location]: [...locationEvents, event],
    };
  }, {});
}

function getFreshnessLabel(date) {
  if (!date) {
    return 'Recent EONET activity';
  }

  const elapsedMs = Date.now() - date.getTime();
  const elapsedMinutes = Math.max(1, Math.round(elapsedMs / 60000));

  if (elapsedMinutes < 60) {
    return `Updated ${elapsedMinutes} min ago`;
  }

  const elapsedHours = Math.round(elapsedMinutes / 60);
  return `Updated ${elapsedHours} hr ago`;
}

export default function App() {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadEvents = useCallback(
    async ({ signal } = {}) => {
      setLoading(true);
      setError('');

      try {
        const nextEvents = await fetchEonetEvents(filters.category, { signal });
        setEvents(nextEvents);
        setLastUpdated(new Date());
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError('Unable to load live Earth event data. Please try again.');
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [filters.category],
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategoryEvents() {
      try {
        const nextEvents = await fetchEonetEvents(filters.category, {
          signal: controller.signal,
        });
        setEvents(nextEvents);
        setLastUpdated(new Date());
        setError('');
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError('Unable to load live Earth event data. Please try again.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCategoryEvents();

    const refreshTimer = window.setInterval(() => {
      loadEvents({ signal: controller.signal });
    }, AUTO_REFRESH_INTERVAL);

    return () => {
      controller.abort();
      window.clearInterval(refreshTimer);
    };
  }, [filters.category, loadEvents]);

  const locations = useMemo(() => {
    return [...new Set(events.map(getEventLocation))].sort();
  }, [events]);

  const visibleEvents = useMemo(() => {
    const filteredEvents = events.filter((event) => {
      const categoryMatches =
        filters.category === 'all' || getEventCategoryId(event) === filters.category;
      const locationMatches =
        filters.location === 'all' || getEventLocation(event) === filters.location;

      return (
        categoryMatches &&
        locationMatches &&
        eventMatchesSearch(event, filters.searchQuery)
      );
    });

    return sortEvents(filteredEvents, filters.sortBy);
  }, [events, filters]);

  const groupedEvents = useMemo(() => {
    return filters.groupByLocation
      ? groupEventsByLocation(visibleEvents)
      : { 'All Events': visibleEvents };
  }, [filters.groupByLocation, visibleEvents]);

  const updateFilter = (key, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
      ...(key === 'category' ? { location: 'all' } : {}),
    }));

    if (key === 'category') {
      setLoading(true);
      setError('');
    }
  };

  const hasEvents = visibleEvents.length > 0;
  const showInitialLoading = loading && events.length === 0 && !error;
  const freshnessLabel = getFreshnessLabel(lastUpdated);

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <p className="eyebrow">NASA EONET v3</p>
          <h1>Earth Live Events</h1>
          <p>Active natural event monitoring from NASA's Earth Observatory.</p>
        </div>
        <div className="status-summary" aria-label="Dashboard status">
          <span>{events.length}</span>
          <small>recent open events</small>
        </div>
      </header>

      <DashboardControls
        filters={filters}
        locations={locations}
        loading={loading}
        lastUpdated={lastUpdated}
        onFilterChange={updateFilter}
        onRefresh={loadEvents}
      />

      <main className="main-content">
        {error && (
          <StateMessage
            tone="error"
            title="Connection interrupted"
            message={error}
            actionLabel="Try again"
            onAction={loadEvents}
          />
        )}

        {showInitialLoading && (
          <StateMessage title="Loading live events" message="Contacting NASA EONET..." />
        )}

        {!loading && !error && !hasEvents && (
          <StateMessage
            title="No events match these filters"
            message="Adjust the search, category, or location to broaden the view."
          />
        )}

        {!error && hasEvents && (
          <section className="events-section" aria-live="polite">
            <div className="events-header">
              <div>
                <p className="eyebrow">Live Feed</p>
                <h2>{visibleEvents.length} active events</h2>
                <p>{freshnessLabel} from a 30-day recent-events window.</p>
              </div>
              {loading && <span className="sync-pill">Syncing</span>}
            </div>

            <div className="event-groups">
              {Object.entries(groupedEvents).map(([location, locationEvents]) => (
                <section className="event-group" key={location}>
                  {filters.groupByLocation && (
                    <h3>
                      {location}
                      <span>{locationEvents.length}</span>
                    </h3>
                  )}
                  <div className="events-grid">
                    {locationEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="app-footer">
        Data from{' '}
        <a href="https://eonet.gsfc.nasa.gov/" target="_blank" rel="noreferrer">
          NASA EONET
        </a>
      </footer>
    </div>
  );
}
