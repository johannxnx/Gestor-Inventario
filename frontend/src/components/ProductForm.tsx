import { FormEvent } from "react";
import { Producto, ProductoFormData } from "../interfaces/Producto";

interface ProductFormProps {
  formData: ProductoFormData;
  editingProducto: Producto | null;
  isSubmitting: boolean;
  onChange: (field: keyof ProductoFormData, value: string) => void;
  onSubmit: () => void;
  onCancelEdit: () => void;
}

export const ProductForm = ({
  formData,
  editingProducto,
  isSubmitting,
  onChange,
  onSubmit,
  onCancelEdit,
}: ProductFormProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <div>
          <h2>{editingProducto ? "Editar producto" : "Crear producto"}</h2>
          <p>
            {editingProducto
              ? "Actualiza la informacion del producto seleccionado."
              : "Registra un nuevo producto en el catalogo."}
          </p>
        </div>

        {editingProducto && (
          <button
            className="secondary-button"
            type="button"
            onClick={onCancelEdit}
          >
            Cancelar
          </button>
        )}
      </div>

      <div className="form-grid">
        <label>
          Codigo
          <input
            value={formData.codigo}
            onChange={(event) => onChange("codigo", event.target.value)}
            placeholder=""
            required
          />
        </label>

        <label>
          Nombre
          <input
            value={formData.nombre}
            onChange={(event) => onChange("nombre", event.target.value)}
            placeholder=""
            required
          />
        </label>

        <label>
          Precio
          <input
            min="0"
            step="0.01"
            type="number"
            value={formData.precio}
            onChange={(event) => onChange("precio", event.target.value)}
            placeholder=""
            required
          />
        </label>

        <label>
          Categoria
          <input
            value={formData.categoria}
            onChange={(event) => onChange("categoria", event.target.value)}
            placeholder=""
            required
          />
        </label>
      </div>

      <label>
        Descripcion
        <textarea
          rows={3}
          value={formData.descripcion}
          onChange={(event) => onChange("descripcion", event.target.value)}
          placeholder="Descripcion general del producto"
        />
      </label>

      <button className="primary-button" type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? "Guardando..."
          : editingProducto
            ? "Actualizar producto"
            : "Crear producto"}
      </button>
    </form>
  );
};
