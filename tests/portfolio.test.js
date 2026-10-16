import test from 'node:test';
import assert from 'node:assert/strict';
import { items, posts, collections, getRouteItem, getRelatedItems, sortOptions, sortPortfolioItems } from '../src/data/portfolio.js';
import { projects } from '../src/data/projects.js';
import { media, projectMedia, projectCovers } from '../src/data/media.js';
import { sepsisReport } from '../src/data/research.js';
import { existsSync, readFileSync } from 'node:fs';

test('only the requested collections appear, without experience posts', () => {
  assert.deepEqual(collections, ['All', 'Projects', 'Research', 'Blog']);
  assert.equal(posts.some(item => item.collection === 'Experience'), false);
  assert.equal(posts.some(item => item.publicationStatus === 'planned'), false);
  assert.deepEqual(posts.slice(0, 3).map(item => item.id), ['researchq', 'byoc', 'credential-access']);
  assert.equal(new Set(items.map(item => item.id)).size, items.length);
});

test('every visible card resolves to its own route context', () => {
  for (const item of posts) {
    const url = new URL(item.path, 'https://portfolio.test');
    assert.equal(getRouteItem(url.pathname, url.search)?.id, item.id);
  }
  assert.equal(getRouteItem('/sepsis')?.collection, 'Projects');
  assert.equal(getRouteItem('/sepsis/', '?context=research')?.collection, 'Research');
  assert.equal(getRouteItem('/researchq', '?context=research')?.collection, 'Projects');
  assert.equal(getRouteItem('/missing'), undefined);
  assert.equal(getRouteItem('/writing/missing'), undefined);
});

test('portfolio sort supports featured, name and verified-date orders', () => {
  assert.deepEqual(sortOptions.map(option => option.value), ['featured', 'name-asc', 'name-desc', 'date-desc', 'date-asc']);
  assert.deepEqual(sortPortfolioItems(posts, 'featured'), posts);
  const entries = [
    { id: 'undated', title: 'Beta' },
    { id: 'older', title: 'Zulu', sortDate: '2025-01-01' },
    { id: 'newer', title: 'Alpha', sortDate: '2026-01-01' },
  ];
  assert.deepEqual(sortPortfolioItems(entries, 'name-asc').map(item => item.id), ['newer', 'undated', 'older']);
  assert.deepEqual(sortPortfolioItems(entries, 'name-desc').map(item => item.id), ['older', 'undated', 'newer']);
  assert.deepEqual(sortPortfolioItems(entries, 'date-desc').map(item => item.id), ['newer', 'older', 'undated']);
  assert.deepEqual(sortPortfolioItems(entries, 'date-asc').map(item => item.id), ['older', 'newer', 'undated']);
  assert.deepEqual(entries.map(item => item.id), ['undated', 'older', 'newer']);
});

test('published projects have scope, engineering decisions and verification', () => {
  for (const item of posts.filter(item => item.collection === 'Projects')) {
    const content = projects[item.id];
    for (const field of ['type', 'problem', 'contribution', 'limitations']) {
      assert.ok(content[field], `${item.id}: ${field}`);
    }
    assert.ok(content.architecture.steps.length > 0);
    assert.ok(content.decisions.length >= 2);
    assert.ok(content.verification.length > 0);
    assert.ok(content.outcomes.every(outcome => outcome.value && outcome.label && outcome.note));
  }
});

test('related content works both ways without broken or self links', () => {
  for (const item of items.filter(item => item.related)) {
    const targets = Array.isArray(item.related) ? item.related : [item.related];
    for (const target of targets) {
      assert.ok(items.some(candidate => candidate.id === target));
      if (item.publicationStatus !== 'planned') {
        assert.ok(getRelatedItems(item.id).some(candidate => candidate.id === target));
        assert.ok(getRelatedItems(target).some(candidate => candidate.id === item.id));
      }
    }
    assert.ok(getRelatedItems(item.id).every(candidate => candidate.id !== item.id && candidate.path && candidate.publicationStatus !== 'planned'));
  }
  assert.ok(getRelatedItems('byoc').every(item => item.collection !== 'Experience'));
});

