# Abdul Salam Saifi portfolio (React)

This Vite + React app recreates the original portfolio pages using React components and state. It uses client-side SPA navigation: internal links update the route without reloading the document, and browser Back/Forward is supported. The layouts adapt to desktop, tablet, and mobile screen sizes. Photos and the resume PDF are in `public/assets/`.

The mobile-first stylesheet includes breakpoints at 360px, 481px, 769px, 1025px, and 1441px. Interactive controls have keyboard focus styles and touch-sized targets; the welcome dialog supports Escape and keeps keyboard focus inside while open. Page chunks load on demand, and motion preferences are respected.

## Run locally

1. Install Node.js 24.12 or newer.
2. Open a terminal in the `react-version` folder (the folder containing `package.json`, not `src`).
3. Run `npm install` once.
4. Run `npm run dev` and open the local URL Vite prints.

Run `npm run build` to create a production build in `dist/`.

## Pages

- `/` — portfolio home
- `/about` — profile, education, experience, projects, and welcome dialog
- `/skills` — skills grouped by category
- `/contact` — validated contact form saved to Firestore
- `/admin/messages` — sign-in protected Firestore inbox with read, edit, and delete actions
- The Resume links open `public/assets/Abdul_Salam_Saifi.pdf`.

## Firebase / Firestore setup

The project already contains the Firebase web app configuration in `Confige_firebase/config.js`. Replace that configuration only if you want to connect a different Firebase project. Firebase web configuration is used by the browser SDK; Firestore Security Rules protect the data.

1. In Firebase Console, create or open the project configured in `Confige_firebase/config.js`.
2. Create a Cloud Firestore database in Production mode.
3. In **Authentication → Sign-in method**, enable **Email/Password**. In **Authentication → Users**, create one administrator account. Do not add a public sign-up flow.
4. Copy that administrator’s UID from the Users page. Replace `REPLACE_WITH_ADMIN_UID` in `firestore.rules` with the UID.
5. Publish the rules from the Firestore Rules tab, or install Firebase CLI and run `firebase deploy --only firestore:rules` from this folder. `firebase.json` and `.firebaserc` are included. If you change the project ID in `Confige_firebase/config.js`, update `.firebaserc` too.
6. Run `npm install` after downloading the updated project, then `npm run dev`. Submit a message at `/contact`; sign in at `/admin/messages` using the admin account.

The app creates the `contactMessages` collection when the first message is submitted. Visitors can create validated messages but cannot read them. Only the configured admin UID can list, edit, or delete messages. Firestore writes the message timestamp. The admin inbox fetches records when opened and has a Refresh button; it does not keep a live listener open. This uses Firestore Lite to reduce the browser bundle and requires an internet connection for database operations. Add your production domain under Firebase Authentication’s authorized domains when deploying. Never replace the rules with open test-mode rules.

To deploy the SPA after building, run `npm run build` and then `firebase deploy --only hosting,firestore:rules` from this folder. Firebase Hosting is configured to rewrite app routes to `index.html`.

## Source layout

```text
src/
├── App.jsx                    # SPA route table and shared shell
├── main.jsx                   # React entry point and global stylesheet
├── components/                # Header, footer, social links, welcome dialog
├── data/                      # Navigation, About sections, skill groups
├── firebase/                  # Firestore contact-message CRUD service
├── pages/                     # Home, About, Skills, Contact, admin inbox
├── routing/                   # Browser history state, hook, and SPA links
└── styles.css                 # Responsive styling and interaction states
```

The About welcome dialog appears once per browser session. Remix Icon and Google Fonts are loaded from their CDNs. For static hosting, configure the host to serve `index.html` for app routes so direct visits to `/about`, `/skills`, `/contact`, and `/admin/messages` load correctly.
