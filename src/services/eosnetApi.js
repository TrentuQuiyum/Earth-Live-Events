const BASE_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events';

const CATEGORIES = {
  all: null,
  landslides: 'landslides',
  wildfires: 'wildfires',
  severeStorms: 'severeStorms',
};

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

export const getCategoryLabel = (category) => {
  const labels = {
    all: 'All Events',
    landslides: 'Landslides',
    wildfires: 'Wildfires',
    severeStorms: 'Severe Storms',
  };
  return labels[category] || category;
};
