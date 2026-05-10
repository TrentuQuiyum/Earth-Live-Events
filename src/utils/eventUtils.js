export function getEventCategory(event) {
  return event.categories?.[0] ?? null;
}

export function getEventCategoryId(event) {
  return getEventCategory(event)?.id ?? '';
}

export function getEventCategoryTitle(event) {
  return getEventCategory(event)?.title ?? 'Unknown';
}

export function getEventCoordinates(event) {
  const coordinates = event.geometry?.[0]?.coordinates;

  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    return null;
  }

  const [longitude, latitude] = coordinates;
  return { latitude, longitude };
}

function getTitleLocation(event) {
  const titleParts = event.title?.split(',').map((part) => part.trim()) ?? [];

  if (titleParts.length >= 3) {
    return titleParts.slice(-2).join(', ');
  }

  if (titleParts.length === 2) {
    return titleParts[1];
  }

  return '';
}

function getDescriptionLocation(event) {
  const description = event.description?.trim();

  if (!description || description.length > 80) {
    return '';
  }

  const hasUsefulPlaceText = /[a-z]/i.test(description) && !/^\d/.test(description);
  return hasUsefulPlaceText ? description : '';
}

function getCoordinateRegion({ latitude, longitude }) {
  if (latitude <= -55) {
    return 'Southern Ocean / Antarctica';
  }

  if (latitude >= 66) {
    return 'Arctic region';
  }

  if (longitude >= -170 && longitude <= -50 && latitude >= 15 && latitude <= 72) {
    return 'North America';
  }

  if (longitude >= -85 && longitude <= -30 && latitude >= -56 && latitude < 15) {
    return 'South America';
  }

  if (longitude >= -25 && longitude <= 45 && latitude >= 34 && latitude <= 72) {
    return 'Europe';
  }

  if (longitude >= -20 && longitude <= 55 && latitude >= -35 && latitude < 34) {
    return 'Africa';
  }

  if (longitude >= 45 && longitude <= 180 && latitude >= 5 && latitude <= 78) {
    return 'Asia';
  }

  if (longitude >= 110 && longitude <= 180 && latitude >= -50 && latitude < 5) {
    return 'Australia / Oceania';
  }

  if (longitude >= -70 && longitude <= 20) {
    return 'Atlantic Ocean';
  }

  if (longitude >= 20 && longitude <= 120) {
    return 'Indian Ocean';
  }

  return 'Pacific Ocean';
}

export function getEventLocation(event) {
  const sourceLocation = event.sources?.find(
    (source) => source.metadata?.location,
  )?.metadata.location;

  if (sourceLocation) {
    return sourceLocation;
  }

  const titleLocation = getTitleLocation(event);
  if (titleLocation) {
    return titleLocation;
  }

  const descriptionLocation = getDescriptionLocation(event);
  if (descriptionLocation) {
    return descriptionLocation;
  }

  const coordinates = getEventCoordinates(event);
  if (!coordinates) {
    return 'Unknown Location';
  }

  return getCoordinateRegion(coordinates);
}

export function getEventDate(event) {
  const latestGeometryDate = event.geometry
    ?.map((geometry) => geometry.date)
    .filter(Boolean)
    .sort()
    .at(-1);

  return latestGeometryDate || event.closeDate || event.createdDate || null;
}

export function formatEventDate(dateString) {
  if (!dateString) {
    return 'Unknown';
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function eventMatchesSearch(event, query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return [
    event.title,
    event.description,
    getEventLocation(event),
    getEventCategoryTitle(event),
  ]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(normalizedQuery));
}
