import React, { useState, useEffect, useRef } from "react";

import { Route, Routes, NavLink } from "react-router-dom";

import Image from "./Image";

export const Shop = ({
  addProduct,

  catalog,
}) => {
  //content is what will be mapped
  const [content, setContent] = useState(catalog?.helados);

  //iceCreamForm content
  //it needs the hole product so it can pass it to the car

  useEffect(() => {
    setContent(catalog?.helados);
  }, [catalog]);

  return (
    <>
      <h1>Nuestros productos</h1>
      <div className="cards-container">
        {content?.map((product, index) => {
          if (product.outOfStock) {
            return "";
          }

          const cartComponent = (
            <Card
              //this key props cause useless re-renders if set to uniqid()
              key={`${index}-card-${product.name}`}
              product={product}
            />
          );

          return product.hasOwnProperty("flavours") ? (
            <NavLink
              state={product}
              to={`/catalogo/helado/${product.flavours}`}
            >
              {cartComponent}
            </NavLink>
          ) : (
            <div onClick={() => addProduct(product)}>{cartComponent}</div>
          );
        })}
      </div>
    </>
  );
};

//this rerenders every time the addProductToCart function gets called
function Card({ product }) {
  return (
    <div className="card">
      <Image url={product.imgUrl} />
      <p className="product-name">{product.name}</p>
      <p className="product-price">$ {product.price}</p>

      <button className={`to-cart  `}>
        <span>Añadir</span>
        <div className="img-container">
          <img
            style={{ filter: "invert(1)" }}
            src="/img/to-cart.svg"
            alt="cart icon"
          />
        </div>
      </button>
    </div>
  );
}
