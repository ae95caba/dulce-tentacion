import React from "react";
import "../App.scss";
import { Route, useRevalidator } from "react-router-dom";
import { Routes } from "react-router-dom";
import { Home } from "../Home";
import { Profile } from "./Profile";
import { Shop } from "./Shop";
import { Cart } from "./Cart";
import { auth } from "../backend/firebase";

import { useState, useEffect } from "react";
import { Navbar } from "./Navbar";

import { ThanksMessage } from "./ThanksMessage";

export const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [showThanksMessage, setShowThanksMessage] = useState(false);
  const [isUserOnline, setIsUserOnline] = useState();

  const [userData, setUserData] = useState({
    name: undefined,
    email: undefined,
    img: "/img/anonymous.svg",
  });

  //set isUserOnline and userData
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsUserOnline(true);

        setUserData({
          name: user.displayName,
          email: user.email,
          img: user.photoURL,
        });
      } else {
        setIsUserOnline(false);
      }
    });
  }, []);

  function totalItems() {
    let total = 0;
    for (var i = 0; i < cartItems.length; i++) {
      total += cartItems[i].count;
    }
    return total;
  }

  function totalPrice() {
    let total = 0;

    total += deliveryPrice;
    for (var i = 0; i < cartItems.length; i++) {
      total += cartItems[i].totalPrice;
    }
    return total;
  }

  //increases a cart item count if the item is in the cart
  //if the item was no in the cart (its just been added) it adds it to cartItems array
  function addCartItem(product) {
    var isProductInCart = false;
    var index = undefined;
    for (var i = 0; i < cartItems.length; i++) {
      if (cartItems[i].name === product.name) {
        isProductInCart = true;
        index = i;
        break;
      }
    }

    if (!isProductInCart) {
      setCartItems([
        ...cartItems,
        {
          name: product.name,
          imgUrl: product.imgUrl,
          price: product.price,
          count: 1,

          get totalPrice() {
            return this.price * this.count;
          },
        },
      ]);
    } else {
      // INCREASE COUNT BY 1
      let copy = [...cartItems];
      copy[index].count = copy[index].count + 1;

      setCartItems([...copy]);
    }
  }

  function addDelivery(delivery) {}

  function addIceCream(iceCream) {
    setCartItems([
      ...cartItems,
      {
        ...iceCream,
      },
    ]);
  }

  //	decreases a cart item count
  //if the is only only the removes it entirely
  function removeCartItem(product) {
    var index = undefined;
    for (var i = 0; i < cartItems.length; i++) {
      if (cartItems[i].name === product.name) {
        index = i;
        break;
      }
    }

    if (cartItems[index].count > 1) {
      let copy = [...cartItems];
      copy[index].count = copy[index].count - 1;

      setCartItems([...copy]);
    } else {
      let copy = [...cartItems];
      copy.splice(index, 1);
      setCartItems([...copy]);
    }
  }

  function removeAll(product) {
    let index = cartItems.indexOf(product);

    let copy = [...cartItems];
    copy.splice(index, 1);
    setCartItems([...copy]);
  }

  function clearCart() {
    setCartItems([]);
  }

  return (
    <div id="app">
      <div
        id="cart-button"
        onClick={() => {
          document.getElementById("cart").style.display = "flex";
        }}
      >
        <img src="/img/cart.svg" alt="shopping cart"></img>
        <div id="total-items">{totalItems()}</div>
        <div id="total-price">$ {totalPrice()}</div>
      </div>
      <Navbar />
      {showThanksMessage ? (
        <ThanksMessage close={() => setShowThanksMessage(false)} />
      ) : null}

      <Cart
        userData={userData}
        isUserOnline={isUserOnline}
        setDeliveryPrice={setDeliveryPrice}
        cartItems={cartItems}
        addCartItem={addCartItem}
        removeCartItem={removeCartItem}
        removeAll={removeAll}
        clearCart={clearCart}
        totalPrice={totalPrice}
        showThanksMessage={() => {
          console.log("holaaaaa");
          setShowThanksMessage(true);
        }}
      />
      <Routes>
        <Route path="/" exact element={<Home />} />

        <Route
          path="/perfil"
          element={
            <Profile
              userData={userData}
              setUserData={setUserData}
              isUserOnline={isUserOnline}
            />
          }
        />
        {/*   <Route path="/perfil/crear-cuenta" element={<SignUp />} />
        <Route path="/perfil/iniciar-sesion" element={<LogIn />} /> */}
        <Route
          path="/tienda"
          element={<Shop addCartItem={addCartItem} addIceCream={addIceCream} />}
        />
      </Routes>
    </div>
  );
};
