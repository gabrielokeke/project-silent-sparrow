import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
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
          const articles = Array.isArray(data)
            ? data
            : data.articles || data.items || [];
          setBbcNews(articles);
        })
        .catch(() => setBbcError("Failed to fetch BBC news"))
        .finally(() => setLoadingBbc(false));
    }
  }, [tab]);

  return (
    <div className="container py-5">
      {/* Hero Header */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-primary">Live News Dashboard</h1>
        <p className="lead text-muted">Real-time updates from Anime & BBC World News</p>
         <div className="mt-3">
    <span className="badge bg-warning text-dark fs-6 px-3 py-2 rounded-pill shadow-sm">
      🚀 Built for the Bright Data Real-Time AI Agents Challenge 2025
    </span>
  </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-pills justify-content-center mb-4">
        <li className="nav-item">
          <button
            className={`nav-link px-4 py-2 fw-semibold ${tab === "anime" ? "active" : ""}`}
            onClick={() => {
              setTab("anime");
              setBbcError(null);
            }}
            style={{border: '1px solid blue'}}
          >
            🧬 Anime News
          </button>
        </li>
        <li className="nav-item ms-2">
          <button
            className={`nav-link px-4 py-2 fw-semibold ${tab === "bbc" ? "active" : ""}`}
            onClick={() => {
              setTab("bbc");
              setBbcError(null);
            }}
            style={{border: '1px solid blue'}}
          >
            🌍 BBC News
          </button>
        </li>
      </ul>

      {/* Anime Feed */}
      {tab === "anime" && (
        <div>
          {loadingAnime && <p className="text-center">Loading anime news...</p>}
          {animeData.error && (
            <div className="alert alert-danger text-center">{animeData.error}</div>
          )}
          <div className="row g-4">
            {animeData.seasonNow.map((item) => (
              <div key={item.mal_id} className="col-md-6 col-lg-4" data-aos="fade-up">
                <div className="card h-100 border-0 shadow-lg hover-shadow transition rounded-4">
                  <img
                    src={item.images?.jpg?.image_url}
                    className="card-img-top rounded-top-4"
                    alt={item.title}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold">{item.title_english || item.title}</h5>
                    <span className="badge bg-info text-dark mb-2">{item.type}</span>
                    <p className="card-text text-muted small">{item.synopsis}</p>
                    <ul className="list-group list-group-flush my-2">
                      <li className="list-group-item border-0 ps-0">
                        Episodes: {item.episodes ?? "N/A"}
                      </li>
                      <li className="list-group-item border-0 ps-0">
                        Score: {item.score ?? "N/A"}
                      </li>
                    </ul>
                    {item.trailer?.url && (
                      <a
                        href={item.trailer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-warning mt-auto"
                      >
                        ▶️ Watch Trailer
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
            <button
              className="btn btn-outline-primary rounded-pill px-4"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loadingAnime}
            >
              ← Prev
            </button>
            <span className="fw-semibold text-secondary">Page {page}</span>
            <button
              className="btn btn-outline-primary rounded-pill px-4"
              onClick={() => setPage((p) => p + 1)}
              disabled={loadingAnime}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* BBC Feed */}
      {tab === "bbc" && (
        <div>
          {loadingBbc && <p className="text-center">Loading BBC news...</p>}
          {bbcError && (
            <div className="alert alert-danger text-center">{bbcError}</div>
          )}
          <div className="row g-4">
            {bbcNews.map((item, i) => {
              const imageUrl =
                item.images && item.images.length > 0
                  ? item.images[0].image_url
                  : null;
              const pubDate = item.publication_date
                ? new Date(item.publication_date).toLocaleString()
                : "Unknown";

              return (
                <div key={item.id || i} className="col-md-6 col-lg-4" data-aos="fade-up">
                  <div className="card h-100 border-0 shadow-lg transition rounded-4">
                    {imageUrl && i !== 0 && i !== bbcNews.length - 1 && (
                      <img
                        src={imageUrl}
                        className="card-img-top rounded-top-4"
                        alt={item.headline || "BBC news image"}
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fw-bold">{item.headline || "No headline"}</h5>
                      <p className="card-text text-muted">
                        <span className="badge bg-secondary me-1">
                          {item.author || "Unknown"}
                        </span>
                        <small>{pubDate}</small>
                      </p>
                      <p className="card-text small text-muted">{item.content}</p>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary mt-auto"
                      >
                        Read More →
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
