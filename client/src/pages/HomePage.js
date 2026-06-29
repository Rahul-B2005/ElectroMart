import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";
import "./HomePage.css";

const categories = [
  { name: "Smartphones", icon: "📱" },
  { name: "Laptops", icon: "💻" },
  { name: "Audio", icon: "🎧" },
  { name: "Cameras", icon: "📷" },
  { name: "Gaming", icon: "🎮" },
  { name: "TVs", icon: "📺" },
  { name: "Tablets", icon: "📟" },
  { name: "Accessories", icon: "🔌" },
];

const banners = [
  {
    text: "🎉 Sale On! Get up to 40% off on top brands — Limited time only.",
    link: "/products",
    linkText: "Shop Now →",
    bg: "linear-gradient(90deg, #1a1a2e, #16213e, #0f3460)",
  },
  {
    text: "🚚 Free Shipping on all orders above ₹1000 — No code needed!",
    link: "/products",
    linkText: "Order Now →",
    bg: "linear-gradient(90deg, #11998e, #38ef7d, #11998e)",
    dark: true,
  },
  {
    text: "📱 New Arrivals: iPhone 16 & Samsung S25 now in stock!",
    link: "/products?category=Smartphones",
    linkText: "Explore →",
    bg: "linear-gradient(90deg, #fc4a1a, #f7b733, #fc4a1a)",
    dark: true,
  },
  {
    text: "🎮 Gaming Week: Up to 30% off on consoles & accessories.",
    link: "/products?category=Gaming",
    linkText: "Play More →",
    bg: "linear-gradient(90deg, #6a11cb, #2575fc, #6a11cb)",
  },
  {
    text: "🔒 Secure Payments • Easy Returns • 24/7 Support — Shop with confidence.",
    link: "/products",
    linkText: "Shop Now →",
    bg: "linear-gradient(90deg, #c94b4b, #4b134f, #c94b4b)",
  },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [search, setSearch] = useState("");
  const [bannerVisible, setBannerVisible] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/products?featured=true&limit=8")
      .then((res) => setFeatured(res.data.products));
  }, []);

  // Auto-rotate banners every 3.5 seconds
  useEffect(() => {
    if (!bannerVisible) return;
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
        setAnimating(false);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, [bannerVisible]);

  // Show scroll-to-top button after scrolling down 400px
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${search}`);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToBanner = (index) => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentBanner(index);
      setAnimating(false);
    }, 400);
  };

  const banner = banners[currentBanner];

  return (
    <div className="home">

      {/* ROTATING ANNOUNCEMENT BANNER */}
      {bannerVisible && (
        <div
          className={`announcement-banner ${animating ? "banner-fade-out" : "banner-fade-in"}`}
          style={{ background: banner.bg }}
        >
          <span className={banner.dark ? "banner-text dark" : "banner-text"}>
            {banner.text}{" "}
            <Link
              to={banner.link}
              className={banner.dark ? "banner-link dark" : "banner-link"}
            >
              {banner.linkText}
            </Link>
          </span>

          {/* Dot indicators */}
          <div className="banner-dots">
            {banners.map((_, i) => (
              <button
                key={i}
                className={`banner-dot ${i === currentBanner ? "active" : ""}`}
                onClick={() => goToBanner(i)}
                aria-label={`Go to banner ${i + 1}`}
              />
            ))}
          </div>

          <button
            className={banner.dark ? "banner-close dark" : "banner-close"}
            onClick={() => setBannerVisible(false)}
            aria-label="Close announcement"
          >
            ✕
          </button>
        </div>
      )}

      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay">
          <h1>
            Discover The Future Of
            <span> Electronics</span>
          </h1>
          <p>Premium gadgets, unbeatable prices and latest technology.</p>
          <form onSubmit={handleSearch} className="search-box">
            <input
              type="text"
              placeholder="Search iPhone, Samsung, MacBook..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          <div className="hero-buttons">
            <Link to="/products" className="btn-primary">Shop Now</Link>
            <Link to="/products" className="btn-secondary">Explore</Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="stat-card"><h2>10K+</h2><p>Customers</p></div>
        <div className="stat-card"><h2>80+</h2><p>Products</p></div>
        <div className="stat-card"><h2>99%</h2><p>Happy Buyers</p></div>
        <div className="stat-card"><h2>24/7</h2><p>Support</p></div>
      </section>

      {/* CATEGORIES */}
      <section className="categories">
        <h2>Shop By Category</h2>
        <div className="category-grid">
          {categories.map((item) => (
            <Link
              key={item.name}
              to={`/products?category=${item.name}`}
              className="category-card"
            >
              <div className="icon">{item.icon}</div>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="featured">
        <div className="section-header">
          <h2>Featured Products</h2>
          <Link to="/products">View All →</Link>
        </div>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* OFFER BANNER */}
      <section className="offer-banner">
        <h2>Free Shipping On Orders Above ₹1000</h2>
        <p>Fast Delivery • Secure Payment • Easy Returns</p>
        <Link to="/products">Shop Now</Link>
      </section>

      {/* SCROLL TO TOP */}
      {showScrollTop && (
        <button
          className="scroll-to-top"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}

    </div>
  );
}
