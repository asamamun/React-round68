# Deploying the Project to Firebase Hosting

This guide explains how to deploy your Vite + React project to Firebase Hosting using the Firebase CLI.

## Prerequisites

- Firebase CLI is installed and logged in.
- You have a Firebase project created in the Firebase console.
- Your project is a Vite app with the build command `npm run build`.

## 1. Initialize Firebase Hosting

Open a terminal in the project root and run:

```bash
firebase init hosting
```

During the initialization prompts:

- Select the Firebase project you want to deploy.
- Choose `public` as the public directory, or use a custom folder like `dist`.
- If prompted, say **No** to configuring as a single-page app if you want the default behavior. For a React SPA, choose **Yes**.
- Say **No** if it asks to overwrite `index.html` if you already have your app files.

## 2. Update `firebase.json` if needed

A typical `firebase.json` for a Vite React app looks like this:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      ".firebase/**",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

If your app builds into a different folder, update `public` accordingly.

## 3. Build the App

Run the Vite build command from the project root:

```bash
npm run build
```

This will generate your production files in the `dist` folder.

## 4. Deploy to Firebase

Deploy the built app to Firebase Hosting:

```bash
firebase deploy --only hosting
```

After deployment, the CLI will show your hosting URL.

## 5. Common Notes

- `npm run build` must succeed before `firebase deploy`.
- If the app uses a router or is a single-page app, the `rewrites` block above ensures client-side routes work.
- If you make changes later, run `npm run build` again and deploy again.

## 6. Example Full Workflow

```bash
cd d:\xampp8212\htdocs\round68\reactJS\classes\class12\hacker-stories-2025_styled-components
firebase init hosting
npm run build
firebase deploy --only hosting
```

## 7. Troubleshooting

- If Firebase complains about the deploy directory, verify `firebase.json` `hosting.public` is set to `dist`.
- If you want to deploy to a new Firebase project, run `firebase use --add` and choose the project.

---

That is all you need to deploy this Vite + React app to Firebase Hosting.