# Nabil Rakdani — Intelligence, engineered.

A bespoke one-page portfolio: graphite, chalk and copper; an original exploded compute illustration; editorial experience; and interactive architecture/technology explorers.

## Run locally

Install Node.js 22 or newer, then:

```sh
git clone https://github.com/DeepDlueIV/Nabil.git
cd Nabil
npm run dev
```

Open http://localhost:3000. **No `npm install` is necessary.** There are no package dependencies.

```sh
npm test       # Node built-in tests
npm run build  # Prerender index.html and dist/
npm run check  # Test, then build
```

The generated `dist/index.html` can also be opened directly in a browser. Upload the contents of `dist/` to any static host.

## Edit the profile

Edit `data/profile.mjs` and rebuild. Contact values intentionally start empty:

```js
contacts: {
  email: '',
  github: '',
  linkedin: ''
}
```

Use a plain email address and full `https://` social URLs. Experience, imagery, expertise, services, languages and stack labels live in the same data file.

## Structure

- `data/profile.mjs` — editable profile, architecture scenarios and technology data.
- `src/render.mjs` — semantic prerendered HTML, escaped content and safe contact URLs.
- `src/illustration.mjs` — original SVG compute assembly and icons.
- `assets/style.css` — responsive layout, motion and reduced-motion/print styles.
- `assets/app.js` — progressive enhancements, explorers and contact dialog.
- `scripts/` — dependency-free Node build and static preview server.
- `tests/` — unit tests.

The site is deliberately dependency-free: the design, SVG visualizations, rendering and interactions are all implemented in the repository without a frontend framework runtime.

## Contact behavior

Until an email address is configured, the contact dialog prepares a project brief and copies it locally. Nothing is sent or stored. Once an email is configured, submitting opens an email draft for the visitor to review and send.

Professional claims come from the supplied profile legend. Generic employers remain generic; illustrative images and diagrams do not imply employment, client work or endorsements.
