import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";

const categories = [
  "Smartphones",
  "Laptops",
  "Audio",
  "Cameras",
  "Gaming",
  "Accessories",
  "TVs",
  "Tablets",
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "popular", label: "Most Popular" },
];

export default function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const category = params.get("category") || "";
  const search = params.get("search") || "";
  const sort = params.get("sort") || "newest";
  const page = Number(params.get("page") || 1);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setLoading(true);

    const q = new URLSearchParams({
      page,
      limit: 12,
      ...(category && { category }),
      ...(search && { search }),
      sort,
    });

    api
      .get(`/products?${q}`)
      .then((res) => {
        setProducts(res.data.products);
        setTotal(res.data.total);
        setPages(res.data.pages);
      })
      .finally(() => setLoading(false));
  }, [category, search, sort, page]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(params);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    next.delete("page");
    setParams(next);
  };

  return (
    <div style={styles.page}>
      <div
        style={{
          ...styles.container,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            ...styles.sidebar,
            width: isMobile ? "100%" : "250px",
            minWidth: isMobile ? "100%" : "250px",
            position: isMobile ? "static" : "sticky",
          }}
        >
          <h3 style={styles.filterTitle}>Filters</h3>

          <div style={styles.filterGroup}>
            <h4 style={styles.filterLabel}>Category</h4>

            <button
              onClick={() => updateFilter("category", "")}
              style={!category ? styles.activeFilter : styles.filterBtn}
            >
              All Products
            </button>

            {categories.map((c) => (
              <button
                key={c}
                onClick={() => updateFilter("category", c)}
                style={category === c ? styles.activeFilter : styles.filterBtn}
              >
                {c}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main style={styles.main}>
          <div
            style={{
              ...styles.topBar,
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "15px" : "0",
            }}
          >
            <span style={styles.resultCount}>
              {total} products found{" "}
              {search && (
                <strong>
                  for "{search}"
                </strong>
              )}
            </span>

            <select
              value={sort}
              onChange={(e) =>
                updateFilter("sort", e.target.value)
              }
              style={styles.sortSelect}
            >
              {sortOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div style={styles.loading}>
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>🔍</div>
              <h3>No Products Found</h3>
              <p>Try changing filters or search keywords.</p>
            </div>
          ) : (
            <div
              style={{
                ...styles.grid,
                gridTemplateColumns: isMobile
                  ? "repeat(2,1fr)"
                  : "repeat(auto-fill,minmax(250px,1fr))",
              }}
            >
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          )}

          {pages > 1 && (
            <div style={styles.pagination}>
              {Array.from(
                { length: pages },
                (_, i) => i + 1
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    const next = new URLSearchParams(params);
                    next.set("page", p);
                    setParams(next);
                  }}
                  style={
                    p === page
                      ? styles.activePage
                      : styles.pageBtn
                  }
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "24px 16px",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    alignItems: "flex-start",
    gap: "24px",
  },

  /* Sidebar */

  sidebar: {
    width: "240px",
    minWidth: "240px",
    background: "#ffffff",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    position: "sticky",
    top: "80px",
    alignSelf: "flex-start",
  },

  filterTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "18px",
  },

  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  filterLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#64748b",
    marginBottom: "8px",
  },

  filterBtn: {
    width: "100%",
    padding: "10px 12px",
    border: "none",
    borderRadius: "8px",
    background: "transparent",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
    color: "#475569",
  },

  activeFilter: {
    width: "100%",
    padding: "10px 12px",
    border: "none",
    borderRadius: "8px",
    background: "#e0f2fe",
    color: "#0284c7",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },

  /* Main Content */

  main: {
    flex: 1,
    minWidth: 0,
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#ffffff",
    padding: "14px 18px",
    borderRadius: "14px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    marginBottom: "20px",
  },

  resultCount: {
    fontSize: "14px",
    color: "#64748b",
    fontWeight: "500",
  },

  sortSelect: {
    padding: "10px 14px",
    border: "1px solid #dbe2ea",
    borderRadius: "8px",
    fontSize: "14px",
    background: "#ffffff",
    cursor: "pointer",
    outline: "none",
  },

  /* Product Grid */

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
    gap: "20px",
    alignItems: "stretch",
  },

  /* Loading */

  loading: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "80px 20px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "16px",
  },

  /* Empty State */

  empty: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "80px 20px",
    textAlign: "center",
    color: "#64748b",
  },

  /* Pagination */

  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "32px",
  },

  pageBtn: {
    width: "40px",
    height: "40px",
    border: "1px solid #dbe2ea",
    background: "#ffffff",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "0.2s",
  },

  activePage: {
    width: "40px",
    height: "40px",
    border: "none",
    background: "#0ea5e9",
    color: "#ffffff",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
  },
};