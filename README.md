# Done-O-Hidden

A Firefox extension that blocks distracting sites — social media, YouTube, Reddit, whatever pulls your focus — and unlocks them only as you check off items on your daily to-do list.

![icon](icon-64.svg)

## What it does

1. You add the sites you want to restrict (e.g. `instagram.com`, `reddit.com`, `youtube.com`).
2. You add your goals/tasks for the day in a simple to-do list.
3. Blocked sites stay locked until these tasks are checked off.
4. As you complete tasks, sites unlock.
5. The list and lock state reset each day, so the habit rebuilds every morning.

## Features

- **Custom block list** — add or remove any site/domain you find distracting.
- **Daily to-do list** — lightweight task list stored locally, no accounts required.
- **Visual feedback** — locked/unlocked state is shown at a glance in the popup.
- **Daily reset** — a fresh list and fresh locks every day, so yesterday's progress doesn't carry over as an excuse.
- **No accounts, no tracking** — everything is stored locally in the browser via `storage.local`.

## Features to come

- **Progress-gated unlocking** — sites unlock as tasks are checked off, not on a fixed schedule.

## How it works (architecture)

> All required components are in the src/ directory.

| Component | Responsibility |
|---|---|
| `manifest.json` | Extension manifest — permissions, background script, popup, icons. |
| `background.js` | Owns the block list and unlock state; intercepts navigation to blocked domains (e.g. via `declarativeNetRequest` / `webNavigation`) and redirects to a block page when a site is still locked. |
| `popup/` | The toolbar popup UI — shows today's to-do list, lets the user check off tasks, and shows which sites are currently locked/unlocked. Also manage the block list, add/remove sites. |
| `storage` | All state (block list, today's tasks, unlock progress) is kept in `browser.storage.local`, scoped per-profile. |
| `icon**.png` | Extension icons. |
| `icon64.png` | Extension icon's original svg file. |

### Permissions

- `storage` — persist the block list and daily task/unlock state.
- `declarativeNetRequest` — detect and intercept navigation to blocked sites.
- Host permissions for the blocked domains (or `<all_urls>` if matching is done dynamically against the user's custom list).

## Icon

`icon-64.svg` is the master icon: a padlock with its shackle left ajar and a checkmark cut out of the body, on a gradient running from warning-orange to success-green. It's meant to visually encode the extension's core idea — locked distraction becoming an unlocked reward as tasks are completed. Export it at 16/32/48/96/128px for the manifest's `icons` field.

## Installation (development)

1. Clone this repository.
   ```bash
   git clone <repo-url>
   cd <repo-folder>
   ```
2. Open Firefox and go to `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on…** and select the `manifest.json` file.
4. The extension icon will appear in the toolbar. Open it to add sites to block and set today's to-do list.

> Temporary add-ons are removed when Firefox restarts. For a persistent local install during development, package with `web-ext` and use a signed/unsigned build as appropriate.

## Building / packaging

If using [`web-ext`](https://github.com/mozilla/web-ext):

```bash
npm install --global web-ext
web-ext lint
web-ext build
```

## Roadmap ideas

- Per-site unlock durations (unlock for 10 minutes vs. fully for the day).
- Weekly/streak stats on focus vs. distraction.

## Contributing

Issues and pull requests are welcome. Please open an issue describing the change before submitting larger PRs.

## License

MIT.
