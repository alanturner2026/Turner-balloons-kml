# Turner Balloons KML Planner

A **free personal project** developed by Alan Turner, Turner Balloons Limited and shared with other balloon pilots. **There is no charge, and no plan to sell it.** Feedback and improvement suggestions are welcome.

**[Open the KML Planner](https://alanturner2026.github.io/Turner-balloons-kml/)**

**[Read the Pilot User Guide](USER_GUIDE.md)**

## What it does

Using your own authorised, up-to-date full-country BBAC sensitive-area KML file, enter a UK postcode and choose a circle (10–150 miles, in five-mile increments) or a directional rectangle (independent north, east, south and west distances). The browser prepares a smaller KML you can download and check in your navigation app.

You can optionally save area settings locally in your browser, then reuse them to regenerate a filtered file when the original BBAC file is updated. The planner does not automatically obtain or update the BBAC database.

## Privacy

- The postcode field starts blank. There is no personal postcode in the source.
- The full-country BBAC sensitive-area database is **not** included in this repository and must not be shared publicly without authorisation.
- The selected KML is filtered locally in the browser rather than uploaded to a server.
- Entered postcodes are sent to the third-party lookup service [postcodes.io](https://postcodes.io/) to resolve coordinates.
- If you save a preset, its area settings (possibly including a postcode) are stored **in your own browser only**.

## Important limitations

This is an **experimental planning aid**, not a flight-safety-certified application. Always compare generated output with the original KML and current official restrictions. Feature pairing and approximate selection geometry require further validation against real-world source files, iPad Safari and flight navigation applications.

Current input/output supports **KML**, not KMZ. It uses static HTML/CSS/JavaScript and GitHub Pages; no Python runtime or server backend is required.

## Feedback

Suggestions, bug reports and experience from pilots using different devices or mapping apps are welcome. Please avoid publicly sharing sensitive BBAC details or personal contact information when reporting issues.

## Local development and smoke check

The site has no application dependencies or build step. Serve the repository root with any static HTTP server; for example, run `python3 -m http.server 8000 --bind 127.0.0.1` from this directory. Python is only a convenient development server, not an application requirement.

With Node.js, Playwright and Chromium available, run `node tests/browser-smoke.cjs` in a second terminal. The cloud environment supplies these tools. The check uses `/usr/bin/chromium` and defaults to port 8000; set `PLANNER_TEST_URL` to test another local server. It checks help, small-screen layout, synthetic KML filtering/download, presets, and mocked postcode success/failure. It uses no BBAC data or real postcode. A mocked lookup does not verify access to the real service.

Real authorised BBAC-file validation, iPad Safari file/download behaviour, navigation-app imports and deployment verification remain separate checks.

The header uses the original supplied Jester photo, `Jester - Cornbury - cropped.jpeg` (about 15 KB). To replace it, update the header image source, its dimensions and descriptive alt text. The responsive CSS controls the displayed size without cropping the original photograph.
