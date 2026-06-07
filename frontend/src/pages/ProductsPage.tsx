import { useEffect, useState } from "react";
import { ProductForm } from "../components/ProductForm";
import { ProductTable } from "../components/ProductTable";
import { Producto, ProductoFormData } from "../interfaces/Producto";
import {
  createProducto,
  deleteProducto,
  getProductos,
  updateProducto,
} from "../services/productService";

const emptyForm: ProductoFormData = {
  codigo: "",
  nombre: "",
  descripcion: "",
  precio: "",
  categoria: "",
};

export const ProductsPage = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [formData, setFormData] = useState<ProductoFormData>(emptyForm);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProductos = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getProductos();
      setProductos(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los productos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProductos();
  }, []);

  const handleChange = (field: keyof ProductoFormData, value: string) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingProducto(null);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setMessage("");
      setError("");

      if (editingProducto) {
        await updateProducto(editingProducto.id, formData);
        setMessage("Producto actualizado correctamente.");
      } else {
        await createProducto(formData);
        setMessage("Producto creado correctamente.");
      }

      resetForm();
      await loadProductos();
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el producto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (producto: Producto) => {
    setEditingProducto(producto);
    setMessage("");
    setError("");
    setFormData({
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion || "",
      precio: String(producto.precio),
      categoria: producto.categoria,
    });
  };

  const handleDelete = async (id: number) => {
    const shouldDelete = window.confirm(
      "Seguro que deseas eliminar este producto?"
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setMessage("");
      setError("");

      await deleteProducto(id);
      setMessage("Producto eliminado correctamente.");

      if (editingProducto?.id === id) {
        resetForm();
      }

      await loadProductos();
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el producto.");
    }
  };

  return (
    <main className="app-shell">
      {(message || error) && (
        <div className={error ? "alert error" : "alert success"}>
          {error || message}
        </div>
      )}

      <section className="content-grid">
        <ProductForm
          formData={formData}
          editingProducto={editingProducto}
          isSubmitting={isSubmitting}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancelEdit={resetForm}
        />

        <section className="product-list">
          <div className="list-header">
            <div>
              <h2>Productos registrados</h2>
              <p>Total: {productos.length}</p>
            </div>
            <button
              className="secondary-button"
              type="button"
              onClick={loadProductos}
            >
              Actualizar
            </button>
          </div>

          <ProductTable
            productos={productos}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
      </section>
    </main>
  );
};
