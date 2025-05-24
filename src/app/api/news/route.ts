import { NextResponse } from 'next/server';
import NewsAPI from 'newsapi';

const newsApi = new NewsAPI('5c248f80-dd41-4cd8-86c4-63352637df1d');

export async function GET() {
  try {
    const response = await newsApi.v2.everything({
      q: 'comics OR "comic books" OR Marvel OR DC',
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: 10
    });

    const newsItems = response.articles.map(article => ({
      id: crypto.randomUUID(),
      title: article.title,
      impact: determineImpact(article.title, article.description),
      timestamp: new Date(article.publishedAt)
    }));

    return NextResponse.json(newsItems);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

const determineImpact = (title: string, description: string = ''): 'positive' | 'negative' | 'neutral' => {
  const content = `${title} ${description}`.toLowerCase();
  
  const positiveTerms = ['launch', 'success', 'record', 'growth', 'exclusive', 'partnership'];
  const negativeTerms = ['delay', 'cancel', 'controversy', 'lawsuit', 'decline', 'loss'];

  const positiveCount = positiveTerms.filter(term => content.includes(term)).length;
  const negativeCount = negativeTerms.filter(term => content.includes(term)).length;

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};