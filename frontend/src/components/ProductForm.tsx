// FormEvent es el tipo para el evento submit del formulario HTML
import { FormEvent } from "react";

// Importo los tipos que definen la forma de los objetos
import { Producto, ProductoFormData } from "../interfaces/Producto";

// Defino las props que este componente recibe desde ProductsPage
interface ProductFormProps {
  formData: ProductoFormData;           // valores actuales de los campos
  editingProducto: Producto | null;     // null = modo crear, Producto = modo editar
  isSubmitting: boolean;                // true mientras el formulario se está enviando
  onChange: (field: keyof ProductoFormData, value: string) => void; // para actualizar un campo
  onSubmit: () => void;                 // función para enviar el formulario
  onCancelEdit: () => void;             // función para cancelar la edición
}

// Desestructuro las props directamente en los parámetros del componente
export const ProductForm = ({
  formData,
  editingProducto,
  isSubmitting,
  onChange,
  onSubmit,
  onCancelEdit,
}: ProductFormProps) => {

  // Intercepto el submit del formulario HTML para llamar a la función del padre
  // event.preventDefault() evita que el formulario recargue la página
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(); // le aviso a ProductsPage que el usuario quiere guardar
  };

  return (
    // El onSubmit del form llama a handleSubmit cuando el usuario presiona el botón
    <form className="product-form" onSubmit={handleSubmit}>

      {/* Encabezado del formulario: cambia según si estamos creando o editando */}
      <div className="form-header">
        <div>
          {/* El título cambia según el modo */}
          <h2>{editingProducto ? "Editar producto" : "Crear producto"}</h2>
          <p>
            {editingProducto
              ? "Actualiza la informacion del producto seleccionado."
              : "Registra un nuevo producto en el catalogo."}
          </p>
        </div>

        {/* El botón "Cancelar" solo aparece en modo edición */}
        {editingProducto && (
          <button
            className="secondary-button"
            type="button"     // type="button" evita que dispare el submit del form
            onClick={onCancelEdit}
          >
            Cancelar
          </button>
        )}
      </div>

      {/* Grid de campos principales: codigo, nombre, precio y categoria */}
      <div className="form-grid">

        {/* Campo código */}
        <label>
          Codigo
          <input
            value={formData.codigo}
            // Llamo a onChange pasando el nombre del campo y el nuevo valor
            onChange={(event) => onChange("codigo", event.target.value)}
            placeholder=""
            required
          />
        </label>

        {/* Campo nombre */}
        <label>
          Nombre
          <input
            value={formData.nombre}
            onChange={(event) => onChange("nombre", event.target.value)}
            placeholder=""
            required
          />
        </label>

        {/* Campo precio: tipo número con step 0.01 para permitir centavos */}
        <label>
          Precio
          <input
            min="0"       // no permite precios negativos
            step="0.01"   // permite decimales de dos cifras (ej: 9.99)
            type="number"
            value={formData.precio}
            onChange={(event) => onChange("precio", event.target.value)}
            placeholder=""
            required
          />
        </label>

        {/* Campo categoría: select con opciones fijas */}
        <label>
          Categoria
          <select
            value={formData.categoria}
            onChange={(event) => onChange("categoria", event.target.value)}
            required
          >
            <option value="">Selecciona una categoria</option>
            <option value="Teclados">Teclados</option>
            <option value="Mouse">Mouse</option>
            <option value="Laptop">Laptop</option>
            <option value="Otro">Otro</option>
          </select>
        </label>
      </div>

      {/* Campo descripción: textarea porque puede ser más largo, y es opcional (sin required) */}
      <label>
        Descripcion
        <textarea
          rows={3}  // altura inicial de 3 líneas
          value={formData.descripcion}
          onChange={(event) => onChange("descripcion", event.target.value)}
          placeholder="Descripcion general del producto"
        />
      </label>

      {/* Botón de submit: deshabilitado mientras se envía para evitar doble envío */}
      <button className="primary-button" type="submit" disabled={isSubmitting}>
        {/* El texto cambia según el estado: guardando, editando o creando */}
        {isSubmitting
          ? "Guardando..."
          : editingProducto
            ? "Actualizar producto"
            : "Crear producto"}
      </button>
    </form>
  );
};
