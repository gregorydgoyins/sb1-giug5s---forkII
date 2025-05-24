```typescript
const URL_REGEX = /^https?:\/\/.+\/.+\.(jpg|jpeg|png|gif|webp)$/i;

export function validateImageUrls(urls: string[]): boolean {
  if (!Array.isArray(urls)) return false;
  return urls.every(url => URL_REGEX.test(url));
}

export function validateReviewScore(score: number): boolean {
  if (typeof score !== 'number') return false;
  if (isNaN(score)) return false;
  return score >= 0 && score <= 5;
}
```