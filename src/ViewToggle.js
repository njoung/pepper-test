export const ViewOptions = {
  ProductView: 'ProductView',
  CartView: 'CartView',
};

function ViewToggle({ 
  totalItems,
  currentView,
  onToggleView,
}) {
  return (
    <>
      <button className="show-cart-btn" onClick={onToggleView}>
        {
          currentView === ViewOptions.ProductView ? 
            <>Show Cart ({totalItems})</>
            : <>Close</>
        }
        
      </button>
    </>
  );
}

export default ViewToggle
