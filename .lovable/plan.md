# Mapping Page Redesign

## Build
- Replace the blank home screen with the selected Frosted Command Stack mapping dashboard.
- Use Civic Blue shades, Aptos/Segoe UI system typography, compact 12px interface text, subtle borders, and restrained depth.
- Keep the map dominant, place fullscreen directly on the map, remove the active-event banner, and consolidate filters into a clearer toolbar.
- Present only essential metrics, household geotags, evacuation vacancies, dispatched routes, and the map legend.
- Preserve the supplied interaction model: filters, layer toggles, route selection, refresh, and fullscreen.

## Responsive behavior
- Maintain a large map on desktop with a focused right rail.
- Stack summary and detail sections cleanly on smaller screens without overlapping map controls.

## Technical details
- Implement the supplied page as frontend presentation code in the existing TanStack Start app.
- Keep backend concerns untouched; use local display data only because the supplied backend modules are not part of this project.
- Add route-specific metadata and verify the desktop and mobile results in the running preview.
