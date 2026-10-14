# PROJECT BRIEF — Turner Balloons KML Planner
**Handover to Codex | 14 October 2026 | Owner: Alan Turner, Turner Balloons Limited**

> **Read this entire brief, the existing `index.html`, `README.md` and `USER_GUIDE.md` before altering code. This file records the project goals, agreed constraints, known limitations, and outstanding work. Do not assume that a requested feature is implemented just because it is described here.**
>
> **Project scope:** `alanturner2026/Turner-balloons-kml` only. Do not change, access or depend on any Joinerysoft repositories, products, deployment pipelines, servers or databases.

## 1. What this project is and why it exists

Alan is a hot-air-balloon pilot. He originally made this tool **for his own use**; he intends to share it **free of charge** with other pilots and welcomes practical feedback and suggested improvements. There are **no plans to sell it**.

His usual flying area falls between **three separate BBAC sensitive-area zones**. Loading all three zones into the **Hot Air** balloon navigation application means loading hundreds of sensitive-area records irrelevant to a given flight. Hot Air became frustratingly slow, and even buying a newer iPad did not solve the problem. He wanted a quick way to take the **complete, up-to-date national BBAC sensitive-area KML file** and extract only the records around the place he will actually fly.

With this planner he can enter a postcode for **any new flying location**, select a radius or directional extent, and download a **smaller local KML** for import into Hot Air (or another app supporting KML). When BBAC publishes a fresh national file, he wants to repeat the process using that current source, reusing saved area presets where helpful.

This motivation should appear **succinctly on the website**, ideally beneath the hero/header as a friendly "Why I made this" section. It should also feature in copy intended for ballooning forums. Do **not** reveal or pre-fill the owner's home postcode.

## 2. Repository and deployment

- Repo: https://github.com/alanturner2026/Turner-balloons-kml
- Site: https://alanturner2026.github.io/Turner-balloons-kml/
- GitHub owner: `alanturner2026`; repo is **public**.
- Deployment: static GitHub Pages using the `main` branch root.
- Existing implementation is a largely self-contained **`index.html`** (HTML, CSS, browser JavaScript), with documentation in Markdown.
- No Python runtime, backend, hosting fees, authentication, database or native iPad app should be required.
- Primary platforms: **Safari on iPad**, plus desktop browsers, iPhone, Android and Mac.
- Keep the public URL and current basic functionality working during improvements. Prefer small reviewed changes and test them before release.
- The user has already opened the website and liked the initial visual layout. Do not needlessly redesign the entire experience.

## 3. Data provenance, privacy and publication — hard requirements

1. **The national BBAC sensitive-area file MUST NOT be committed to GitHub, included in the website assets, automatically bundled in the app, uploaded to a server, or shared with forum users.** The owner specifically decided that pilots should obtain it themselves. Unless explicit redistribution permission from BBAC is established, never add an automatic preloaded country dataset.
2. The source is the **BBAC Members Area → Digital Mapping → latest full-country sensitive-area KML**. It is a **`.kml` file**, already in the correct format. **Do not instruct users to download KMZ, convert KMZ, or install a ZIP reader.** Previous discussions mistakenly introduced KMZ; that has been corrected in `index.html` and `USER_GUIDE.md`. Keep UI/help text KML-only.
3. Each pilot selects their **own authorised current** national KML using the local file picker. Parse/filter/export in the browser. Don't transmit source contents to a Turner Balloons server. No sensitive-area contact details should be embedded in public issue reports or sample data.
4. **No real/personal postcode is to be hard-coded or shown as an example or pre-filled value.** The postcode input must start blank; use generic placeholders. Avoid using the owner's home location in screenshots, commits, guide examples or public tests.
5. Typing a postcode currently makes a third-party lookup to **postcodes.io**; make this privacy exception clear. Optional saved area presets are held in browser localStorage and may include the user's postcode. These are local only.
6. Preserve original **KML information and content** within retained features: names, original point coordinates, polygon boundaries (do not crop/clip), styles/colours, feature IDs, altitude/height restrictions (e.g. 500/1,000 ft), no-landing conditions, contact details, descriptions and any relevant extended data. Document and test any deviations.
7. The planner is a **planning aid, not a certified flight safety system**. Users must verify output against original national KML and official up-to-date flight information.

## 4. Existing UI and intended user journey

