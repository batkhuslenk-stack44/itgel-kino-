// ==========================================================================
// ITGEL KINO - ҮНДСЭН JS КОД (Interactivity & State Management)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // App State
  let currentGenre = "Бүгд";
  let searchQuery = "";
  let currentSort = "rating-desc";
  let activeMovieForModal = null;

  // LocalStorage Keys
  const LS_WATCHLIST_KEY = "itgel_kino_watchlist";
  const LS_REVIEWS_KEY = "itgel_kino_reviews";

  // Load Watchlist from LocalStorage
  function getWatchlist() {
    try {
      const data = localStorage.getItem(LS_WATCHLIST_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Watchlist load error:", e);
      return [];
    }
  }

  function saveWatchlist(list) {
    try {
      localStorage.setItem(LS_WATCHLIST_KEY, JSON.stringify(list));
      updateWatchlistBadge();
    } catch (e) {
      console.error("Watchlist save error:", e);
    }
  }

  // Load Reviews from LocalStorage or Fallback
  function getMovieReviews(movieId) {
    try {
      const allReviews = JSON.parse(localStorage.getItem(LS_REVIEWS_KEY)) || INITIAL_REVIEWS;
      return allReviews[movieId] || [];
    } catch (e) {
      return INITIAL_REVIEWS[movieId] || [];
    }
  }

  function saveNewReview(movieId, reviewObj) {
    try {
      const allReviews = JSON.parse(localStorage.getItem(LS_REVIEWS_KEY)) || { ...INITIAL_REVIEWS };
      if (!allReviews[movieId]) {
        allReviews[movieId] = [];
      }
      allReviews[movieId].unshift(reviewObj);
      localStorage.setItem(LS_REVIEWS_KEY, JSON.stringify(allReviews));
    } catch (e) {
      console.error("Review save error:", e);
    }
  }

  // Toast Notification
  const toastEl = document.getElementById("toastNotification");
  let toastTimer = null;
  function showToast(message) {
    if (!toastEl) return;
    toastEl.querySelector(".toast-message").textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove("show");
    }, 3200);
  }

  // DOM Elements
  const moviesGridEl = document.getElementById("moviesGrid");
  const genrePillsContainer = document.getElementById("genrePills");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const siteHeader = document.querySelector(".site-header");
  const mobileNavToggle = document.getElementById("mobileNavToggle");
  const navMenu = document.getElementById("navMenu");

  // Watchlist Drawer Elements
  const btnWatchlistToggle = document.getElementById("btnWatchlistToggle");
  const watchlistDrawer = document.getElementById("watchlistDrawer");
  const btnCloseDrawer = document.getElementById("btnCloseDrawer");
  const drawerWatchlistContent = document.getElementById("drawerWatchlistContent");
  const watchlistCountBadge = document.getElementById("watchlistCountBadge");

  // Video Player Modal Elements
  const playerModal = document.getElementById("playerModal");
  const btnClosePlayer = document.getElementById("btnClosePlayer");
  const playerMovieTitle = document.getElementById("playerMovieTitle");
  const mainVideoPlayer = document.getElementById("mainVideoPlayer");

  // Movie Detail Modal Elements
  const detailModal = document.getElementById("detailModal");
  const btnCloseDetail = document.getElementById("btnCloseDetail");
  const detailModalBody = document.getElementById("detailModalBody");

  // Header Scroll Effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  });

  // Mobile Nav Toggle
  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });
    // Close nav on click link
    navMenu.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => navMenu.classList.remove("open"));
    });
  }

  // Render Genre Filter Buttons
  function renderGenrePills() {
    if (!genrePillsContainer) return;
    genrePillsContainer.innerHTML = "";
    GENRES_LIST.forEach(genre => {
      const btn = document.createElement("button");
      btn.className = `genre-btn ${genre === currentGenre ? "active" : ""}`;
      btn.textContent = genre;
      btn.addEventListener("click", () => {
        currentGenre = genre;
        document.querySelectorAll(".genre-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderMovies();
      });
      genrePillsContainer.appendChild(btn);
    });
  }

  // Filter & Sort Logic
  function getFilteredMovies() {
    return MOVIES_DATA.filter(movie => {
      // Genre filter
      const matchesGenre = currentGenre === "Бүгд" || movie.genres.includes(currentGenre);

      // Search filter
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        movie.title.toLowerCase().includes(q) ||
        movie.englishTitle.toLowerCase().includes(q) ||
        movie.director.toLowerCase().includes(q) ||
        movie.cast.some(actor => actor.toLowerCase().includes(q));

      return matchesGenre && matchesSearch;
    }).sort((a, b) => {
      if (currentSort === "rating-desc") return b.rating - a.rating;
      if (currentSort === "rating-asc") return a.rating - b.rating;
      if (currentSort === "year-desc") return b.year - a.year;
      if (currentSort === "year-asc") return a.year - b.year;
      if (currentSort === "title-asc") return a.title.localeCompare(b.title);
      return 0;
    });
  }

  // Render Movies Grid
  function renderMovies() {
    if (!moviesGridEl) return;
    const filtered = getFilteredMovies();
    const watchlist = getWatchlist();

    if (filtered.length === 0) {
      moviesGridEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🎬</div>
          <h3>Хайлт олдсонгүй</h3>
          <p>"${searchQuery}" түлхүүр үгээр эсвэл сонгосон жанрт кино олдсонгүй. Өөр үгээр хайж үзнэ үү.</p>
        </div>
      `;
      return;
    }

    moviesGridEl.innerHTML = filtered
      .map(movie => {
        const isBookmarked = watchlist.includes(movie.id);
        return `
        <article class="movie-card" data-id="${movie.id}">
          <div class="card-poster">
            <img src="${movie.poster}" alt="${movie.title}" loading="lazy" />
            <span class="card-badge">${movie.quality}</span>
            <button class="card-bookmark-btn ${isBookmarked ? "active" : ""}" 
                    data-action="toggle-watchlist" 
                    data-id="${movie.id}" 
                    title="${isBookmarked ? "Жагсаалтаас хасах" : "Жагсаалтад нэмэх"}">
              ${isBookmarked ? "★" : "☆"}
            </button>
            <div class="card-overlay" data-action="open-detail" data-id="${movie.id}">
              <button class="card-play-btn" data-action="play-movie" data-id="${movie.id}" title="Үзэх">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="card-info" data-action="open-detail" data-id="${movie.id}">
            <h3 class="card-title" title="${movie.title}">${movie.title}</h3>
            <div class="card-meta">
              <span>${movie.year} • ${movie.duration}</span>
              <span class="card-rating">★ ${movie.rating}</span>
            </div>
            <div class="card-genres">${movie.genres.join(", ")}</div>
          </div>
        </article>
      `;
      })
      .join("");

    // Attach Event Listeners to cards
    moviesGridEl.querySelectorAll(".movie-card").forEach(card => {
      const movieId = card.getAttribute("data-id");

      // Bookmark Click
      const bookmarkBtn = card.querySelector('[data-action="toggle-watchlist"]');
      if (bookmarkBtn) {
        bookmarkBtn.addEventListener("click", e => {
          e.stopPropagation();
          toggleWatchlist(movieId);
        });
      }

      // Play Button Click
      const playBtn = card.querySelector('[data-action="play-movie"]');
      if (playBtn) {
        playBtn.addEventListener("click", e => {
          e.stopPropagation();
          openVideoPlayer(movieId);
        });
      }

      // Card / Overlay Click -> Open Details
      card.addEventListener("click", () => {
        openMovieDetail(movieId);
      });
    });
  }

  // Toggle Movie in Watchlist
  function toggleWatchlist(movieId) {
    let list = getWatchlist();
    const movie = MOVIES_DATA.find(m => m.id === movieId);
    const title = movie ? movie.title : "Кино";

    if (list.includes(movieId)) {
      list = list.filter(id => id !== movieId);
      saveWatchlist(list);
      showToast(`"${title}" миний жагсаалтаас хасагдлаа.`);
    } else {
      list.push(movieId);
      saveWatchlist(list);
      showToast(`"${title}" миний жагсаалтад нэмэгдлээ!`);
    }
    renderMovies();
    renderWatchlistDrawer();
  }

  // Update Watchlist Badge Count
  function updateWatchlistBadge() {
    const list = getWatchlist();
    if (watchlistCountBadge) {
      watchlistCountBadge.textContent = list.length;
    }
  }

  // Render Watchlist Drawer
  function renderWatchlistDrawer() {
    if (!drawerWatchlistContent) return;
    const list = getWatchlist();
    const savedMovies = MOVIES_DATA.filter(m => list.includes(m.id));

    if (savedMovies.length === 0) {
      drawerWatchlistContent.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">📑</div>
          <p>Таны жагсаалтад одоогоор кино ороогүй байна.</p>
          <p style="font-size: 0.85rem; margin-top: 6px;">Дуртай киноныхоо од товчийг дарж хадгалаарай.</p>
        </div>
      `;
      return;
    }

    drawerWatchlistContent.innerHTML = savedMovies
      .map(
        m => `
      <div class="watchlist-item" data-id="${m.id}">
        <img src="${m.poster}" alt="${m.title}">
        <div class="watchlist-item-info">
          <div class="watchlist-item-title">${m.title}</div>
          <div class="watchlist-item-meta">${m.year} • ★ ${m.rating}</div>
          <button class="btn-primary" style="padding: 4px 12px; font-size: 0.75rem; margin-top: 6px;" onclick="window.playFromDrawer('${m.id}')">
            Үзэх
          </button>
        </div>
        <button class="btn-remove-item" title="Хасах" onclick="window.removeFromDrawer('${m.id}')">✕</button>
      </div>
    `
      )
      .join("");
  }

  // Global helper for drawer buttons
  window.removeFromDrawer = function (id) {
    toggleWatchlist(id);
  };
  window.playFromDrawer = function (id) {
    closeWatchlistDrawer();
    openVideoPlayer(id);
  };

  function openWatchlistDrawer() {
    renderWatchlistDrawer();
    watchlistDrawer.classList.add("active");
  }

  function closeWatchlistDrawer() {
    watchlistDrawer.classList.remove("active");
  }

  if (btnWatchlistToggle) {
    btnWatchlistToggle.addEventListener("click", openWatchlistDrawer);
  }
  if (btnCloseDrawer) {
    btnCloseDrawer.addEventListener("click", closeWatchlistDrawer);
  }

  // ==========================================================================
  // VIDEO PLAYER MODAL LOGIC
  // ==========================================================================
  function openVideoPlayer(movieId) {
    const movie = MOVIES_DATA.find(m => m.id === movieId);
    if (!movie) return;

    playerMovieTitle.textContent = `${movie.title} (${movie.year}) - 4K HD Тоглуулагч`;
    mainVideoPlayer.src = movie.streamUrl;
    mainVideoPlayer.poster = movie.backdrop;
    mainVideoPlayer.load();

    playerModal.classList.add("active");
    mainVideoPlayer.play().catch(e => {
      console.log("Autoplay was prevented, waiting for user click.", e);
    });
  }

  function closeVideoPlayer() {
    if (mainVideoPlayer) {
      mainVideoPlayer.pause();
      mainVideoPlayer.src = "";
    }
    playerModal.classList.remove("active");
  }

  if (btnClosePlayer) {
    btnClosePlayer.addEventListener("click", closeVideoPlayer);
  }

  // ==========================================================================
  // MOVIE DETAIL MODAL LOGIC
  // ==========================================================================
  function openMovieDetail(movieId) {
    const movie = MOVIES_DATA.find(m => m.id === movieId);
    if (!movie) return;

    activeMovieForModal = movie;
    const watchlist = getWatchlist();
    const isBookmarked = watchlist.includes(movie.id);
    const reviews = getMovieReviews(movie.id);

    detailModalBody.innerHTML = `
      <div class="detail-grid">
        <div class="detail-poster">
          <img src="${movie.poster}" alt="${movie.title}">
          <div style="margin-top: 16px; display: flex; flex-direction: column; gap: 10px;">
            <button class="btn-primary" style="width: 100%; justify-content: center;" id="modalPlayBtn">
              ▶ Шууд үзэх
            </button>
            <button class="btn-secondary" style="width: 100%; justify-content: center;" id="modalWatchlistBtn">
              ${isBookmarked ? "★ Жагсаалтад байна" : "☆ Жагсаалтад нэмэх"}
            </button>
          </div>
        </div>
        <div class="detail-info">
          <h2>${movie.title}</h2>
          <div class="detail-eng">${movie.englishTitle}</div>
          
          <div class="detail-meta-row">
            <span class="badge-rating">★ ${movie.rating} (${movie.ratingCount} үнэлгээ)</span>
            <span class="badge-meta">${movie.year} он</span>
            <span class="badge-meta">${movie.duration}</span>
            <span class="badge-meta">${movie.ageRating}</span>
            <span class="badge-meta" style="color: var(--accent-gold);">${movie.quality}</span>
          </div>

          <p class="detail-desc">${movie.synopsis}</p>

          <blockquote style="border-left: 3px solid var(--accent-red); padding-left: 14px; margin-bottom: 20px; font-style: italic; color: var(--accent-gold);">
            "${movie.quote}"
          </blockquote>

          <div class="detail-specs">
            <div class="specs-label">Найруулагч:</div>
            <div class="specs-value">${movie.director}</div>

            <div class="specs-label">Дүрүүдэд:</div>
            <div class="specs-value">${movie.cast.join(", ")}</div>

            <div class="specs-label">Төрөл жанр:</div>
            <div class="specs-value">${movie.genres.join(", ")}</div>

            <div class="specs-label">Бүтээсэн:</div>
            <div class="specs-value">${movie.production}</div>

            ${
              movie.awards && movie.awards.length
                ? `
              <div class="specs-label">Шагнал:</div>
              <div class="specs-value" style="color: var(--accent-gold);">
                ${movie.awards.map(a => `<div>🏆 ${a}</div>`).join("")}
              </div>
            `
                : ""
            }
          </div>

          <!-- Reviews Section -->
          <div class="detail-reviews">
            <div class="reviews-title">
              <span>Үзэгчдийн сэтгэгдэл (${reviews.length})</span>
            </div>

            <!-- New Review Form -->
            <form class="review-form" id="newReviewForm">
              <div class="review-form-row">
                <input type="text" class="review-input" id="reviewAuthor" placeholder="Таны нэр" required>
                <select class="review-input" id="reviewRating" style="max-width: 140px;">
                  <option value="5">★★★★★ (5/5)</option>
                  <option value="4">★★★★☆ (4/5)</option>
                  <option value="3">★★★☆☆ (3/5)</option>
                  <option value="2">★★☆☆☆ (2/5)</option>
                  <option value="1">★☆☆☆☆ (1/5)</option>
                </select>
              </div>
              <textarea class="review-textarea" id="reviewComment" placeholder="Энэ киноны тухай сэтгэгдлээ хуваалцаарай..." required></textarea>
              <button type="submit" class="btn-primary" style="padding: 8px 18px; font-size: 0.9rem;">
                Сэтгэгдэл илгээх
              </button>
            </form>

            <div class="reviews-list">
              ${
                reviews.length === 0
                  ? '<div style="color: var(--text-muted); font-size: 0.9rem;">Одоогоор сэтгэгдэл бичигдээгүй байна. Анхны сэтгэгдлийг та бичээрэй!</div>'
                  : reviews
                      .map(
                        r => `
                    <div class="review-card">
                      <div class="review-card-head">
                        <span class="review-author">${r.author}</span>
                        <span class="review-date">${"★".repeat(r.rating || 5)} • ${r.date}</span>
                      </div>
                      <div class="review-comment">${r.comment}</div>
                    </div>
                  `
                      )
                      .join("")
              }
            </div>
          </div>
        </div>
      </div>
    `;

    // Hook internal buttons
    const modalPlayBtn = document.getElementById("modalPlayBtn");
    if (modalPlayBtn) {
      modalPlayBtn.addEventListener("click", () => {
        closeMovieDetail();
        openVideoPlayer(movie.id);
      });
    }

    const modalWatchlistBtn = document.getElementById("modalWatchlistBtn");
    if (modalWatchlistBtn) {
      modalWatchlistBtn.addEventListener("click", () => {
        toggleWatchlist(movie.id);
        const updatedList = getWatchlist();
        const updatedBookmarked = updatedList.includes(movie.id);
        modalWatchlistBtn.textContent = updatedBookmarked
          ? "★ Жагсаалтад байна"
          : "☆ Жагсаалтад нэмэх";
      });
    }

    // Hook review submit
    const newReviewForm = document.getElementById("newReviewForm");
    if (newReviewForm) {
      newReviewForm.addEventListener("submit", e => {
        e.preventDefault();
        const author = document.getElementById("reviewAuthor").value.trim();
        const rating = parseInt(document.getElementById("reviewRating").value, 10);
        const comment = document.getElementById("reviewComment").value.trim();

        if (author && comment) {
          const today = new Date().toISOString().split("T")[0];
          const newObj = {
            author,
            avatar: author.charAt(0).toUpperCase(),
            rating,
            date: today,
            comment
          };
          saveNewReview(movie.id, newObj);
          showToast("Таны сэтгэгдэл амжилттай нэмэгдлээ!");
          openMovieDetail(movie.id); // Re-render modal with updated reviews
        }
      });
    }

    detailModal.classList.add("active");
  }

  function closeMovieDetail() {
    detailModal.classList.remove("active");
  }

  if (btnCloseDetail) {
    btnCloseDetail.addEventListener("click", closeMovieDetail);
  }

  // Backdrop / Escape Key Click Listeners for Modals
  [playerModal, detailModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener("click", e => {
      if (e.target === modal) {
        if (modal === playerModal) closeVideoPlayer();
        if (modal === detailModal) closeMovieDetail();
      }
    });
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeVideoPlayer();
      closeMovieDetail();
      closeWatchlistDrawer();
    }
  });

  // Search Input Listener
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      searchQuery = e.target.value;
      renderMovies();
    });
  }

  // Sort Select Listener
  if (sortSelect) {
    sortSelect.addEventListener("change", e => {
      currentSort = e.target.value;
      renderMovies();
    });
  }

  // Request Form Submit
  const requestForm = document.getElementById("requestMovieForm");
  if (requestForm) {
    requestForm.addEventListener("submit", e => {
      e.preventDefault();
      const movieTitle = document.getElementById("requestTitle").value;
      showToast(`Баярлалаа! "${movieTitle}" киног оруулах хүсэлтийг хүлээн авлаа.`);
      requestForm.reset();
    });
  }

  // Setup Global Hero Action Buttons
  const heroPlayBtn = document.getElementById("heroPlayBtn");
  if (heroPlayBtn) {
    heroPlayBtn.addEventListener("click", () => openVideoPlayer("itgel-2016"));
  }

  const heroTrailerBtn = document.getElementById("heroTrailerBtn");
  if (heroTrailerBtn) {
    heroTrailerBtn.addEventListener("click", () => openVideoPlayer("itgel-2016"));
  }

  const heroBookmarkBtn = document.getElementById("heroBookmarkBtn");
  if (heroBookmarkBtn) {
    heroBookmarkBtn.addEventListener("click", () => {
      toggleWatchlist("itgel-2016");
      const list = getWatchlist();
      if (list.includes("itgel-2016")) {
        heroBookmarkBtn.classList.add("bookmarked");
        heroBookmarkBtn.innerHTML = "★";
      } else {
        heroBookmarkBtn.classList.remove("bookmarked");
        heroBookmarkBtn.innerHTML = "☆";
      }
    });
  }

  const spotlightWatchBtn = document.getElementById("spotlightWatchBtn");
  if (spotlightWatchBtn) {
    spotlightWatchBtn.addEventListener("click", () => openVideoPlayer("itgel-2016"));
  }

  const spotlightDetailBtn = document.getElementById("spotlightDetailBtn");
  if (spotlightDetailBtn) {
    spotlightDetailBtn.addEventListener("click", () => openMovieDetail("itgel-2016"));
  }

  // Server switch buttons in player modal
  const serverBtns = document.querySelectorAll(".server-btn");
  serverBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      serverBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const server = btn.getAttribute("data-server");
      showToast(`${server}-рүү амжилттай холбогдлоо.`);
    });
  });

  // Initial Initialization
  renderGenrePills();
  renderMovies();
  updateWatchlistBadge();
});
