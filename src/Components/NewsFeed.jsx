import React, { useEffect, useState } from "react";
import "./NewsFeed.css";
import AOS from "aos";
import "aos/dist/aos.css";

const NewsFeed = () => {
  const [tab, setTab] = useState("anime");
  const [animeData, setAnimeData] = useState({ seasonNow: [], error: null });
  const [bbcNews, setBbcNews] = useState([]);
  const [page, setPage] = useState(1);
  const [bbcError, setBbcError] = useState(null);
  const [loadingAnime, setLoadingAnime] = useState(false);
  const [loadingBbc, setLoadingBbc] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, offset: 100, once: true });
  }, []);

  useEffect(() => setPage(1), [tab]);

  useEffect(() => {
    if (tab === "anime") {
      setLoadingAnime(true);
      fetch(`https://api.jikan.moe/v4/seasons/now?page=${page}&limit=6`)
        .then(res => res.json())
        .then(data => setAnimeData({ seasonNow: data.data || [], error: null }))
        .catch(() => setAnimeData({ seasonNow: [], error: "Failed to fetch anime data" }))
        .finally(() => setLoadingAnime(false));
    }
  }, [tab, page]);

  useEffect(() => {
    if (tab === "bbc") {
      setLoadingBbc(true);
      fetch("https://bright-data-6o8p.onrender.com/api/news?snapshot_id=s_mav325whx69073hfi")
        .then(res => res.json())
        .then(data => {
          const articles = Array.isArray(data) ? data : data.articles || data.items || [];
          setBbcNews(articles);
        })
        .catch(() => setBbcError("Failed to fetch BBC news"))
        .finally(() => setLoadingBbc(false));
    }
  }, [tab]);

  return (
    <div className="newsfeed-container">
      <div className="hero">
        <h1>Live News Dashboard</h1>
        <p>Real-time updates from Anime & BBC World News</p>
        <span className="tagline">🚀 Built for Bright Data Real-Time AI Agents Challenge 2025</span>
      </div>

      <div className="tabs">
        <button
          className={tab === "anime" ? "active" : ""}
          onClick={() => {
            setTab("anime");
            setBbcError(null);
          }}
        >
          🧬 Anime News
        </button>
        <button
          className={tab === "bbc" ? "active" : ""}
          onClick={() => {
            setTab("bbc");
            setBbcError(null);
          }}
        >
          🌍 BBC News
        </button>
      </div>

      {/* Anime */}
      {tab === "anime" && (
        <>
          {loadingAnime && <p className="loading">Loading anime news...</p>}
          {animeData.error && <div className="error">{animeData.error}</div>}

          <div className="grid">
            {animeData.seasonNow.map((item) => (
              <div key={item.mal_id} className="card" data-aos="fade-up">
                {item.images?.jpg?.image_url && (
                  <img src={item.images.jpg.image_url} alt={item.title} />
                )}
                <div className="content">
                  <h3>{item.title_english || item.title}</h3>
                  <span className="type">{item.type}</span>
                  <p>{item.synopsis}</p>
                  <ul>
                    <li>Episodes: {item.episodes ?? "N/A"}</li>
                    <li>Score: {item.score ?? "N/A"}</li>
                  </ul>
                  {item.trailer?.url && (
                    <a href={item.trailer.url} target="_blank" rel="noopener noreferrer">
                      ▶️ Watch Trailer
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              ← Prev
            </button>
            <span>Page {page}</span>
            <button onClick={() => setPage((p) => p + 1)}>Next →</button>
          </div>
        </>
      )}

      {/* BBC */}
      {tab === "bbc" && (
        <>
          {loadingBbc && <p className="loading">Loading BBC news...</p>}
          {bbcError && <div className="error">{bbcError}</div>}

          <div className="grid">
            {bbcNews.map((item, i) => {
              const imageUrl = item.images?.[0]?.image_url ?? null;
              const pubDate = item.publication_date
                ? new Date(item.publication_date).toLocaleString()
                : "Unknown";

              return (
                <div key={item.id || i} className="card" data-aos="fade-up">
                  {imageUrl && i !== 0 && i !== bbcNews.length - 1 && (
                    <img src={imageUrl} alt={item.headline || "News"} />
                  )}
                  <div className="content">
                    <h3>{item.headline || "No headline"}</h3>
                    <p className="meta">
                      <span>{item.author || "Unknown"}</span> • <small>{pubDate}</small>
                    </p>
                    <p>{item.content}</p>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      Read More →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default NewsFeed;