Expected steps on the live site:
1. **Load national KML:** guide user to BBAC Members Area → Digital Mapping to download the latest full-country **KML**. User selects local `.kml`; show filename, record count and ideally source publication date when available. Never block on providing a source date that cannot be reliably derived.
2. **Choose location:** blank UK postcode entry, resolved using postcodes.io. Advanced latitude/longitude fields may be offered, but avoid making the UI unnecessarily technical.
3. **Choose area:** 
   - Circular radius slider: **minimum 10 miles**, step **5 miles**, currently maximum **150 miles**; large value updates immediately as slider moves.
   - **Directional rectangle**: independently editable **North, East, South and West** distances in miles (e.g., N20/E50/S10/W10), including asymmetric flying areas.
4. **Saved areas (optional):** named postcode + shape + distances can be saved locally and later loaded to filter a *newer* nationwide BBAC file. Saving a preset must **never** be required before export.
5. **Generate filtered `.kml`:** automatically propose a sensible filename based on the entered postcode/shape/distances, but allow a custom name. Clearly display the output/download control. On iPad give a hint about Safari Downloads / Files → Downloads. Preserve retained original KML information and styles. Report useful counts.
6. Users then import the smaller result into Hot Air or another mapping/navigation app; importing is not a function of this website.

The current website already implements a basic version of most steps. **Inspect and test them rather than presuming correctness**.

## 5. High-priority incomplete changes: do these first

### A. Balloon photograph and branding

- Alan uploaded a **photo of his balloon Jester** earlier in the ChatGPT conversation; this photograph **is not yet in the GitHub repository**. Do not invent a photo, select a random stock balloon, or claim it is already available. Ask Alan to provide the image again to Codex if Codex cannot access the chat attachment. Once supplied, add it as an optimised asset, with appropriate alt text.
- Add the balloon photograph to a tasteful header/intro area, responsive for desktop/iPad/mobile. Retain readability, legible buttons and a quick route to the file selector.
- Update credit on the visible website to exactly **"Alan Turner, Turner Balloons Limited"** rather than only "Developed by Turner Balloons Limited". Align the README/guide footer where appropriate. A simple small credit is preferable to intrusive branding.
- Alan may later provide a different balloon image (Jester or G-CKIT); allow easy replacement.

### B. "Why I made this" introduction

Write accessible first-person background, roughly:

> "I put this together because my usual flying area falls between three BBAC sensitive-area zones. To cover where I might fly, I had to load all three into Hot Air, which meant hundreds of sensitive areas I would never use on a particular flight. The app became painfully slow — even after I upgraded my iPad. This planner lets me download the latest national BBAC KML, enter a postcode wherever I'm flying, and generate a smaller KML containing just the areas relevant to that flight. I thought other pilots might find it useful too. It's free, and I'd welcome any suggestions."  
> — **Alan Turner, Turner Balloons Limited**

Edit naturally for clarity, but keep the genuine rationale and no commercial framing. Avoid implying that the filtered file stays automatically current: it only reflects the **source file the pilot selected**.

### C. Helpful embedded instructions

- Add a compact **Help / How to use** link or expandable panel on the website.
- Include: BBAC Members Area → Digital Mapping → **download latest whole-country KML**; choose that file; enter postcode; select circle or rectangle; generate; download; import into own app; verify restrictions.
- The website already has an expandable source-file instruction panel. Improve/reuse it, do not duplicate a confusing array of help panels.
- Link to `USER_GUIDE.md` when appropriate.
- **KML only**; do not mention KMZ download or ZIP reader.

### D. Confirm actual live deployment

The latest committed `index.html` has KML-only wording. The user reported seeing outdated **KMZ** wording in the browser earlier, likely due to old deployment/browser cache, though the cause has **not been confirmed**. Check the published site, deployed revision, Pages build and browser cache behaviour instead of simply saying a change is live. Fix any mismatch, verify on Safari and give the user a clear refresh procedure if needed.

## 6. KML correctness and testing — critical before wide public promotion

The existing implementation uses an approximate local miles projection and browser DOMParser/XMLSerializer, retains selected original Placemark elements and styles, and attempts to match point/polygon pairs by an identifier parsed from the description. **These strategies are provisional, not fully validated**. Thoroughly test with a lawful, private test copy and synthetic fixtures.

