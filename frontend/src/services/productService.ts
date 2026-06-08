// Importo la instancia de axios configurada con la URL base y las cookies
import api from "./axiosInstance";

// Importo los tipos para que TypeScript pueda validar los datos que manejo
import { Producto, ProductoFormData } from "../interfaces/Producto";

// Función auxiliar que transforma los datos del formulario al formato que espera el backend
// El formulario maneja precio como string (porque viene de un input de texto)
// El backend necesita precio como número
const mapFormDataToProducto = (producto: ProductoFormData) => ({
  codigo: producto.codigo,
  nombre: producto.nombre,
  descripcion: producto.descripcion,
  precio: Number(producto.precio), // convierto el string a número antes de enviarlo
  categoria: producto.categoria,
});

// Obtiene todos los productos del backend
// El tipo genérico <Producto[]> le dice a axios qué tipo de datos espera recibir
export const getProductos = async (): Promise<Producto[]> => {
  const response = await api.get<Producto[]>("/productos");
  return response.data; // response.data contiene el array de productos
};

// Crea un producto nuevo en el backend con los datos del formulario
// No devuelve nada (void) porque el backend solo confirma con un mensaje
export const createProducto = async (
  producto: ProductoFormData
): Promise<void> => {
  // Convierto los datos del formulario antes de enviarlos (precio de string a number)
  await api.post("/productos", mapFormDataToProducto(producto));
};

// Actualiza un producto existente usando su id
// Necesita el id para saber cuál actualizar y el formulario con los datos nuevos
export const updateProducto = async (
  id: number,
  producto: ProductoFormData
): Promise<void> => {
  // El id va en la URL y los datos van en el body de la petición
  await api.put(`/productos/${id}`, mapFormDataToProducto(producto));
};

// Elimina un producto por su id
export const deleteProducto = async (id: number): Promise<void> => {
  // Solo necesito el id, va en la URL
  await api.delete(`/productos/${id}`);
};
