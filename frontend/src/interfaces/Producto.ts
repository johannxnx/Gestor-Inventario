export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  categoria: string;
  created_at?: string;
}

export interface ProductoFormData {
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: string;
  categoria: string;
}
