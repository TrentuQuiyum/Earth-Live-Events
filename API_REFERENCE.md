# NASA EONET API v3 Integration Guide

## Overview
This document explains how the Earth Live Events Dashboard integrates with NASA's EONET (Earth Observation Natural Event Tracking) API v3.

## API Endpoint
```
Base URL: https://eonet.gsfc.nasa.gov/api/v3/events
```

## Request Examples

### 1. Get All Active Events
```http
GET https://eonet.gsfc.nasa.gov/api/v3/events?status=open
```

**Response**:
```json
{
  "events": [
    {
      "id": "EONET_7625",
      "title": "Wildfire in California",
      "description": "Large wildfire detected...",
      "category": [
        {
          "id": "8",
          "title": "Wildfires"
        }
      ],
      "geometry": [
        {
          "coordinates": [-119.5, 37.5],
          "type": "Point"
        }
      ],
      "createdDate": "2026-04-25T10:00:00Z",
      "closeDate": null,
      "links": [
        {
          "rel": "self",
          "url": "https://eonet.gsfc.nasa.gov/events/EONET_7625"
        }
      ]
    }
  ]
}
```

### 2. Filter by Event Category

#### Landslides
```http
GET https://eonet.gsfc.nasa.gov/api/v3/events?status=open&category=landslides
```

#### Wildfires
```http
GET https://eonet.gsfc.nasa.gov/api/v3/events?status=open&category=wildfires
```

#### Severe Storms
```http
GET https://eonet.gsfc.nasa.gov/api/v3/events?status=open&category=severeStorms
```

## Query Parameters

| Parameter | Type | Required | Values |
|-----------|------|----------|--------|
| `status` | string | Yes | `open`, `closed`, or both if omitted |
| `category` | string | No | `landslides`, `wildfires`, `severeStorms`, `floods`, etc. |
| `days` | number | No | Number of days in past (default: all) |
| `limit` | number | No | Max results (default: 300) |

## Event Object Structure

```javascript
{
  // Unique identifier
  id: "EONET_7625",
  
  // Event title/name
  title: "Wildfire in California",
  
  // Optional description
  description: "Details about the event",
  
  // Event categories
  category: [
    {
      id: "8",           // Category ID
      title: "Wildfires" // Category name
    }
  ],
  
  // Geographic coordinates
  geometry: [
    {
      type: "Point" | "Polygon" | "LineString",
      coordinates: [longitude, latitude] // Note: LON, LAT order!
    }
  ],
  
  // When event was detected/created
  createdDate: "2026-04-25T10:00:00Z",
  
  // When event was closed (null if still open)
  closeDate: null | "2026-04-26T15:30:00Z",
  
  // Related links
  links: [
    {
      rel: "self",
      url: "https://eonet.gsfc.nasa.gov/events/EONET_7625"
    },
    {
      rel: "sources",
      url: "https://eonet.gsfc.nasa.gov/sources"
    }
  ]
}
```

## Category IDs & Names

| ID | Category Name | API Parameter |
|----|---------------|---------------|
| 6  | Landslides    | landslides    |
| 8  | Wildfires     | wildfires     |
| 15 | Severe Storms | severeStorms  |
| 9  | Floods        | floods        |
| 19 | Snow/Ice      | snow          |
| 10 | Dust Storms   | dust          |
| 12 | Earthquakes   | earthquakes   |
| 16 | Volcanoes     | volcanoes     |
| 18 | Manmade       | manmade       |
| 17 | Other         | other         |

## Implementation in Dashboard

### API Service (eosnetApi.js)

```javascript
// Fetch events with optional category filter
export const fetchEvents = async (category = 'all') => {
  try {
    const params = new URLSearchParams({
      status: 'open',
    });

    if (category !== 'all' && CATEGORIES[category]) {
      params.append('category', CATEGORIES[category]);
    }

    const response = await fetch(`${BASE_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error('Failed to fetch EONET events:', error);
    throw error;
  }
};
```

### Category Mapping

```javascript
const CATEGORIES = {
  all: null,                    // No category filter
  landslides: 'landslides',    // API parameter
  wildfires: 'wildfires',
  severeStorms: 'severeStorms',
};
```

### Using in App

```javascript
// Fetch all events
const allEvents = await fetchEvents('all');

// Fetch only wildfires
const wildfires = await fetchEvents('wildfires');

// Fetch only severe storms
const storms = await fetchEvents('severeStorms');
```

## Common Response Scenarios

### ✅ Successful Request
```javascript
status: 200 OK
{
  "events": [
    // Array of event objects
  ]
}
```

### ❌ No Events Found
```javascript
status: 200 OK
{
  "events": []
}
```

### ❌ Server Error
```javascript
status: 500 Internal Server Error
// Error response
```

### ❌ Invalid Parameters
```javascript
status: 400 Bad Request
// Error details
```

## Performance Considerations

1. **Caching**: API doesn't return cache headers, so fresh data on each request
2. **Rate Limiting**: No documented rate limits, but be respectful
3. **Response Size**: Typically 10-50 events per request
4. **Latency**: Usually 200-500ms from NASA servers

## Parsing Event Data

### Extract Coordinates
```javascript
// From geometry array
const [longitude, latitude] = event.geometry[0].coordinates;

// Format for display
const coords = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
```

### Format Date
```javascript
const eventDate = new Date(event.closeDate || event.createdDate);
const formatted = eventDate.toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});
```

### Extract Category
```javascript
// Get first category
const category = event.categories[0]?.title || 'Unknown';
```

### Get Status
```javascript
const isOpen = !event.closeDate;
const status = isOpen ? 'Open' : 'Closed';
```

## Error Handling

```javascript
try {
  const events = await fetchEvents('wildfires');
  // Process events
} catch (error) {
  // Network error or server error
  console.error('Failed to fetch events:', error);
  
  // Show error to user
  setError('Failed to fetch Earth events. Please try again.');
}
```

## Testing API Locally

### Browser Console
```javascript
// Test API directly
fetch('https://eonet.gsfc.nasa.gov/api/v3/events?status=open')
  .then(r => r.json())
  .then(d => console.log(d.events))
  .catch(e => console.error(e));
```

### cURL Command
```bash
curl "https://eonet.gsfc.nasa.gov/api/v3/events?status=open"
```

### Python
```python
import requests

response = requests.get('https://eonet.gsfc.nasa.gov/api/v3/events?status=open')
events = response.json()['events']
print(f"Found {len(events)} events")
```

## API Documentation Links

- **Official EONET**: https://eonet.gsfc.nasa.gov
- **API Docs**: https://eonet.gsfc.nasa.gov/api/v3
- **GitHub**: https://github.com/nasaEarthObservatory/EONET

## Troubleshooting

### CORS Errors?
- The EONET API supports CORS from browser requests
- No special headers needed
- If seeing CORS errors, ensure you're using `https://`

### No Events Returned?
- Check `status` parameter is set to `open`
- Verify `category` parameter if filtering
- May genuinely be no active events

### Stale Data?
- API returns live data, no caching
- Always doing fresh request
- Data updated in real-time

### Connection Timeout?
- Check internet connection
- NASA servers might be temporarily unavailable
- Retry with backoff strategy

## Future Enhancements

Potential additions to the dashboard:

1. **Historical Events**: Fetch closed events with date range
2. **Advanced Filtering**: Filter by date, severity, region
3. **Map Integration**: Display events on interactive map
4. **Notifications**: Alert when new events in region
5. **Statistics**: Show event trends over time
6. **Export**: Download event data as CSV/JSON

---

**Last Updated**: April 2026  
**API Version**: v3  
**Status**: Active & Maintained by NASA
