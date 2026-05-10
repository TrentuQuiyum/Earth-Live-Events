import { EVENT_CATEGORIES, getCategoryLabel } from '../services/eonetApi';

export default function DashboardControls({
  filters,
  locations,
  loading,
  lastUpdated,
  onFilterChange,
  onRefresh,
}) {
  const updateFilter = (key) => (event) => {
    const value =
      event.target.type === 'checkbox' ? event.target.checked : event.target.value;

    onFilterChange(key, value);
  };

  return (
    <section className="control-panel" aria-label="Dashboard controls">
      <label className="search-field">
        <span className="sr-only">Search events</span>
        <input
          type="search"
          placeholder="Search by title, category, or location"
          value={filters.searchQuery}
          onChange={updateFilter('searchQuery')}
          className="input"
        />
      </label>

      <div className="filters-row">
        <label className="field">
          <span>Category</span>
          <select
            value={filters.category}
            onChange={updateFilter('category')}
            className="input"
          >
            {EVENT_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {getCategoryLabel(category.id)}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Location</span>
          <select
            value={filters.location}
            onChange={updateFilter('location')}
            className="input"
          >
            <option value="all">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Sort</span>
          <select
            value={filters.sortBy}
            onChange={updateFilter('sortBy')}
            className="input"
          >
            <option value="date">Newest First</option>
            <option value="category">Category</option>
            <option value="status">Status</option>
          </select>
        </label>
      </div>

      <div className="actions-row">
        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={filters.groupByLocation}
            onChange={updateFilter('groupByLocation')}
          />
          <span>Group by location</span>
        </label>

        <button
          type="button"
          className="button"
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>

        {lastUpdated && (
          <p className="last-updated">
            Synced {lastUpdated.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>
    </section>
  );
}
