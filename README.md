# PadBench

PadBench is a browser-based calibration and diagnostic lab for PlayStation DualShock 4, DualSense, DualSense Edge, and VR2 controllers. It runs on GitHub Pages and uses WebHID to communicate with supported controllers.

## What it can do

- Calibrate stick centers and ranges, with normal and expert flows where supported
- Inspect live stick positions, circularity, controller details, and battery information
- Run controller quick tests for supported buttons, sensors, lights, audio, and haptics
- Save or restore supported calibration data, with controller-specific limitations
- Capture a 20-second stick session and download its readings as a local JSON report
- Keep diagnostic reporting local; PadBench does not send analytics

Calibration changes can be risky. Read the in-app warnings before writing changes to a controller. Calibration is not a repair for worn or damaged stick hardware and may make drift symptoms worse.

## Browser requirements

Controller calibration requires WebHID in a desktop Chromium browser such as Chrome or Edge. The Gamepad API may expose input to other browsers, but that does not enable the WebHID calibration features. Phone and tablet browsers are not supported for calibration.

## Run locally

Requires Node.js 20 or newer.

```sh
npm ci
npm run build
npm run serve
```

Open `http://localhost:8080`. WebHID requires a secure context; localhost qualifies.

## Publish

GitHub Pages serves the static site from the root of the `gh-pages` branch. To update it, run `npm run build:prod` and publish the contents of `dist/` to that branch. The source and build instructions stay on `main`.

## Credits and license

PadBench contains adapted controller communication and calibration code from [dualshock-tools/dualshock-tools.github.io](https://github.com/dualshock-tools/dualshock-tools.github.io), originally created by the_al and contributors. That upstream project is distributed under the MIT License; its copyright and license notice are preserved in [LICENSE.txt](LICENSE.txt). PadBench's added interface, reporting tool, and documentation are also released under the MIT License.
