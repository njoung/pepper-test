import React, { useState, useEffect } from 'react'
import './App.css'
import ProductList from './ProductList'
import CartView from './CartView'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ViewToggle, { ViewOptions } from './ViewToggle'
import { Form } from 'react-bootstrap'

const BASE_URL = 'https://fakestoreapi.com'
const PRODUCTS_ENDPOINT = '/products'

function App() {
  const [products, setProducts] = useState({})
  const [cartProducts, setCartProducts] = useState({})
  const [currentView, setCurrentView] = useState(ViewOptions.ProductView)
  const [totalItems, setTotalItems] = useState(0)
  const [categoryFilterOptions, setCategoryFilterOptions] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('')
  
  const onUpdateQuantity = (product, newQuantity) => {
    const oldQuantity = product.id in cartProducts ? cartProducts[product.id] : 0
    setCartProducts((currentCartProducts) => {
      const newCartProducts = { ...currentCartProducts };
      if (newQuantity === 0) {
        delete newCartProducts[product.id]
      } else {
        newCartProducts[product.id] = newQuantity
      }
      return newCartProducts;
    });
    setTotalItems((currentQuantity) => currentQuantity + newQuantity - oldQuantity);
  };

  const onAddToCart = (product) => {
    const newQuantity = product.id in cartProducts ? cartProducts[product.id] + 1 : 1
    onUpdateQuantity(product, newQuantity)
  };

  const toggleView = () => {
    setCurrentView((lastView) => {
      if (lastView === ViewOptions.ProductView) {
        setCurrentView(ViewOptions.CartView)
      } else {
        setCurrentView(ViewOptions.ProductView)
      }
    })
  }

  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value)
  }

  useEffect(() => {
    fetch(`${BASE_URL}${PRODUCTS_ENDPOINT}`)
      .then(response => response.json())
      .then(productData => {
        setProducts(productData.reduce((acc, curr) => {
          acc[curr.id] = curr
          return acc
        }, {}))
        const categoriesSet = new Set();
        productData.forEach(product => {
          categoriesSet.add(product.category);
        });
        setCategoryFilterOptions([...categoriesSet])
      })
      .catch(error => console.error('Error fetching data:', error))
  }, [])

  return (
    <>
      <div className="persistent-header">
        <Container>
          <Row>
          <Col>
            <h1 className="store-name m-1">Fake Store</h1>
          </Col>
            <Col xs="auto" className='category-selector-dropdown'>
              {
                currentView === ViewOptions.ProductView ? 
                <Form.Select aria-label="Category selector" value={categoryFilter} onChange={handleCategoryChange}>
                  <option value="">Select Category</option>
                  {categoryFilterOptions.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </Form.Select>
                : null  
              }
            </Col>
          <Col xs="auto">
            <ViewToggle totalItems={totalItems} currentView={currentView} onToggleView={toggleView} />
          </Col>
        </Row>
        </Container>
      </div>
      <Container className="main-content">
        {
          currentView === ViewOptions.ProductView ? 
            <ProductList products={products} onAddToCart={onAddToCart} categoryFilter={categoryFilter} />
            : <CartView 
                products={products} 
                cart={cartProducts} 
                onUpdateQuantity={onUpdateQuantity} 
                totalItems={totalItems}
                handleContinueShopping={toggleView}
              />
        }
      </Container>
    </>
  )
}

export default App;
