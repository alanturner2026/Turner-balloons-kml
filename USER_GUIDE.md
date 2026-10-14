# Turner Balloons KML Planner — Pilot User Guide

**Alan Turner, Turner Balloons Limited**
**Test version — October 2026**

**Open the planner:** https://alanturner2026.github.io/Turner-balloons-kml/

The planner creates a smaller KML file for an area you choose, starting from **your own authorised, up-to-date nationwide BBAC sensitive-area KML**. The source database is not supplied by this website.

## Before you begin: obtain the latest national KML

1. Sign in to the **BBAC Members Area → Digital Mapping** section.
2. Download the **complete UK / all-country sensitive-area KML**, not an already-filtered local extract. Make sure it is the latest published version available to you.
3. Keep the original file somewhere you can find it — for example, **Files → Downloads** on an iPad, or **Downloads** on a computer.
4. The file supplied in BBAC Digital Mapping is already a **.kml** file; no conversion is needed.
5. Do not upload the national database to a public website, forum or GitHub repository. You only select it from your device **inside the planner**.

The BBAC/source publisher controls availability, permissions and updates. This planner does not download the database automatically or determine whether your copy is the latest.

## Use the planner

1. Open the web link above in **Safari, Chrome or another modern browser**.
2. Under **1. Load original KML**, tap **Choose File / Browse** and select the downloaded national **.kml** file. The planner displays the filename and how many placemarks it found.
3. Under **2. Choose a location**, type the UK postcode you want to use as the **centre** of the selection. The postcode box starts **blank**. An internet connection is needed for postcode lookup.
4. Choose either:
   - **Circle**: drag the radius slider from **10 to 150 miles**, in **5-mile increments**. The number should update as you move it.
   - **Directional rectangle**: choose separate distances **North, East, South and West** of the postcode, in miles. For example, North 20 / East 50 / South 10 / West 10 gives an asymmetric selection.
5. **Optional:** Enter a name under **Saved areas** and press **Save area**. Later, choose that area and press **Load**. This saves the area settings **only in your browser**, not the national KML. You do not need to save an area to generate a KML.
6. Under **3. Generate filtered KML**, leave the filename blank for an automatic name or type a name of your own.
7. Tap **Generate KML**. Wait for the retained-placemark count.
8. Tap **Download filtered KML**. Save it where you can find it, then import it through your own mapping or balloon-navigation application's KML import procedure.
9. **Check the result** against your original data and up-to-date official restrictions, including area boundaries, marker locations, minimum heights, no-landing conditions and any contact information. Do not assume that a successful download means the output has been validated for flight.

### Example without using anyone's personal location

If you enter a postcode and choose a **30-mile circle**, the planner will create a file with a name similar to `POSTCODE_30_miles_radius.kml` (using the postcode that **you** entered). No postcode is preloaded in the software.

## When BBAC publishes an update

Download the new, full national KML from the authorised source. Open the planner, select the **new** file, load your saved flying-area settings if you wish, and **generate a fresh KML**. Existing filtered files are **not** updated automatically.

## Privacy and limitations

- The source KML is processed in your browser and is **not uploaded to a Turner Balloons server**.
- Postcode lookup uses **postcodes.io**, a third-party lookup service. The postcode you type is sent to that service to obtain coordinates.
- A saved area, if you choose to save one, may contain its postcode and is stored **on your device in that browser**. Do not save it if you want no locally stored preset.
- The app preserves the chosen placemark XML and document styling in the generated file, but the filtering and pairing logic is **experimental**. This is not a certified geospatial or flight-safety tool.
- The current version uses approximate distance calculations. Treat boundaries close to the selection edge with particular care.
- **KML only** at present; not GPX, airspace layers or automatic updates.

## If something does not work

If the website appears out of date, reload it in Safari. If old wording remains, open the same website in a new Private tab to check with a fresh session. Avoid clearing browser data as a first step: it can remove your saved areas. An old display alone does not confirm whether the cause is browser caching or deployment.

- **Nothing happens when choosing a file:** Make sure it is a real `.kml` file, and try opening the website directly in Safari instead of inside an app preview.
- **Postcode lookup fails:** Check the postcode, internet connection and try again. The Advanced coordinates fields offer an alternative if you already know the coordinates.
- **No relevant placemarks:** Check the postcode, radius and whether your original KML actually covers that area.
- **Download doesn't appear on iPad:** Look in Safari's Downloads list or **Files → Downloads**.
- **Saved area missing:** Presets are local to one browser/device. Clearing browser data or changing devices can remove them.

## Feedback

This is a test project, and comments from other pilots are welcome. Useful feedback includes: device/browser, which navigation app you use, what happened, and a reproducible example. **Please do not publicly share sensitive BBAC data or private contact details in bug reports.**

**Website:** https://alanturner2026.github.io/Turner-balloons-kml/

**Code and version history:** https://github.com/alanturner2026/Turner-balloons-kml/
