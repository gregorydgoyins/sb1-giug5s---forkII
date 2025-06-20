
// Example Ticker component using NewsData.io
import React, { useEffect, useState } from 'react';
import { SECRETS } from '../secrets/secrets';

export default function Ticker() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch(`https://newsdata.io/api/1/news?apikey=${SECRETS.NEWS_API_KEY}&q=comics&language=en`)
      .then(res => res.json())
      .then(data => {
        if (data.results) setNews(data.results.slice(0, 5));
      });
  }, []);

  return (
    <div className="ticker">
      <marquee>
        {news.map((item, index) => (
          <span key={index}>{item.title} — </span>
        ))}
      </marquee>
    </div>
  );
}
