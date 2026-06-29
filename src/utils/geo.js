export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

export const AREA_PRESETS = [
  { label: 'Sector 18', lat: 28.5706, lng: 77.3219 },
  { label: 'Sector 62', lat: 28.6271, lng: 77.3726 },
  { label: 'Sector 50', lat: 28.5930, lng: 77.3440 },
  { label: 'Sector 44', lat: 28.5677, lng: 77.3527 },
  { label: 'Sector 76', lat: 28.5755, lng: 77.3826 },
  { label: 'Sector 137', lat: 28.5072, lng: 77.3884 },
  { label: 'Sector 15', lat: 28.5846, lng: 77.3338 },
  { label: 'Sector 35', lat: 28.5689, lng: 77.3241 },
]
