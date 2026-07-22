const isNonEmptyString = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

const isPositiveInteger = (value) => {
  const number = Number(value);

  return Number.isInteger(number) && number > 0;
};

const isValidMoneyValue = (value) => {
  const number = Number(value);

  return Number.isFinite(number) && number >= 0;
};

const isValidEmail = (value) => {
  if (!isNonEmptyString(value)) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

export const validateCreatePreferencePayload = (payload = {}) => {
  const errors = [];

  const {
    customer,
    shippingAddress,
    items,
    shippingCost,
    shippingQuote,
  } = payload;

  if (!customer || typeof customer !== "object") {
    errors.push("Los datos del cliente son obligatorios.");
  } else {
    if (!isNonEmptyString(customer.name)) {
      errors.push("El nombre del cliente es obligatorio.");
    }

    if (!isValidEmail(customer.email)) {
      errors.push("El correo del cliente no es válido.");
    }

    if (!isNonEmptyString(customer.phone)) {
      errors.push("El teléfono del cliente es obligatorio.");
    }
  }

  if (!shippingAddress || typeof shippingAddress !== "object") {
    errors.push("La dirección de entrega es obligatoria.");
  } else {
    if (!isNonEmptyString(shippingAddress.address)) {
      errors.push("La dirección es obligatoria.");
    }

    if (!isNonEmptyString(shippingAddress.countryIso)) {
      errors.push("El país es obligatorio.");
    }

    if (!isNonEmptyString(shippingAddress.regionId)) {
      errors.push("La región es obligatoria.");
    }

    if (!isNonEmptyString(shippingAddress.provinceId)) {
      errors.push("La provincia es obligatoria.");
    }

    if (!isNonEmptyString(shippingAddress.communeId)) {
      errors.push("La comuna es obligatoria.");
    }
  }

  if (!Array.isArray(items) || items.length === 0) {
    errors.push("El pedido debe contener al menos un producto.");
  } else {
    items.forEach((item, index) => {
      const itemNumber = index + 1;

      if (!isNonEmptyString(String(item.productId ?? ""))) {
        errors.push(`El producto ${itemNumber} no tiene un identificador válido.`);
      }

      if (!isNonEmptyString(item.name)) {
        errors.push(`El producto ${itemNumber} no tiene nombre.`);
      }

      if (!isValidMoneyValue(item.price) || Number(item.price) <= 0) {
        errors.push(`El producto ${itemNumber} no tiene un precio válido.`);
      }

      if (!isPositiveInteger(item.quantity)) {
        errors.push(`El producto ${itemNumber} no tiene una cantidad válida.`);
      }
    });
  }

  if (!isValidMoneyValue(shippingCost)) {
    errors.push("El costo de despacho no es válido.");
  }

  if (!shippingQuote || typeof shippingQuote !== "object") {
    errors.push("La cotización de despacho es obligatoria.");
  } else if (shippingQuote.available !== true) {
    errors.push("El despacho seleccionado no está disponible.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};