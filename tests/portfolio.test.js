import test from 'node:test';
import assert from 'node:assert/strict';
import { items, posts, collections, getRouteItem, getRelatedItems, sortOptions, sortPortfolioItems } from '../src/data/portfolio.js';
import { projects } from '../src/data/projects.js';
import { media, projectMedia } from '../src/data/media.js';
import { sepsisReport } from '../src/data/research.js';
import { existsSync, readFileSync } from 'node:fs';

test('only the requested collections appear, without experience posts', () => {
  assert.deepEqual(collections, ['All', 'Projects', 'Research', 'Blog']);
  assert.equal(posts.length, 8);
  assert.equal(posts.some(item => item.collection === 'Experience'), false);
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
  assert.equal(sortPortfolioItems(posts, 'name-asc')[0].title, 'Cleaning millions of spatial events in BigQuery');
  assert.equal(sortPortfolioItems(posts, 'name-desc')[0].title, 'Vationo');
  assert.equal(sortPortfolioItems(posts, 'date-desc')[0].id, 'writing-dino-q-learning');
  assert.equal(sortPortfolioItems(posts, 'date-asc')[0].id, 'researchq');
  assert.ok(sortPortfolioItems(posts, 'date-desc').slice(-3).every(item => !item.sortDate));
});

test('three projects have complete common-template content', () => {
  for (const item of posts.filter(item => item.collection === 'Projects')) {
    const content = projects[item.id];
    for (const field of ['type', 'problem', 'contribution', 'evidence', 'limitations']) {
      assert.ok(content[field], `${item.id}: ${field}`);
    }
    assert.ok(content.approach.length > 0);
    assert.ok(content.outcomes.every(outcome => outcome.value && outcome.label && outcome.note));
  }
});

test('related content works both ways without broken or self links', () => {
  for (const item of items.filter(item => item.related)) {
    assert.ok(items.some(candidate => candidate.id === item.related));
    assert.ok(getRelatedItems(item.id).some(candidate => candidate.id === item.related));
    assert.ok(getRelatedItems(item.related).some(candidate => candidate.id === item.id));
    assert.ok(getRelatedItems(item.id).every(candidate => candidate.id !== item.id && candidate.path));
  }
  assert.ok(getRelatedItems('researchq').some(item => item.path === '/resume'));
});

test('planned articles and the published Q-learning note are labelled honestly', () => {
  const blogs = posts.filter(item => item.collection === 'Blog');
  assert.equal(blogs.filter(item => item.publicationStatus === 'planned').length, 3);
  assert.ok(blogs.filter(item => item.publicationStatus === 'planned').every(item => item.status === 'Proposed article'));
  assert.equal(blogs.find(item => item.id === 'writing-dino-q-learning').publicationStatus, 'published');
  assert.equal(blogs.find(item => item.id === 'writing-dino-q-learning').path, '/writing/dino-q-learning');
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
