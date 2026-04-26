import { useState, useEffect } from 'react';
import EventCard from './components/EventCard';
import { fetchEvents, getCategoryLabel } from './services/eosnetApi';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
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

  // Initial fetch
  useEffect(() => {
    loadEvents(selectedCategory);
  }, []);

  // Fetch when category changes
  useEffect(() => {
    if (selectedCategory !== 'all') {
      loadEvents(selectedCategory);
    } else {
      loadEvents('all');
    }
  }, [selectedCategory]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadEvents(selectedCategory);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [selectedCategory]);

  const handleRefresh = () => {
    loadEvents(selectedCategory);
  };

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
        <div className="filter-group">
          <label htmlFor="category-filter" className="filter-label">
            Filter by Category:
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

        <button onClick={handleRefresh} className="refresh-button" disabled={loading}>
          {loading ? '⟳ Fetching...' : '⟳ Refresh'}
        </button>

        {lastUpdate && (
          <div className="last-update">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="main-content">
        {error && (
          <div className="error-state">
            <p className="error-icon">⚠️</p>
            <p className="error-message">{error}</p>
            <button onClick={handleRefresh} className="retry-button">
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

        {!loading && events.length === 0 && !error && (
          <div className="empty-state">
            <p className="empty-icon">🌐</p>
            <p className="empty-message">No active events found</p>
            <p className="empty-subtitle">
              Check back soon or try a different category
            </p>
          </div>
        )}

        {events.length > 0 && (
          <>
            <div className="events-header">
              <h2>Active Events: {events.length}</h2>
            </div>
            <div className="events-grid">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
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
