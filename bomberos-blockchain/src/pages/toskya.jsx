import React, { createContext, useContext, useReducer, useState } from "react";
import { FaShoppingCart, FaMoon, FaSun, FaTrash } from "react-icons/fa";

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      const existingItem = state.items.find(item => 
        item.id === action.payload.id && item.size === action.payload.size
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id && item.size === action.payload.size
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + (action.payload.price * action.payload.sizeMultiplier)
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + (action.payload.price * action.payload.sizeMultiplier)
      };

    case "REMOVE_ITEM":
      const itemToRemove = state.items.find(item => item.uniqueId === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item.uniqueId !== action.payload),
        total: state.total - (itemToRemove.price * itemToRemove.sizeMultiplier * itemToRemove.quantity)
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map(item =>
          item.uniqueId === action.payload.uniqueId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.items.reduce((acc, item) => {
          if (item.uniqueId === action.payload.uniqueId) {
            return acc + (item.price * item.sizeMultiplier * action.payload.quantity);
          }
          return acc + (item.price * item.sizeMultiplier * item.quantity);
        }, 0)
      };

    default:
      return state;
  }
};

const menuData = [
  {
    id: 1,
    name: "Toskya clasica",
    description: "Hamburguesa ahumada con doble chaddar en pan de papa",
    price: 7500,
    category: "Classic Burgers",
    image: "https://lh3.google.com/u/0/d/1Q__nokW8U57M0UnvCzKx1PbATDyXbQvd=w1920-h933-iv1?auditContext=forDisplay"
  },
  {
    id: 2,
    name: "Fresh Toskya",
    description: "Hamburguesa ahumada con salsa tasty, cebolla, lechuga, tomate y en pan de papa",
    price: 8300,
    category: "Signature Burgers",
    image: "https://lh3.google.com/u/0/d/1Hi6b0MXAgmlPolJHyZNNiCi6iZUJHLhU=w1920-h933-iv1?auditContext=forDisplay"
  },
  {
    id: 3,
    name: "Smoky Bacon Jam",
    description: "Hamburguesa ahumada con mermelada de bacon, cheddar, cebolla caramelizada y en pan de papa",
    price: 8600,
    category: "Signature Burgers",
    image: "https://lh3.google.com/u/0/d/1w-7jHdLHdz7DS6YQZhxoOO_pmhOhQBQU=w2000-h2228-iv1?auditContext=forDisplay"
  },
  {
    id: 4,
    name: "La Slider",
    description: "Combo degustacion en version simple de nuestras 3 hamburguesas mas populares",
    price: 10500,
    category: "Signature Burgers",
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360"
  },
  {
    id: 5,
    name: "La Azuleña",
    description: "Hamburgueza ahumada con queso azul y salsa golf en pan de papa",
    price: 8500,
    category: "Signature Burgers",
    image: "https://lh3.google.com/u/0/d/1pos2_z9Anh1U0L29id0moA2dhTZ0mz2S=w2000-h2228-iv1?auditContext=forDisplay"
  }
];

const HeroSection = () => (
  <div className="relative h-screen bg-black">
    <div className="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1550317138-10000687a72b"
        alt="Hero background"
        className="w-full h-full object-cover opacity-50"
      />
    </div>
    <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-4">
      <img
        src="https://images.unsplash.com/photo-1586190848861-99aa4a171e90"
        alt="Toskya Logo"
        className="w-32 h-32 rounded-full mb-6"
      />
      <h1 className="text-5xl font-bold mb-4">Toskya Burger</h1>
      <p className="text-2xl mb-8">Sabor Extraordinario</p>
      <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-all">
        View Menu
      </button>
    </div>
  </div>
);

