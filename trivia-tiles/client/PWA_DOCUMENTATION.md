# Progressive Web App (PWA) Implementation

## Overview

This document details the implementation of Progressive Web App (PWA) features for the Trivia Tiles puzzle game. The app has been configured to be installable, work offline, and load faster on subsequent visits.

## PWA Features

### 1. **Installability**
- The app can be installed on a user's home screen for a native-like experience.
- A `manifest.json` file has been configured with the necessary properties:
  - `short_name` and `name` for display on the home screen.
  - A comprehensive set of `icons` for different device resolutions, including a `maskable` icon.
  - `start_url`, `display`, `theme_color`, and `background_color` for a seamless launch experience.

### 2. **Offline Caching**
- A service worker (`service-worker.ts`) has been implemented using Workbox to cache assets and data.
- **Precaching**: All static assets (JS, CSS, images, etc.) are precached, allowing the app shell to load instantly, even when offline.
- **Runtime Caching**:
  - **Images**: A `StaleWhileRevalidate` strategy is used for images, providing a balance between speed and freshness.
  - **API Calls**: The Dictionary API responses are cached using a `StaleWhileRevalidate` strategy, allowing word validation to work offline for previously checked words.

### 3. **Service Worker Lifecycle**
- The service worker lifecycle is managed by `serviceWorkerRegistration.ts`.
- The app will prompt users to refresh when a new version is available, ensuring they always have the latest content.
- The `clientsClaim()` and `skipWaiting()` methods are used to activate the new service worker immediately.

## Implementation Details

### 1. **Service Worker**
- `src/service-worker.ts`: This file contains the Workbox configuration for caching strategies. It defines how different types of assets are cached and for how long.
- `src/serviceWorkerRegistration.ts`: This file manages the registration and lifecycle of the service worker. It handles the `install`, `activate`, and `update` events.

### 2. **Webpack Configuration**
- `react-app-rewired` and `customize-cra` are used to override the default Webpack configuration without ejecting.
- `config-overrides.js`: This file injects the `InjectManifest` plugin from Workbox into the Webpack build. This plugin is responsible for creating the service worker file and injecting the precache manifest.
- `package.json` has been updated to use `react-app-rewired` for all scripts.

### 3. **App Manifest**
- `public/manifest.json`: This file provides the necessary metadata for the PWA. It has been updated with app-specific information and a full range of icons.

## How to Test

### 1. **Lighthouse Audit**
- Open Chrome DevTools (`Cmd+Opt+I` or `Ctrl+Shift+I`).
- Go to the **Lighthouse** tab.
- Select the **Progressive Web App** category.
- Click **Generate report**.
- The app should score high in the PWA category.

### 2. **Installation**
- In Chrome on desktop, an install icon should appear in the address bar.
- On mobile, Chrome should prompt you to "Add to Home Screen".

### 3. **Offline Mode**
- In Chrome DevTools, go to the **Application** tab.
- Go to the **Service Workers** section and check the **Offline** checkbox.
- Reload the page. The app should still load and function correctly (word validation will work for cached words).

## Conclusion

The Trivia Tiles app is now a fully-featured Progressive Web App. These enhancements provide a more resilient, reliable, and engaging experience for users, bridging the gap between a web app and a native app. 