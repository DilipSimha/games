# Testing the games

Run `npm ci`, then `npm test` for word scoring/anagrams, celebrity queues, and bundled data checks. Run `npx playwright install --with-deps chromium webkit` followed by `npm run test:browser` for browser regressions.

Browser tests exercise all seven games under the GitHub Pages `/games/` subpath in desktop Chromium, desktop WebKit, and iPhone-sized WebKit emulation. They cover the home links, word hints/final attempts/timeout/pause, celebrity eyes-only clues/scoring/completion, geography maps/flags/facts, leader portraits, ten-round completion/restart, and USA state reveal/history/color/reset. Thirteen category scenarios exercise every celebrity category, including their new portrait and eyes-only assets. There are 66 browser checks across the three browser configurations.

Data checks validate the 1,200-word bank, 975 celebrities and 2,925 clues, all difficulty/filter combinations, nonrepeating anagrams, 195 countries, 36 Indian regions, 47 US presidencies, 18 PM tenures, admission histories, and required bundled image/audio references.

GitHub Actions runs these checks on pushes and pull requests. Failures retain browser traces, screenshots and an HTML report for inspection. Tests use the committed assets, without calling external fact sources.

These are regression checks, not an exhaustive factual audit. Mobile emulation does not replace testing on a physical iPhone, and automated asset checks do not establish audible volume or Bluetooth output on a real device.
