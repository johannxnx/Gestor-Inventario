// useEffect para cargar los productos cuando el componente se monta
// useState para guardar todos los estados de la página
import { useEffect, useState } from "react";

// Importo los componentes reutilizables para el formulario y la tabla
import { ProductForm } from "../components/ProductForm";
import { ProductTable } from "../components/ProductTable";

// Importo las interfaces que definen la forma de los objetos
// Producto es el que viene de la base de datos (tiene id)
// ProductoFormData es el que usa el formulario (precio como string, sin id)
import { Producto, ProductoFormData } from "../interfaces/Producto";

// Importo todas las funciones del servicio para hacer llamadas al backend
import {
  createProducto,
  deleteProducto,
  getProductos,
  updateProducto,
} from "../services/productService";

// Objeto vacío que uso para resetear el formulario después de crear o editar
// Lo defino fuera del componente para que no se recree en cada render
const emptyForm: ProductoFormData = {
  codigo: "",
  nombre: "",
  descripcion: "",
  precio: "",
  categoria: "",
};

export const ProductsPage = () => {
  // Lista de productos que se muestra en la tabla
  const [productos, setProductos] = useState<Producto[]>([]);

  // Datos actuales del formulario (lo que el usuario está escribiendo)
  const [formData, setFormData] = useState<ProductoFormData>(emptyForm);

  // Si estoy editando un producto, lo guardo aquí para saber cuál modificar
  // null significa que estoy creando uno nuevo
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);

  // true mientras carga la lista de productos (para mostrar "Cargando...")
  const [isLoading, setIsLoading] = useState(false);

  // true mientras se está enviando el formulario (crear o editar)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mensaje de éxito (por ejemplo "Producto creado correctamente")
  const [message, setMessage] = useState("");

  // Mensaje de error si algo sale mal
  const [error, setError] = useState("");

  // Función que carga los productos desde el backend
  // La defino así para poder llamarla tanto al montar el componente como después de cada acción
  const loadProductos = async () => {
    try {
      setIsLoading(true);
      setError(""); // limpio errores anteriores antes de cargar

      const data = await getProductos(); // llama al backend y devuelve el array
      setProductos(data);               // guardo los productos en el estado
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los productos.");
    } finally {
      // finally se ejecuta siempre, con éxito o con error
      setIsLoading(false);
    }
  };

  // Cargo los productos UNA vez cuando el componente aparece en pantalla
  useEffect(() => {
    loadProductos();
  }, []); // [] vacío = solo al montar

  // Se llama cuando el usuario escribe en cualquier campo del formulario
  // field es el nombre del campo (ej: "nombre") y value es lo que escribió
  const handleChange = (field: keyof ProductoFormData, value: string) => {
    // Uso el spread operator (...currentData) para copiar todos los campos
    // y solo modificar el que cambió
    setFormData((currentData) => ({
      ...currentData,
      [field]: value, // el [] permite usar el valor de field como nombre de clave
    }));
  };

  // Resetea el formulario a su estado vacío y cancela cualquier edición en curso
  const resetForm = () => {
    setFormData(emptyForm);
    setEditingProducto(null); // vuelvo al modo "crear" (sin producto seleccionado)
  };

  // Se llama cuando el usuario hace submit del formulario (crear o editar)
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setMessage(""); // limpio mensajes anteriores
      setError("");

      if (editingProducto) {
        // Si hay un producto seleccionado, actualizo ese producto
        await updateProducto(editingProducto.id, formData);
        setMessage("Producto actualizado correctamente.");
      } else {
        // Si no hay producto seleccionado, creo uno nuevo
        await createProducto(formData);
        setMessage("Producto creado correctamente.");
      }

      resetForm();           // limpio el formulario
      await loadProductos(); // recargo la tabla para ver el cambio
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el producto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Se llama cuando el usuario hace click en "Editar" en la tabla
  // Carga los datos del producto seleccionado en el formulario
  const handleEdit = (producto: Producto) => {
    setEditingProducto(producto); // guardo el producto que estoy editando
    setMessage("");
    setError("");

    // Relleno el formulario con los datos actuales del producto
    // precio lo convierto a string porque el formulario lo maneja como texto
    setFormData({
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion || "", // si es null uso string vacío
      precio: String(producto.precio),
      categoria: producto.categoria,
    });
  };

  // Se llama cuando el usuario hace click en "Eliminar" en la tabla
  const handleDelete = async (id: number) => {
    // Pido confirmación antes de eliminar para evitar borrados accidentales
    const shouldDelete = window.confirm(
      "Seguro que deseas eliminar este producto?"
    );

    // Si el usuario canceló, no hago nada
    if (!shouldDelete) {
      return;
    }

    try {
      setMessage("");
      setError("");

      await deleteProducto(id); // llamo al backend para eliminar
      setMessage("Producto eliminado correctamente.");

      // Si el producto que estaba editando es el que eliminé, limpio el formulario
      if (editingProducto?.id === id) {
        resetForm();
      }

      await loadProductos(); // recargo la tabla para reflejar el cambio
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el producto.");
    }
  };

  return (
    <main className="app-shell">

      {/* Muestro el mensaje de éxito o de error según cuál haya */}
      {(message || error) && (
        <div className={error ? "alert error" : "alert success"}>
          {error || message}
        </div>
      )}

      <section className="content-grid">

        {/* Formulario para crear o editar productos */}
        <ProductForm
          formData={formData}
          editingProducto={editingProducto}  // null = crear, Producto = editar
          isSubmitting={isSubmitting}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancelEdit={resetForm}            // botón "Cancelar" al editar
        />

        {/* Sección de la lista de productos */}
        <section className="product-list">
          <div className="list-header">
            <div>
              <h2>Productos registrados</h2>
              {/* Muestro cuántos productos hay en total */}
              <p>Total: {productos.length}</p>
            </div>
            {/* Botón para recargar manualmente la lista */}
            <button
              className="secondary-button"
              type="button"
              onClick={loadProductos}
            >
              Actualizar
            </button>
          </div>

          {/* Tabla que muestra todos los productos con sus botones de acción */}
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
