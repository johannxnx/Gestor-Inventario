import axios from "axios";
import { Producto, ProductoFormData } from "../interfaces/Producto";

const API_URL = "http://localhost:3001/api/productos";

const mapFormDataToProducto = (producto: ProductoFormData) => ({
  codigo: producto.codigo,
  nombre: producto.nombre,
  descripcion: producto.descripcion,
  precio: Number(producto.precio),
  categoria: producto.categoria,
});

export const getProductos = async (): Promise<Producto[]> => {
  const response = await axios.get<Producto[]>(API_URL);
  return response.data;
};

export const createProducto = async (
  producto: ProductoFormData
): Promise<void> => {
  await axios.post(API_URL, mapFormDataToProducto(producto));
};

export const updateProducto = async (
  id: number,
  producto: ProductoFormData
): Promise<void> => {
  await axios.put(`${API_URL}/${id}`, mapFormDataToProducto(producto));
};

export const deleteProducto = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
