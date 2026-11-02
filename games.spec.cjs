const { test, expect } = require('@playwright/test');
const words = require('./word-data.json');
const people = require('./celebrity-data.json');
const key = s => s.toLowerCase().replace(/[^a-z]/g,'').split('').sort().join('');

test.beforeEach(async ({ page }) => {
  await page.clock.install();
  page.on('pageerror', error => { throw error; });
});

test('home links to all seven games', async ({ page }) => {
  await page.goto('./');
  for (const href of ['word.html','celebrity.html','usa.html','play.html?game=world','play.html?game=india','play.html?game=us-presidents','play.html?game=india-pm']) {
    await expect(page.locator(`a[href^="${href}"]`).first()).toBeVisible();
  }
});

test('word: strict spelling, final chance, scoring and manual next', async ({ page }) => {
  await page.goto('word.html');
  await expect(page.locator('#start')).toBeEnabled();
  await page.locator('#start').click();
  await expect(page.locator('#hintPanel')).toBeHidden();
  const signature = key(await page.locator('#letters').innerText());
  const answer = words.find(x => key(x.word) === signature).word;
  for (let i=0;i<9;i++) {
    await page.locator('#answer').fill('zzzzzzzz');
    await page.locator('#check').click();
  }
  await expect(page.locator('#wrongAttempts li')).toHaveCount(9);
  await expect(page.locator('#finalWarning')).toBeVisible();
  await page.locator('#answer').fill(answer);
  await page.locator('#check').click();
  await expect(page.locator('#reveal')).toBeVisible();
  await expect(page.locator('#scoreStatus')).toContainText('1');
  await expect(page.locator('#meaning')).not.toBeEmpty();
  await expect(page.locator('#sentence')).not.toBeEmpty();
  await page.clock.fastForward(65000);
  await expect(page.locator('#roundStatus')).toContainText('1');
  await page.locator('#next').click();
  await expect(page.locator('#roundStatus')).toContainText('2');
});

test('word: hint costs once, pause freezes time, timeout reveals', async ({ page }) => {
  await page.goto('word.html');
  await page.locator('#start').click();
  await page.locator('#hint').click();
  await expect(page.locator('#points')).toHaveText('7');
  await expect(page.locator('#hintPanel')).toBeVisible();
  await expect(page.locator('#hint')).toBeDisabled();
  await page.locator('#pause').click();
  const timer = await page.locator('#timer').innerText();
  await page.clock.fastForward(65000);
  await expect(page.locator('#timer')).toHaveText(timer);
  await page.locator('#pause').click();
  await page.clock.fastForward(61000);
  await expect(page.locator('#reveal')).toBeVisible();
  await expect(page.locator('#scoreStatus')).toContainText('0');
});

for (const mode of ['world','india','us-presidents','india-pm']) {
  test(`${mode}: complete ten rounds, portrait/map, facts, restart`, async ({ page }) => {
    await page.goto('play.html?game='+mode);
    if (mode==='world') {
      await expect(page.locator('[data-continent]')).toHaveCount(6);
      await expect(page.locator('#start')).toBeDisabled();
      await page.locator('[data-continent="Asia"]').click();
    }
    await expect(page.locator('#start')).toBeEnabled();
    await page.locator('#rounds').selectOption('10');
    await page.locator('#start').click();
    await page.locator('#autoNext').uncheck();
    await expect(page.locator('#answers button')).toHaveCount(4);
    if (mode==='world'||mode==='india') {
      await expect(page.locator('#quizMap path.active')).toHaveCount(1);
    } else {
      await expect(page.locator('#leaderMedallion')).toHaveCSS('background-image','none');
      await page.clock.fastForward(4100);
      await expect(page.locator('#leaderMedallion')).not.toHaveCSS('background-image','none');
    }
    await page.locator('#pause').click();
    const timer = await page.locator('#timer').innerText();
    await page.clock.fastForward(2000);
    await expect(page.locator('#timer')).toHaveText(timer);
    await page.locator('#pause').click();
    const names = new Set();
    for(let i=0;i<10;i++) {
      await page.locator('#answers button').first().click();
      await expect(page.locator('#revealCard')).toBeVisible();
      const name=await page.locator('#revealName').innerText();
      if (mode==='world'||mode==='india') { expect(names.has(name)).toBe(false); names.add(name); }
      await expect(page.locator('#facts')).not.toBeEmpty();
      if(mode==='world') await expect(page.locator('#revealFlag')).toHaveAttribute('aria-label','Flag of '+name);
      if(mode==='india-pm') await expect(page.locator('#presidentBox')).toContainText('Presidents');
      await page.locator('#next').click();
    }
    await expect(page.locator('#finished')).toBeVisible();
    await expect(page.locator('#finalScore')).toContainText('/ 10');
    await page.locator('#playAgain').click();
    await expect(page.locator('#roundStatus')).toHaveText('Round 1 of 10');
  });
}

test('celebrity: hard household eyes clue, full reveal, score and finish', async ({ page }) => {
  await page.goto('celebrity.html');
  await expect(page.locator('#start')).toBeEnabled();
  await page.locator('[data-level="hard"]').click();
  await page.locator('#familiarity').selectOption('household');
  await page.locator('#rounds').selectOption('5');
  await page.locator('#guessTime').selectOption('8');
  await page.locator('#start').click();
  await page.locator('#autoNext').uncheck();
  await expect(page.locator('.eye-window')).toHaveCount(0);
  await page.clock.fastForward(4100);
  await expect(page.locator('.eye-window')).toBeVisible();
  const seen = new Set();
  for(let i=0;i<5;i++) {
    const question=await page.locator('#question').innerText();
    const person=people.find(x=>x.clues.hard===question);
    expect(person).toBeTruthy(); expect(seen.has(person.id)).toBe(false); seen.add(person.id);
    await page.locator(`[data-answer="${person.id}"]`).click();
    await expect(page.locator('.eye-window')).toHaveCount(0);
    await expect(page.locator('#answerName')).toHaveText(person.name);
    await page.locator('#next').click();
  }
  await expect(page.locator('#finished')).toBeVisible();
  await expect(page.locator('#finalScore')).toHaveText('5 / 5');
});

test('USA: countdown, admission history, political color, next and reset', async ({ page }) => {
  await page.goto('usa.html');
  await expect(page.locator('#play')).toBeEnabled();
  await page.locator('#play').click();
  await page.clock.fastForward(5100);
  await expect(page.locator('#reveal')).toBeVisible();
  await expect(page.locator('#name')).toHaveText('Delaware');
  await expect(page.locator('#admissionPresident')).not.toBeEmpty();
  await expect(page.locator('#map path.done.democratic')).toHaveCount(1);
  await page.locator('#skip').click();
  await expect(page.locator('#question')).toHaveText('State #2');
  await page.locator('#reset').click();
  await expect(page.locator('#phase')).toHaveText('READY TO PLAY');
});
