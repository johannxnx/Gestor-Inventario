import { Producto } from "../interfaces/Producto";

interface ProductTableProps {
  productos: Producto[];
  isLoading: boolean;
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => void;
}

export const ProductTable = ({
  productos,
  isLoading,
  onEdit,
  onDelete,
}: ProductTableProps) => {
  if (isLoading) {
    return <p className="status-message">Cargando productos...</p>;
  }

  if (productos.length === 0) {
    return (
      <div className="empty-state">
        <h2>No hay productos registrados</h2>
        <p>Cuando agregues productos, apareceran en este listado.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Codigo</th>
            <th>Nombre</th>
            <th>Categoria</th>
            <th>Precio</th>
            <th>Descripcion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td className="code-cell">{producto.codigo}</td>
              <td className="product-name">{producto.nombre}</td>
              <td>
                <span className="category-badge">{producto.categoria}</span>
              </td>
              <td className="price-cell">Q {Number(producto.precio).toFixed(2)}</td>
              <td className="description-cell" title={producto.descripcion || ""}>
                {producto.descripcion || (
                  <span className="no-description">Sin descripcion</span>
                )}
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => onEdit(producto)}
                  >
                    Editar
                  </button>
                  <button
                    className="danger-button"
                    type="button"
                    onClick={() => onDelete(producto.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
