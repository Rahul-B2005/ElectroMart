import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './ProductDetail.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [review, setReview] = useState({
    rating: 5,
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => navigate('/products'));
  }, [id, navigate]);

  if (!product) {
    return (
      <div className="loading">
        Loading...
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success('Added to cart');
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  const handleReview = async (e) => {
    e.preventDefault();

    if (!user) {
      return toast.error('Please login first');
    }

    try {
      setSubmitting(true);

      await api.post(
        `/products/${id}/reviews`,
        review
      );

      toast.success('Review submitted');

      const { data } = await api.get(
        `/products/${id}`
      );

      setProduct(data);

      setReview({
        rating: 5,
        comment: '',
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Failed to submit review'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const specs = product.specifications
    ? Object.entries(product.specifications)
    : [];

  return (
    <>
      <div className="product-page">
        <div className="product-container">

          <div className="image-section">
            <div className="main-image">
              <img
                src={
                  product.images?.[imgIdx] ||
                  'https://via.placeholder.com/500'
                }
                alt={product.name}
              />
            </div>

            {product.images?.length > 1 && (
              <div className="thumbs">
                {product.images.map(
                  (img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt=""
                      className={
                        index === imgIdx
                          ? 'thumb active'
                          : 'thumb'
                      }
                      onClick={() =>
                        setImgIdx(index)
                      }
                    />
                  )
                )}
              </div>
            )}
          </div>

          <div className="info-section">
            <p className="product-brand">
              {product.brand}
            </p>

            <h1 className="product-name">
              {product.name}
            </h1>

            <div className="rating-row">
              <span className="stars">
                {'★'.repeat(
                  Math.round(product.rating)
                )}
                {'☆'.repeat(
                  5 -
                    Math.round(
                      product.rating
                    )
                )}
              </span>

              <span>
                {product.rating.toFixed(1)}
                ({product.numReviews}
                reviews)
              </span>
            </div>

            <div className="price-row">
              <span className="price">
                ₹
                {product.price.toLocaleString()}
              </span>

              {product.originalPrice >
                product.price && (
                <>
                  <span className="original-price">
                    ₹
                    {product.originalPrice.toLocaleString()}
                  </span>

                  <span className="discount">
                    {Math.round(
                      (1 -
                        product.price /
                          product.originalPrice) *
                        100
                    )}
                    % OFF
                  </span>
                </>
              )}
            </div>

            <p className="description">
              {product.description}
            </p>

            {specs.length > 0 && (
              <div className="specs">
                <h3>
                  Specifications
                </h3>

                {specs.map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="spec-row"
                    >
                      <span>
                        {key}
                      </span>
                      <span>
                        {value}
                      </span>
                    </div>
                  )
                )}
              </div>
            )}

            <div className="stock-row">
              {product.stock > 0
                ? `✓ In Stock (${product.stock} left)`
                : 'Out Of Stock'}
            </div>

            {product.stock > 0 && (
              <div className="qty-row">
                <button
                  className="qty-btn"
                  onClick={() =>
                    setQty(
                      Math.max(
                        1,
                        qty - 1
                      )
                    )
                  }
                >
                  -
                </button>

                <span>
                  {qty}
                </span>

                <button
                  className="qty-btn"
                  onClick={() =>
                    setQty(
                      Math.min(
                        product.stock,
                        qty + 1
                      )
                    )
                  }
                >
                  +
                </button>
              </div>
            )}

            <div className="btn-row">
              <button
                className="cart-btn"
                onClick={
                  handleAddToCart
                }
              >
                Add To Cart
              </button>

              <button
                className="buy-btn"
                onClick={
                  handleBuyNow
                }
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <div className="review-section">
          <div className="product-container">
            <h2>
              Customer Reviews
            </h2>

            {product.reviews?.map(
              (r) => (
                <div
                  key={r._id}
                  className="review-card"
                >
                  <div className="review-header">
                    <strong>
                      {r.name}
                    </strong>

                    <span>
                      {'★'.repeat(
                        r.rating
                      )}
                    </span>
                  </div>

                  <p>
                    {r.comment}
                  </p>
                </div>
              )
            )}

            {user && (
              <form
                className="review-form"
                onSubmit={
                  handleReview
                }
              >
                <select
                  className="review-input"
                  value={
                    review.rating
                  }
                  onChange={(e) =>
                    setReview({
                      ...review,
                      rating:
                        Number(
                          e.target
                            .value
                        ),
                    })
                  }
                >
                  {[5,4,3,2,1].map(
                    (r) => (
                      <option
                        key={r}
                        value={r}
                      >
                        {r} Stars
                      </option>
                    )
                  )}
                </select>

                <textarea
                  rows="4"
                  className="review-input"
                  placeholder="Write review..."
                  value={
                    review.comment
                  }
                  onChange={(e) =>
                    setReview({
                      ...review,
                      comment:
                        e.target
                          .value,
                    })
                  }
                />

                <button
                  className="review-btn"
                  disabled={
                    submitting
                  }
                >
                  {submitting
                    ? 'Submitting...'
                    : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}