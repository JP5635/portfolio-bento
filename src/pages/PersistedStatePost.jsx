import { Link } from 'react-router-dom';
import RelatedContent from '../components/RelatedContent';
import './ProjectDetail.css';
import './EngineeringArticle.css';

const example = `import { randomUUID } from 'node:crypto';
import { test as base, expect } from '@playwright/test';

type Project = { id: string; name: string };
const editorState = 'playwright/.auth/editor.json';

const test = base.extend<{ project: Project }>({
  project: async ({ request }, use) => {
    const created = await request.post('/api/projects', {
      data: { name: 'test-' + randomUUID() },
    });
    expect(created.status()).toBe(201);
    const project = (await created.json()) as Project;
    expect(project.id).toEqual(expect.any(String));

    try {
      await use(project);
    } finally {
      const removed = await request.delete(
        '/api/projects/' + encodeURIComponent(project.id),
      );
      expect.soft([204, 404], 'fixture cleanup status')
        .toContain(removed.status());
    }
  },
});

test.use({ storageState: editorState });

test('rename is visible through a separate read', async ({
  page, browser, request, baseURL, project,
}) => {
  const path = '/api/projects/' + encodeURIComponent(project.id);
  const route = '/projects/' + encodeURIComponent(project.id);
  const renamed = 'renamed-' + randomUUID();

  await page.goto(route);
  await page.getByLabel('Project name').fill(renamed);
  const saved = page.waitForResponse(response =>
    new URL(response.url()).pathname === path &&
    response.request().method() === 'PATCH',
  );
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  expect((await saved).status()).toBe(200);

  await expect.poll(async () => {
    const read = await request.get(path);
    try {
      return {
        status: read.status(),
        name: read.status() === 200
          ? ((await read.json()) as Project).name : null,
      };
    } finally {
      await read.dispose();
    }
  }, {
    message: 'read API reflects the saved project name',
    timeout: 5_000,
    intervals: [100, 250, 500],
  }).toEqual({ status: 200, name: renamed });

  const fresh = await browser.newContext({
    baseURL, storageState: editorState,
  });
  try {
    const reopened = await fresh.newPage();
    await reopened.goto(route);
    await expect(reopened.getByRole('heading', {
      name: renamed, exact: true,
    })).toBeVisible();
  } finally {
    await fresh.close();
  }
});`;

