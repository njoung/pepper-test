import React, { useEffect, useState, memo } from 'react'
import './App.css'
import Row from 'react-bootstrap/Row'

const ProductItem = memo(({product, onAddToCart}) => {
  const [buttonLabel, setButtonLabel] = useState('Add to Cart');
  const [clicked, setClicked] = useState(false);
 
  useEffect(() => {
    let timer;
    if (clicked) {
      setButtonLabel('Added!');
      timer = setTimeout(() => {
        setButtonLabel('Add to Cart');
        setClicked(false);
      }, 500);
    }

    return () => clearTimeout(timer);
  }, [clicked]);

  const handleClick = () => {
    onAddToCart(product)
    setClicked(true)
  };

  return (<Row key={product.id} className="product-row">
      <img src={product.image} alt={product.title} className="product-image" />
      <div className="product-details">
        <h5>{product.title}</h5>
        <p><strong>Price:</strong> ${product.price}</p>
        <p><strong>Rating:</strong> {product.rating.rate} ({product.rating.count} reviews)</p>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Product Description:</strong></p>
        <p className="product-description">{product.description}</p>
        <button onClick={handleClick}>{buttonLabel}</button>
      </div>
    </Row>
  )
})

function ProductList({ 
  products,
  onAddToCart,
  categoryFilter,
}) {
  return (
    <>
      <div className="products-container">
        {Object.values(products).filter(product => {
          return !categoryFilter || product.category === categoryFilter
        }).map(product => (
          <ProductItem key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
    </>
  );
}

export default ProductList
