import { useState, useEffect, useMemo } from 'react';
import EventCard from './components/EventCard';
import { fetchEvents, getCategoryLabel } from './services/eosnetApi';
import './App.css';

// Helper function to extract state/location from event geometry
const extractState = (event) => {
  if (!event.geometry || event.geometry.length === 0) return null;
  
  // Try to get location name from sources if available
  if (event.sources && event.sources.length > 0) {
    const source = event.sources[0];
    if (source.metadata?.location) return source.metadata.location;
  }
  
  // Fallback to coordinates if no location name
  if (event.geometry[0].coordinates) {
    const [lon, lat] = event.geometry[0].coordinates;
    return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
  }
  
  return null;
};

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [groupByState, setGroupByState] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const categories = ['all', 'landslides', 'wildfires', 'severeStorms'];

  const loadEvents = async (category) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEvents(category);
      setEvents(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Failed to fetch Earth events. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique states from events
  const states = useMemo(() => {
    const stateSet = new Set();
    events.forEach((event) => {
      const state = extractState(event);
      if (state) stateSet.add(state);
    });
    return Array.from(stateSet).sort();
  }, [events]);

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events.filter((event) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const eventCategory = event.categories?.[0]?.title?.toLowerCase() || '';
        if (!eventCategory.includes(selectedCategory.toLowerCase())) return false;
      }

      // State filter
      if (selectedState !== 'all') {
        const eventState = extractState(event);
        if (eventState !== selectedState) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const title = event.title?.toLowerCase() || '';
        const description = event.description?.toLowerCase() || '';
        const state = extractState(event)?.toLowerCase() || '';
        if (!title.includes(query) && !description.includes(query) && !state.includes(query)) {
          return false;
        }
      }

      return true;
    });

    // Sort events
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.closeDate || a.createdDate);
        const dateB = new Date(b.closeDate || b.createdDate);
        return dateB - dateA;
      } else if (sortBy === 'category') {
        const catA = a.categories?.[0]?.title || '';
        const catB = b.categories?.[0]?.title || '';
        return catA.localeCompare(catB);
      } else if (sortBy === 'status') {
        return a.closed - b.closed;
      }
      return 0;
    });

    return filtered;
  }, [events, selectedCategory, selectedState, searchQuery, sortBy]);

  // Group events by state
  const groupedEvents = useMemo(() => {
    if (!groupByState) return { 'All Events': filteredAndSortedEvents };

    const grouped = {};
    filteredAndSortedEvents.forEach((event) => {
      const state = extractState(event) || 'Unknown Location';
      if (!grouped[state]) grouped[state] = [];
      grouped[state].push(event);
    });
    return grouped;
  }, [filteredAndSortedEvents, groupByState]);

  // Initial fetch
  useEffect(() => {
    loadEvents(selectedCategory);
  }, []);

  // Fetch when category changes
  useEffect(() => {
    loadEvents(selectedCategory);
  }, [selectedCategory]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadEvents(selectedCategory);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [selectedCategory]);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">🌍 Earth Live Events</h1>
          <p className="app-subtitle">Real-time Earth observation event monitoring</p>
        </div>
      </header>

      {/* Control Panel */}
      <div className="control-panel">
        {/* Search Bar */}
        <div className="search-group">
          <input
            type="text"
            placeholder="🔍 Search events by title, description, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Filters Row 1 */}
        <div className="filters-row">
          <div className="filter-group">
            <label htmlFor="category-filter" className="filter-label">
              Category:
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {getCategoryLabel(cat)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="state-filter" className="filter-label">
              State/Location:
            </label>
            <select
              id="state-filter"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="category-select"
            >
              <option value="all">All Locations</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-filter" className="filter-label">
              Sort by:
            </label>
            <select
              id="sort-filter"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="category-select"
            >
              <option value="date">Date (Newest)</option>
              <option value="category">Category</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        {/* Filters Row 2 */}
        <div className="filters-row">
          <div className="toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={groupByState}
                onChange={(e) => setGroupByState(e.target.checked)}
                className="toggle-checkbox"
              />
              Group by State
            </label>
          </div>

          <button onClick={() => loadEvents(selectedCategory)} className="refresh-button" disabled={loading}>
            {loading ? '⟳ Fetching...' : '⟳ Refresh'}
          </button>

          {lastUpdate && (
            <div className="last-update">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="main-content">
        {error && (
          <div className="error-state">
            <p className="error-icon">⚠️</p>
            <p className="error-message">{error}</p>
            <button onClick={() => loadEvents(selectedCategory)} className="retry-button">
              Try Again
            </button>
          </div>
        )}

        {loading && events.length === 0 && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Fetching Earth data…</p>
          </div>
        )}

        {!loading && filteredAndSortedEvents.length === 0 && !error && (
          <div className="empty-state">
            <p className="empty-icon">🌐</p>
            <p className="empty-message">No active events found</p>
            <p className="empty-subtitle">
              Check back soon or try a different category
            </p>
          </div>
        )}

        {filteredAndSortedEvents.length > 0 && (
          <>
            <div className="events-header">
              <h2>Active Events: {filteredAndSortedEvents.length}</h2>
            </div>
            {groupByState ? (
              <div className="events-grid">
                {Object.entries(groupedEvents).map(([state, stateEvents]) => (
                  <div key={state} className="event-group">
                    <h3 className="group-title">{state}</h3>
                    <div className="events-grid">
                      {stateEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="events-grid">
                {filteredAndSortedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Data provided by{' '}
          <a href="https://eonet.gsfc.nasa.gov/" target="_blank" rel="noopener noreferrer">
            NASA EONET (Earth Observation Natural Event Tracking)
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