test('general engineering articles are separate from employment and private-work case data', () => {
  for (const id of ['byoc', 'credential-access', 'lakehouse-sync']) {
    const item = items.find(item => item.id === id);
    assert.equal(item.collection, 'Blog');
    assert.equal(item.publicationStatus, 'published');
    assert.ok(item.path.startsWith('/writing/'));
    assert.equal(item.role, undefined);
    assert.equal(projects[id], undefined);
    assert.equal(getRelatedItems(id).some(item => item.collection === 'Experience'), false);
  }
});

test('planned articles remain addressable but are excluded from published collections and related links', () => {
  const blogs = posts.filter(item => item.collection === 'Blog');
  const planned = items.filter(item => item.publicationStatus === 'planned');
  assert.ok(planned.length > 0);
  for (const item of planned) {
    assert.ok(!posts.includes(item));
    assert.equal(getRouteItem(item.path)?.id, item.id);
    assert.equal(item.status, 'Proposed article');
  }
  assert.ok(blogs.every(item => item.publicationStatus === 'published'));
  assert.equal(blogs.find(item => item.id === 'writing-dino-q-learning').publicationStatus, 'published');
  assert.equal(blogs.find(item => item.id === 'writing-dino-q-learning').path, '/writing/dino-q-learning');
  assert.ok(blogs.some(item => item.id === 'writing-retrieval-evaluation'));
  assert.equal(items.find(item => item.id === 'sepsis-research').status, 'Course report');
});

test('research has an independent detail route and remains connected to the project', () => {
  assert.equal(getRouteItem('/research/sepsis').id, 'sepsis-research');
  assert.equal(getRouteItem('/research/sepsis').collection, 'Research');
  assert.notEqual(items.find(item => item.id === 'sepsis-research').path, '/sepsis');
  assert.ok(getRelatedItems('sepsis').some(item => item.path === '/research/sepsis'));
});

test('every source image exists with provenance and dimensions', () => {
  for (const entry of Object.values(media)) {
    assert.ok(existsSync(new URL(`../public/${entry.src}`, import.meta.url)));
    const png = readFileSync(new URL(`../public/${entry.src}`, import.meta.url));
    assert.equal(png.readUInt32BE(16), entry.width);
    assert.equal(png.readUInt32BE(20), entry.height);
    assert.ok(entry.width > 0 && entry.height > 0 && entry.source && entry.alt && entry.note);
    assert.equal(entry.src.endsWith('.pdf'), false);
  }
  for (const ids of Object.values(projectMedia)) assert.ok(ids.every(id => media[id]));
});

test('reported evaluation is separate from dashboard demonstration metrics', () => {
  assert.equal(sepsisReport.authors.length, 4);
  assert.equal(sepsisReport.results.length, 6);
  assert.equal(sepsisReport.results.find(row => row.model === 'GAM').fourHour, '0.646');
  assert.equal(sepsisReport.results.find(row => row.model === 'XGBoost').fourHour, '0.650');
  assert.ok(media['sepsis-dashboard'].note.includes('different') || media['sepsis-dashboard'].note.includes('separate'));
});

test('every published item has a usable cover with provenance and valid share-image dimensions', () => {
  for (const item of posts) {
    const cover = projectCovers[item.id];
    assert.ok(cover, `Missing cover for ${item.id}`);
    assert.ok(cover.label && cover.context, `Missing cover context for ${item.id}`);
    const source = cover.media ? media[cover.media]?.src : cover.src;
    assert.ok(source && existsSync(new URL(`../public/${source}`, import.meta.url)), `Missing cover asset for ${item.id}`);
    if (cover.social) {
      const png = readFileSync(new URL(`../public/${cover.social}`, import.meta.url));
      assert.equal(png.readUInt32BE(16), 1200);
      assert.equal(png.readUInt32BE(20), 630);
    }
  }
});