export default function PersistedStatePost() {
  return <main className="project-detail engineering-article">
    <Link className="detail-back" to="/">← Back to work</Link>
    <article>
      <header className="detail-heading">
        <p className="detail-eyebrow">Engineering guide · Playwright · 16 October 2026</p>
        <h1>Testing persisted application state with Playwright</h1>
        <p className="detail-summary">A save confirmation is one observation. A reliable test checks what another reader can retrieve, under the right identity, within a defined time.</p>
        <p className="engineering-byline">Jongho Park · General engineering knowledge</p>
      </header>

      <section className="detail-section">
        <h2>Purpose: protect the user’s saved work</h2>
        <p>A user edits a project name, clicks Save and moves on. The important promise is that the change remains available when they return. A test that checks only a toast can pass while an optimistic UI displays a value the server rejected, or while a stale cache hides a failed update.</p>
        <p>The goal is to verify a state transition across boundaries: the browser sends the intended mutation, a separate read returns the expected value, and a new browser context renders it. Each observation answers a different question. Playwright supports <a href="https://playwright.dev/docs/api-testing#sending-api-requests-from-ui-tests" target="_blank" rel="noreferrer">API setup and postcondition checks alongside browser actions</a>, making that separation practical.</p>
      </section>

      <section className="detail-section">
        <h2>Define the contract before the selectors</h2>
        <p>Write down the actor, resource, mutation and expected read behaviour first. For a project rename, the invariants are concrete: the project identifier stays the same; its name changes exactly once; an authorised reader sees the new name; unrelated projects remain unchanged. A rejected mutation must leave the original name intact.</p>
        <p>Also define when the change must become observable. A synchronous application may promise read-after-write consistency. An asynchronous system may expose a completed operation before a read model catches up. Those are different contracts. A timeout should reflect the chosen contract and environment, with enough overall test time remaining for teardown.</p>
        <div className="engineering-callout">
          <strong>The evidence boundary</strong>
          <p>An API read and a fresh browser context establish observable application state. They do not independently prove a database flush, recovery after a server crash or replication durability. Those guarantees need storage and recovery tests.</p>
        </div>
      </section>

      <section className="detail-section">
        <h2>An original, deliberately small example</h2>
        <p>This original project-management example illustrates a test pattern against a fictional application contract. Its assumed contract is: create returns <code>201</code>; rename returns <code>200</code>; read returns a project; delete returns <code>204</code> or <code>404</code>. The UI exposes a labelled name field, Save button and project heading.</p>
        <p>Configure <code>baseURL</code> for a disposable test environment. Create an editor authentication state through a separate setup step; it should contain authentication state without cached project data, and remain outside version control. The <a href="https://playwright.dev/docs/auth" target="_blank" rel="noreferrer">authentication guide</a> explains state reuse and its security implications. The example assumes cookie-based authentication shared by the configured browser and request fixtures.</p>
        <figure className="engineering-code">
          <figcaption>TypeScript · original illustrative test · adapt the API and UI contract</figcaption>
          <pre tabIndex={0} aria-label="Playwright TypeScript test example"><code>{example}</code></pre>
        </figure>
        <p>The API creates an isolated precondition, keeping the browser focused on the behaviour under test. The response listener starts before Save to avoid missing a fast response. The read verifies server-visible state. Finally, a new context loads the same resource without inheriting the edited page’s in-memory state.</p>
      </section>

      <section className="detail-section">
        <h2>Isolate backend data as well as the browser</h2>
        <p>Playwright’s <a href="https://playwright.dev/docs/browser-contexts" target="_blank" rel="noreferrer">browser-context isolation</a> separates browser state between tests. It does not isolate the application database. Parallel tests still collide if they edit the same seeded record or share an account whose settings they mutate. Unique resource names and per-test ownership keep those collisions out of the result.</p>
        <p>The custom fixture uses <code>try/finally</code> so cleanup runs after an assertion fails; a soft cleanup assertion records its own failure. Fixtures also make resource ownership explicit. The <a href="https://playwright.dev/docs/test-fixtures" target="_blank" rel="noreferrer">fixture documentation</a> describes their setup, use and teardown lifecycle. A crashed worker can still leave data behind, so long-lived environments may also need a scoped expiry policy. Never clean up by deleting every record with a broad prefix.</p>
      </section>

      <section className="detail-section">
        <h2>Wait for a condition with a bounded budget</h2>
        <p>A fixed sleep assumes the system finishes within an arbitrary delay. A short sleep is flaky; a long one spends the same time on every successful run. Locator assertions retry UI checks, while <a href="https://playwright.dev/docs/test-assertions#expectpoll" target="_blank" rel="noreferrer"><code>expect.poll</code></a> repeatedly evaluates an external observation until the expectation or deadline is reached.</p>
        <p>Poll a read operation. Repeating a mutation could create duplicate work or conceal an idempotency defect. The example checks both status and value, and disposes each read response. Its five-second budget is illustrative, not a performance target. This poll tolerates intermediate HTTP failures within that budget; stricter suites should classify terminal authentication or schema errors explicitly.</p>
        <p>If the read API converges but the fresh page remains stale, investigate frontend caching or revalidation. If the system uses an eventually consistent read model, wait for its observable version or job completion contract. Increasing every timeout can hide a worsening consistency delay.</p>
      </section>

      <section className="detail-section">
        <h2>Test permissions as a separate dimension</h2>
        <p>A hidden Save button is a useful interface assertion, but the server must enforce access too. Use separate authenticated contexts and explicit resource membership. This example policy is a design choice, not a universal role model:</p>
        <div className="engineering-table-wrap" tabIndex={0} role="region" aria-label="Illustrative permissions matrix">
          <table>
            <thead><tr><th>Actor</th><th>UI expectation</th><th>API and state expectation</th></tr></thead>
            <tbody>
              <tr><td>Project editor</td><td>Can rename</td><td>Allowed; authorised reads show the new name</td></tr>
              <tr><td>Project viewer</td><td>Read-only</td><td>Mutation rejected; name unchanged</td></tr>
              <tr><td>Signed-in non-member</td><td>No project access</td><td>Read and mutation rejected without data disclosure</td></tr>
            </tbody>
          </table>
        </div>
        <p>Choose denial codes according to the application’s contract. After a denied write, verify unchanged state through an authorised reader. That catches cases where the response reports rejection after an unintended mutation.</p>
      </section>

      <section className="detail-section">
        <h2>Make a failure explain the broken boundary</h2>
        <p>Separate setup, interaction, mutation response, read convergence, fresh-page rendering and cleanup in reports. Retain a trace and safe diagnostic identifiers for failed runs. A setup outage should not be reported as a save defect; an unexpected permission response should not disappear behind a generic timeout.</p>
        <p>Use this wider test for critical save paths. Component tests can cover optimistic UI and validation quickly, while API tests cover more permission combinations at lower cost. Browser-plus-API checks are slower and depend on more services, but they connect the user action to an independently observable result. That is the confidence this test is designed to provide.</p>
      </section>
    </article>
    <RelatedContent id="byoc" />
  </main>;
}
