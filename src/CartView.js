import React, { useState, memo } from 'react'
import './App.css'
import Row from 'react-bootstrap/Row'

const CartItem = memo(({product, onUpdateQuantity, quantity }) => {
  return (<Row key={product.id} className="cart-product">
      <img src={product.image} alt={product.title} className="cart-product-image" />
      <div className="cart-product-details">
        <h3>{product.title}</h3>
        <p>Unit Price: ${product.price.toFixed(2)}</p>
        <p>Quantity: {quantity}</p>
        <button className="cart-remove-btn" onClick={() => onUpdateQuantity(product, quantity-1)}>Remove from Cart</button>
      </div>
    </Row>
  )
})

function CartView({ 
  products,
  cart,
  onUpdateQuantity,
  handleContinueShopping,
}) {
  const [didCheckOut, setDidCheckOut] = useState(false)
  const totalCost = Object.keys(cart).reduce((total, productId) => {
    return total + (products[productId].price * cart[productId]);
  }, 0);

  const handleCheckOut = () => {
    setDidCheckOut(true)
    Object.keys(cart).forEach((id) => {
      onUpdateQuantity(products[id], 0)
    })
  }

  if (didCheckOut) {
    return <>
      <h2 className='cart-empty-text'>Thanks for purchasing, your items are on the way!</h2>
      <div className="continue-shopping-btn-container">
        <button onClick={handleContinueShopping} className="checkout-btn">Continue Shopping</button>
      </div>
    </>
  }

  if (Object.keys(cart).length === 0) {
    return <>
      <h2 className='cart-empty-text'>There's nothing here. Try adding to your cart!</h2>
      <div className="continue-shopping-btn-container">
        <button onClick={handleContinueShopping} className="checkout-btn">Continue Shopping</button>
      </div>
    </>
  }

  return (
    <>
      <div className="cart-products-container">
        {Object.keys(cart).map(productId => {
          return <CartItem product={products[productId]} onUpdateQuantity={onUpdateQuantity} quantity={cart[productId]} key={productId} />;
        })}
        <div className="checkout-btn-container">
          <button onClick={handleCheckOut} className="checkout-btn">Checkout (${totalCost.toFixed(2)})</button>
        </div>
      </div>
    </>
  );
}

export default CartView
