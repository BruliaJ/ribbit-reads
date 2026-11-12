# The iPhone, iPad and Android apps

The apps are the same built game as the website (`dist/`), wrapped with [Capacitor](https://capacitorjs.com) 8.
App-only behavior lives in `src/host/` (it does nothing on the website).

## What is different in the apps
- **Pip's voice** uses the phone's own text-to-speech (`@capacitor-community/text-to-speech`), because Android's
  web view has no speech. It plays even with the iPhone silent switch on (Pip's voice is the lesson).
- **Saves** are also copied to the phone's app storage (`@capacitor/preferences`) and restored at launch if the web
  view lost them (`src/host/storage.ts`).
- **Android Back** goes back one screen (a lesson pauses); on the pond it sends the app to the background.
- **No microphone**: the microphone permission is blocked in `AndroidManifest.xml`, and iOS has no microphone usage
  string. Voice questions ("How do you spell…") exist only in the Claude artifact version.
- Everything ships inside the app: works offline, contacts no servers, no advertising ID (blocked in the manifest).
- iOS privacy manifest: `ios/App/App/PrivacyInfo.xcprivacy` (no tracking, no data collected, UserDefaults CA92.1).

## Run it on your devices (on a Mac)
1. Install Xcode (App Store) and Android Studio.
2. In the project: `npm ci`, then `npm run app:sync` (builds the game and copies it into both apps).
3. iPhone/iPad: `npx cap open ios`, pick your device, press Run.
4. Android: `npx cap open android`, pick your device, press Run.

Run `npm run app:sync` again after every change. After changing how Pip looks: `npm run gen:icons`.

## Checks
- Every pull request builds the Android app in CI (job "Android app builds").
- The iOS build needs a Mac; check it by hand in Xcode.

## Before the first store upload (placeholders today)
- `appId` in `capacitor.config.ts` (`com.placeholder.ribbitreads`): use a domain the company owns; it can't change
  after the first upload. Then update the iOS bundle identifier and Android applicationId.
- A strict parental gate in front of Grown-ups (the number-in-words gate is a start; Numberoo's
  docs/decisions/parental-gate.md lists Apple's and Google's requirements), privacy policy and terms behind it.
- Make sure the Claude-only voice-question code is never reachable in a store build (it already only turns on when
  Claude's dictation is present; keep it that way, or strip it from the app build entirely).
- Test on a real older iPad and a mid-range Android phone, including that Pip's voice works out of the box.