Required test scenarios:
- Pin inside radius and corresponding polygon; polygon touching/crossing search boundary with pin outside; polygon completely enclosing selection; line/point geometry; overlapping and nested folders; holes and multipolygons.
- Do not inadvertently drop the point/area counterpart of the same sensitive-area entry. The precise pairing rules must be determined from the actual BBAC structure, not assumed from one description format.
- Preserve original feature coordinates, placemark names, styles/StyleMap, HTML descriptions, extended data, heights and contact details.
- KML document structure, namespace correctness, XML serialization and opening output in real mapping/navigation applications.
- Correct handling of malformed source, missing data, duplicate IDs, multiple source styles, huge files, odd geometry, zero results and large radius.
- Correct radius/directional interpretation near the edge, UK latitudes, and the accuracy limitations of the current planar approximation. Consider a more robust geospatial approach while retaining browser-only operation.
- Detect whether BBAC publication date/version metadata exists in the KML; distinguish an actual publisher date from filesystem modification timestamp. If unknown say **unknown**, never invent "October 2026" as a source date.
- iPad Safari: file picker, radio modes, slider live display, generation, downloading, localStorage presets and performance with full ~megabyte-scale national files.
- Include a small **synthetic test KML** with invented harmless sample records in a tests/fixture location, if helpful. **Do not commit the real BBAC dataset.**
- Add automated tests where feasible; never claim flight safety validation.

Background figures from earlier exploratory work were *claimed* for one national BBAC file: approximately 4,780 sensitive areas and 9,560 point/polygon placemarks, seven styles. These figures **must not be treated as verified current data** until independently checked from an authorised file.

## 7. Future ideas — NOT currently required

After the current app is stable:
- Visual preview of the chosen selection and filtered sensitive-area boundaries/pins on a map.
- OS National Grid Reference entry; What3Words only if its licensing/API terms permit.
- More adjustable geometries and reusable flying corridors/flight routes.
- Filter a **separately provided airspace KML** in a distinct optional layer without conflating airspace with BBAC sensitive areas.
- Improved original KML version/date handling and optional user-controlled re-filter reminder.
- Offline/PWA support for iPad, if practical while keeping user expectations clear (postcode API currently requires online access).
- Community feedback/suggestions and small fixes after real-world testing.

These are exploratory, not promises or justification for complicating the simple three-step user interface.

## 8. Communication and development workflow

- The owner is **not a developer** and uses his iPad and computer. Communicate in plain English, with simple live links and concise next steps. Don't ask him to manually upload ZIP files if GitHub-connected tools can commit code.
- He wants the application **actually updated and tested**, not a succession of claims that it was updated. Clearly distinguish changes committed to GitHub from verified live Pages deployment.
- Keep work inside this one repo. Before large rewrites, explain expected behaviour changes and identify data/safety implications.
- Change one coherent issue at a time; maintain useful Git history and restore options; check code for syntax errors and use browser testing where available.
- Document any known limitations; do not misrepresent approximate filtering as complete/official accuracy.
- Where the user asks for a change to code, **implement it**, test to the available extent, and report exactly what remains to be verified.
- If working through PRs, show owner an easy preview/merge path; do not rely on unexplained Git terms.

## 9. Proposed first Codex assignment

1. Read this brief plus `index.html`, `README.md`, and `USER_GUIDE.md`.
2. Inspect live Pages deployment and confirm the KML-only interface is served (no KMZ references).
3. Add the **first-person rationale** and visible **"Alan Turner, Turner Balloons Limited"** credit.
4. Ask for the Jester image if it is not accessible; **don't use a random substitute**.
5. Add compact "How to use" help linked to the guide, without publishing BBAC national data or hard-coding any personal postcode.
6. Test basic postcode/radius flow and local synthetic KML export; report remaining verification needed for real BBAC data.
7. Show the updated website URL and summarise the precise changes.

## 10. Suggested short forum introduction (draft only)

"I put together a small free KML planner because my regular flying area straddles three BBAC sensitive-area zones. Loading all three into Hot Air made it frustratingly slow — even on a newer iPad — when I only needed a fraction of those records. This lets me obtain the latest national BBAC KML from the Members Area, enter a postcode for wherever I'm flying, select a radius or directional distances, and download a smaller local KML.

It's something I developed for myself, but I thought others might find it useful. It's free and I'd really welcome feedback and ideas for improvements. It's still a test tool, so please check the exported KML against the original data and current restrictions before using it in flight planning.

Try it at https://alanturner2026.github.io/Turner-balloons-kml/

— Alan Turner, Turner Balloons Limited"

---

**Authoritative privacy decision:** Do not publish the whole-country BBAC KML or the owner's private postcode. Pilots download their own authorised up-to-date **KML** from BBAC Members Area → Digital Mapping.
