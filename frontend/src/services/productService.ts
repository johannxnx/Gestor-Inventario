import api from "./axiosInstance";
import { Producto, ProductoFormData } from "../interfaces/Producto";

const mapFormDataToProducto = (producto: ProductoFormData) => ({
  codigo: producto.codigo,
  nombre: producto.nombre,
  descripcion: producto.descripcion,
  precio: Number(producto.precio),
  categoria: producto.categoria,
});

export const getProductos = async (): Promise<Producto[]> => {
  const response = await api.get<Producto[]>("/productos");
  return response.data;
};

export const createProducto = async (
  producto: ProductoFormData
): Promise<void> => {
  await api.post("/productos", mapFormDataToProducto(producto));
};

export const updateProducto = async (
  id: number,
  producto: ProductoFormData
): Promise<void> => {
  await api.put(`/productos/${id}`, mapFormDataToProducto(producto));
};

export const deleteProducto = async (id: number): Promise<void> => {
  await api.delete(`/productos/${id}`);
};