const ProductCard = ({ product, addToCart }) => {
  const [selectedSize, setSelectedSize] = useState("simple");
  
  const sizeMultipliers = {
    simple: 1,
    doble: 1.13,
    triple: 2.25
  };

  const handleAddToCart = () => {
    const uniqueId = `${product.id}-${selectedSize}`;
    addToCart({
      ...product,
      uniqueId,
      size: selectedSize,
      sizeMultiplier: sizeMultipliers[selectedSize]
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-200 hover:border-primary transition-all duration-300">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
        <p className="text-accent mb-4">{product.description}</p>
        <div className="mb-4">
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full p-2 border rounded-lg mb-2 text-gray-800"
          >
            <option value="simple">Simple</option>
            <option value="doble">Doble</option>
            <option value="triple">Triple</option>
          </select>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">
            ${(product.price * sizeMultipliers[selectedSize]).toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-all"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const { state, dispatch } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckout = () => {
    if (state.items.length === 0) return;
  
    const orderDetails = state.items
      .map(item => 
        `${item.quantity}x ${item.name} (${item.size}) - $${(item.price * item.sizeMultiplier * item.quantity).toFixed(2)}`
      )
      .join("\n");
  
    const total = `Total: $${state.total.toFixed(2)}`;
    const message = encodeURIComponent(`Hola, quiero hacer un pedido:\n\n${orderDetails}\n\n${total}`);
    
    const whatsappUrl = `https://wa.me/5492281378685?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };
  

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 bg-primary text-white p-3 rounded-full z-50 hover:bg-primary/90 transition-all duration-300 shadow-lg"
      >
        <FaShoppingCart className="text-xl" />
        {state.items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center text-sm animate-pulse">
            {state.items.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm transition-all duration-300"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg p-6 overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex justify-between items-center mb-4 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <FaShoppingCart className="text-4xl text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">Your cart is empty</p>
              </div>
            ) : (
              <>
                {state.items.map(item => (
                  <div key={item.uniqueId} className="flex items-center mb-4 border-b pb-4 hover:bg-gray-50 transition-colors duration-200 p-2 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg shadow-sm"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{item.size}</p>
                      <div className="flex items-center mt-2 bg-gray-100 rounded-lg inline-flex">
                        <button
                          onClick={() =>
                            dispatch({
                              type: "UPDATE_QUANTITY",
                              payload: { uniqueId: item.uniqueId, quantity: item.quantity - 1 }
                            })
                          }
                          className="bg-gray-200 px-3 py-1 rounded-l-lg hover:bg-gray-300 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="mx-4 font-medium">{item.quantity}</span>
                        <button
                          onClick={() =>
                            dispatch({
                              type: "UPDATE_QUANTITY",
                              payload: { uniqueId: item.uniqueId, quantity: item.quantity + 1 }
                            })
                          }
                          className="bg-gray-200 px-3 py-1 rounded-r-lg hover:bg-gray-300 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="font-bold text-gray-800">${(item.price * item.sizeMultiplier * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() =>
                          dispatch({ type: "REMOVE_ITEM", payload: item.uniqueId })
                        }
                        className="text-destructive mt-2 hover:text-destructive/80 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="mt-6 border-t pt-4">
                  <div className="flex justify-between mb-4">
                    <span className="text-xl font-bold text-gray-800">Total:</span>
                    <span className="text-xl font-bold text-primary">${state.total.toFixed(2)}</span>
                  </div>
                  <button onClick={handleCheckout} className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-md">
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const MenuSection = () => {
  const { dispatch } = useContext(CartContext);

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8">Our Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {menuData.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={product =>
              dispatch({ type: "ADD_ITEM", payload: product })
            }
          />
        ))}
      </div>
    </div>
  );
};

const ToskyaApp = () => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      <div className={`${isDarkMode ? "dark" : ""}`}>
        <div className="min-h-screen bg-black text-white">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="fixed top-4 left-4 bg-primary text-white p-3 rounded-full z-50"
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
          <HeroSection />
          <MenuSection />
          <Cart />
        </div>
      </div>
    </CartContext.Provider>
  );
};

export default ToskyaApp;