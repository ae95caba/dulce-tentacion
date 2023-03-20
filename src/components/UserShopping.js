import { useCollectionData } from "react-firebase-hooks/firestore";
import { db, auth } from "../backend/firebase";
import { collection, deleteDoc, doc as firebaseDoc } from "firebase/firestore";

import { format } from "date-fns";
import { Details } from "./Cart";
import uniqid from "uniqid";

export const UserShopping = () => {
  const query = collection(db, `users/${auth.currentUser.uid}/compras`);
  const [docs, loading, error] = useCollectionData(query);

  return (
    <div id="purchase-list-container">
      <div id="purchase-list">
        {loading && null}
        {docs?.reverse().map((doc) => {
          const dateObj = doc.date.toDate();

          // Get the date in the format DD/MM/YYYY
          const date = format(dateObj, "dd/MM/yyyy");

          // Get the time in the format HH:MM
          const hour = format(dateObj, "HH:mm");
          return (
            <div className="purchase" key={uniqid()}>
              <div className="time">
                <span>{date} :</span> <span>{hour}</span>
              </div>

              {doc.cartItems?.map((item) => {
                const detailsId = uniqid();
                return (
                  <div className="cart-item" key={uniqid()}>
                    <img src={item.imgUrl} alt={item.name} />
                    <div className="right">
                      <div className="description">
                        <p className="description-name">{item.name}</p>
                        <p className="description-price">$ {item.totalPrice}</p>
                      </div>
                      {item.flavoursArr ? (
                        <div
                          className="details-button"
                          onClick={() => {
                            console.log(item.flavoursArr);
                            const details = document.getElementById(detailsId);

                            details.style.display === "flex"
                              ? (details.style.display = "none")
                              : (details.style.display = "flex");
                          }}
                        >
                          Detalle
                        </div>
                      ) : (
                        <div className="quantity">
                          <p>unidades: {item.count}</p>
                        </div>
                      )}
                    </div>
                    {item.flavoursArr ? (
                      <Details item={item} detailsId={detailsId} />
                    ) : null}
                  </div>
                );
              })}

              <div className="description">
                <div className="description-total-price">
                  Total: ${doc.totalPrice}
                </div>
                <div className="description-total-points">
                  Puntos : {(doc.totalPrice * 5) / 100}
                </div>
                <div className="purchase-state">
                  {doc.completed === true ? "PAGADO" : "PENDIENTE DE PAGO"}
                </div>
                <div className="order-fulfillment">
                  {doc.deliveryDetails ? (
                    <>
                      <div
                        onClick={() => {
                          document.getElementById("delivery-details").style
                            .display === "none"
                            ? (document.getElementById(
                                "delivery-details"
                              ).style.display = "block")
                            : (document.getElementById(
                                "delivery-details"
                              ).style.display = "none");
                        }}
                      >
                        DELIVERy
                      </div>
                      <div id="delivery-details" style={{ display: "none" }}>
                        <p>Barrio: {doc.deliveryDetails.barrio}</p>
                        <p>Direccion: {doc.deliveryDetails.direccion}</p>
                        <p>Entre calles: {doc.deliveryDetails.entreCalles}</p>
                        <p>
                          Informacion adicional:
                          {doc.deliveryDetails.aditionalInfo}
                        </p>
                      </div>
                    </>
                  ) : (
                    "RETIRO EN EL LOCAL"
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  const docRef = firebaseDoc(
                    db,
                    `users/${auth.currentUser.uid}/compras`,
                    doc.docId
                  );
                  deleteDoc(docRef);
                }}
              >
                Cancelar
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
