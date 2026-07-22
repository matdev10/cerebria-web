export const validateCreateProduct = (data) => {
  const errors = [];

  if (!data.name || data.name.trim() === "") {
    errors.push("El nombre del producto es obligatorio.");
  }

  if (!data.price || Number(data.price) <= 0) {
    errors.push("El precio debe ser mayor a 0.");
  }

  if (data.stock === undefined || Number(data.stock) < 0) {
    errors.push("El stock debe ser mayor o igual a 0.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};