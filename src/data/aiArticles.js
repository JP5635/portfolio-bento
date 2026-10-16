import { foundationArticles } from './aiArticlesFoundations.js';
import { systemArticles } from './aiArticlesSystems.js';

const order = ['ai-api', 'ai-context', 'ai-retrieval', 'ai-wiki', 'ai-sql-evidence', 'ai-execution'];
const articles = [...foundationArticles, ...systemArticles];

export const aiArticles = order.map(id => articles.find(article => article.id === id));
export const getAiArticle = slug => aiArticles.find(article => article.slug === slug);

export const aiPortfolioItems = aiArticles.map((article, index) => ({
  id: article.id,
  collection: 'Blog',
  title: article.title,
  category: article.technology,
  status: 'Engineering article',
  publicationStatus: 'published',
  sortDate: '2026-10-16',
  summary: article.summary,
  path: `/writing/${article.slug}`,
  related: [aiArticles[(index + 1) % aiArticles.length].id],
}));
