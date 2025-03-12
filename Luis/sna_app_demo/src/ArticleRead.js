import React, { useState } from 'react';
import './ArticleRead.css';

const ArticleRead = () => {
  const [url, setUrl] = useState('');
  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');

  // Function to fetch and parse the article using AllOrigins proxy
  const scrapeArticle = async (articleUrl) => {
    const response = await fetch(`https://api.allorigins.hexocode.repl.co/get?disableCache=true&url=${encodeURIComponent(articleUrl)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch article. Please check the URL.');
    }
    const data = await response.json();
    const html = data.contents;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Try extracting the title from OpenGraph or fallback to document title
    const title = doc.querySelector("meta[property='og:title']")?.content || doc.title || "No title available";
    // Try extracting an image from OpenGraph metadata
    const image = doc.querySelector("meta[property='og:image']")?.content || "";
    // Extract all <p> elements as content
    const paragraphs = Array.from(doc.querySelectorAll("p")).map(p => p.textContent).join("\n\n");

    return { title, image, content: paragraphs };
  };

  const handleScrape = async () => {
    setError('');
    setArticle(null);
    try {
      const scraped = await scrapeArticle(url);
      setArticle(scraped);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="article-read">
      <h2>Read a News Article</h2>
      <div className="read-form">
        <input
          type="text"
          placeholder="Enter article URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={handleScrape}>Read Article</button>
      </div>
      {error && <p className="error">{error}</p>}
      {article && (
        <div className="scraped-article">
          <h3>{article.title}</h3>
          {article.image && <img src={article.image} alt={article.title} />}
          <p>{article.content}</p>
        </div>
      )}
    </div>
  );
};

export default ArticleRead;
