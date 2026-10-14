# Turner Balloons KML Planner

A browser-based KML filtering tool, developed by Turner Balloons Limited.

## How to use

1. Open the hosted website in Safari or another modern browser.
2. Choose your **authorised** original sensitive-area .kml file.
3. Type your own UK postcode (the field starts blank), or expand Advanced to enter coordinates.
4. Choose a circular radius (10–150 miles, in five-mile increments) or directional north/east/south/west distances.
5. Select **Generate KML**, then **Download filtered KML**.
6. Check the output before importing it into a navigation app.

Users can optionally save area presets in their own browser. Saved data stays on that device; it is not published to GitHub.

## Privacy

- No personal postcode is hard-coded into the repository or the interface.
- The user's selected KML is processed in their own browser; do **not** publish the full BBAC sensitive-area file in this repository.
- UK postcode lookup uses the third-party API at https://postcodes.io/ and sends the typed postcode to that service.
- The website uses no dedicated application backend.

## GitHub Pages

Publish **index.html** from the root of the default `main` branch in repository **Settings → Pages**, once the repository visibility and hosting policy have been agreed. This repository is currently private; do not change visibility automatically.

## Status

This is an **experimental test build**, not a flight-safety-certified application. Review the BBAC KML output against original boundaries, pins, descriptions, contact information and restrictions before relying on it. Compatibility with the Hot Air app and iPad Safari still needs to be tested.

## Technical overview

HTML + CSS + client-side JavaScript. No Python runtime required. Polygon/radius calculations are approximate in the current build, not a surveyed geodesic solution.
