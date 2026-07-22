import prisma from "../database/prisma.js";

export const getAllProducts = async () => {
  return prisma.product.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      id: "asc",
    },
  });
};

export const createProductService = async (productData) => {
  return prisma.product.create({
    data: {
      name: productData.name,
      description: productData.description,
      price: Number(productData.price),
      stock: Number(productData.stock),
      imageUrl: productData.imageUrl,
    },
  });
};