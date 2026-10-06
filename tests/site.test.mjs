import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

test('recovered profile and renderer exist', () => {
  assert.ok(existsSync('data/profile.mjs'), 'source-of-truth profile missing');
  assert.ok(existsSync('src/render.mjs'), 'page renderer missing');
    assert.ok(existsSync('assets/style.css'), 'stylesheet missing');
});
async function load() {
  const { profile, scenarios, stack } = await import('../data/profile.mjs');
  const { renderPage, escapeHtml, safeHref } = await import('../src/render.mjs');
  return { profile, scenarios, stack, renderPage, escapeHtml, safeHref };
}
test('legend identity, four roles and all technology domains are retained', async () => {
  const { profile, stack } = await load();
  assert.equal(profile.name, 'Nabil Rakdani');
  assert.equal(profile.location, 'Pavia, Italy');
  assert.equal(profile.experience.length, 4);
  assert.equal(profile.experience[1].dates, '2021 — 2024');
  assert.equal(stack.length, 5);
  for (const name of ['Rust', 'TensorRT-LLM', 'Qdrant', 'Kubernetes', 'OpenID Connect'])
    assert.ok(stack.some(group => group.items.some(item => item[0] === name)), name);
});
test('text is escaped and unsafe/placeholder contact links are rejected', async () => {
  const { escapeHtml, safeHref } = await load();
  assert.equal(escapeHtml('<b>"&\''), '&lt;b&gt;&quot;&amp;&#39;');
  for (const value of ['', '[EMAIL]', 'javascript:alert(1)', 'data:text/html,bad', 'http://example.com', 'https://user:password@example.com'])
    assert.equal(safeHref(value), null);
  assert.equal(safeHref('https://github.com/example'), 'https://github.com/example');
  assert.equal(safeHref('test@example.com', 'email'), 'mailto:test@example.com');
  assert.equal(safeHref('test@example.com\r\nBcc:bad@example.com', 'email'), null);
});
test('semantic page and honest contact states survive recovery', async () => {
  const { renderPage, profile } = await load();
  const html = renderPage(profile);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  for (const id of ['expertise', 'systems', 'experience', 'stack', 'engagement', 'contact'])
    assert.ok(html.includes(`id="${id}"`), id);
  for (const content of ['<dialog', 'Illustrative architecture', 'Copy project brief', 'name="description"', 'property="og:title"', 'type="application/ld+json"'])
    assert.ok(html.includes(content), content);
  assert.ok(!html.includes('href="[EMAIL]"'));
  assert.ok(!html.includes('99.99%'));
});
test('three architecture patterns have six labeled components each', async () => {
  const { scenarios } = await load();
  assert.equal(scenarios.length, 3);
  for (const scenario of scenarios) {
    assert.equal(scenario.nodes.length, 6);
    assert.ok(scenario.nodes.every(node => node.label && node.detail));
    assert.ok(scenario.description.length > 50);
  }
});
test('configured contacts become genuine links and an email-composer action', async () => {
  const { renderPage, profile } = await load();
  const html = renderPage({ ...profile, contacts: { email: 'hello@example.com', github: 'https://github.com/example', linkedin: '' } });
  assert.ok(html.includes('href="mailto:hello@example.com"'));
  assert.ok(html.includes('href="https://github.com/example"'));
  assert.ok(html.includes('Open email draft'));
});
test('all career and technology content exists before JavaScript executes', async () => {
  const { renderPage, profile, stack, escapeHtml } = await load();
  const html = renderPage(profile);
  for (const job of profile.experience) assert.ok(html.includes(escapeHtml(job.title)));
  for (const group of stack) for (const item of group.items) assert.ok(html.includes(escapeHtml(item[0])));
  assert.ok(html.includes('Italian'));
  assert.ok(html.includes('Fractional CTO'));
});
test('supported font weights and configurable identity are retained', async () => {
  const { renderPage, profile } = await load();
  const html = renderPage({ ...profile, name: 'Test Architect', location: 'Test City', years: '12+' });
  assert.ok(html.includes('IBM+Plex+Mono:wght@400;500&display=swap'));
  assert.ok(html.includes('TEST<br>ARCHITECT'));
  assert.ok(html.includes('TEST CITY'));
  assert.ok(html.includes('12+ YEARS OF ENGINEERING EXPERIENCE'));
});
