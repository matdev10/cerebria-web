import "./CartItem.css";
import fallbackImage from "../../assets/img/img-producto.png";

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const subtotal = item.price * item.quantity;
  const image = item.image || fallbackImage;

  return (
    <article className="cart-item">
      <div className="cart-item-image">
        <img src={image} alt={item.name} />
      </div>

      <div className="cart-item-info">
        <span className="cart-item-category">Producto</span>

        <h3>{item.name}</h3>

        <p className="cart-item-price">
          ${item.price.toLocaleString("es-CL")}
        </p>

        <div className="cart-item-quantity">
          <button
            type="button"
            onClick={() => onDecrease(item.id)}
            disabled={item.quantity === 1}
          >
            −
          </button>

          <strong>{item.quantity}</strong>

          <button
            type="button"
            onClick={() => onIncrease(item.id)}
          >
            +
          </button>
        </div>
      </div>

      <div className="cart-item-summary">
        <button
          type="button"
          className="cart-item-remove"
          onClick={() => onRemove(item.id)}
        >
          Eliminar
        </button>

        <div>
          <span>Subtotal</span>
          <strong>${subtotal.toLocaleString("es-CL")}</strong>
        </div>
      </div>
    </article>
  );
}

export default CartItem;