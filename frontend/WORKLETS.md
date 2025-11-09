# Worklets Compatibility (Expo Go, SDK 54)

This project targets Expo Go (managed workflow) on SDK 54. Expo Go bundles native `react-native-worklets-core@0.5.1`. To avoid runtime mismatches, the JavaScript version must be `0.5.0` (compatible with 0.5.1 native) and MUST NOT be 0.6.x.

## Required versions
- react-native-worklets-core: 0.5.0 (exact)
- react-native-reanimated: managed by Expo (installed via `npx expo install`)
- react-native-gesture-handler: managed by Expo (installed via `npx expo install`)

## Deterministic setup (Windows PowerShell)
Run from `frontend/`:

1) Clean dependencies and lockfiles
```
npm run clean:deps
```

2) Reinstall aligned dependencies
```
npm run reinstall:sdk54
```

3) Verify Worklets JS version
```
npm run verify:worklets
# Expected output: 0.5.0
```

4) Start dev server with a clean Metro cache
```
npx expo start -c
```

5) Clear Expo Go cache on device
- Force close Expo Go
- Reopen and scan the QR again

## One-time app entry requirements
At the very top of `App.js`:
```
import 'react-native-gesture-handler';
import 'react-native-reanimated';
```
Also ensure `babel.config.js` includes `react-native-reanimated/plugin` as the LAST plugin.

## Troubleshooting
- If `npm run verify:worklets` != `0.5.0`, remove `node_modules` & `package-lock.json` and repeat the steps.
- Search for stray installs:
```
Get-ChildItem -Recurse node_modules -Filter package.json | Select-String -Pattern '"name":\s*"react-native-worklets-core"' -Context 0,3
```
- If using a dev build (not Expo Go), rebuild after changes:
```
npx expo run:android
npx expo run:ios
```
