// Importo la interfaz que define la forma de un producto
import { Producto } from "../interfaces/Producto";

// Defino las props que recibe este componente desde ProductsPage
interface ProductTableProps {
  productos: Producto[];                   // array con todos los productos a mostrar
  isLoading: boolean;                      // true mientras se están cargando los datos
  onEdit: (producto: Producto) => void;    // función para editar un producto
  onDelete: (id: number) => void;          // función para eliminar un producto por id
}

// Desestructuro las props directamente en los parámetros
export const ProductTable = ({
  productos,
  isLoading,
  onEdit,
  onDelete,
}: ProductTableProps) => {

  // Mientras se cargan los productos muestro un mensaje de espera
  if (isLoading) {
    return <p className="status-message">Cargando productos...</p>;
  }

  // Si no hay productos en el array, muestro un estado vacío con instrucciones
  if (productos.length === 0) {
    return (
      <div className="empty-state">
        <h2>No hay productos registrados</h2>
        <p>Cuando agregues productos, apareceran en este listado.</p>
      </div>
    );
  }

  // Si hay productos, renderizo la tabla con todos sus datos
  return (
    <div className="table-wrapper">
      <table>

        {/* Encabezados de la tabla */}
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

        {/* Cuerpo de la tabla: una fila por cada producto */}
        <tbody>
          {/* .map() recorre el array y devuelve un elemento JSX por cada producto */}
          {productos.map((producto) => (
            // key es obligatorio en listas de React para que pueda identificar cada fila
            // Uso el id porque es único para cada producto
            <tr key={producto.id}>

              {/* Código del producto */}
              <td className="code-cell">{producto.codigo}</td>

              {/* Nombre del producto */}
              <td className="product-name">{producto.nombre}</td>

              {/* Categoría con estilo de badge/etiqueta */}
              <td>
                <span className="category-badge">{producto.categoria}</span>
              </td>

              {/* Precio formateado con 2 decimales y símbolo de quetzales */}
              {/* toFixed(2) asegura que siempre se muestren exactamente 2 decimales */}
              <td className="price-cell">Q {Number(producto.precio).toFixed(2)}</td>

              {/* Descripción: el title muestra el texto completo al pasar el mouse por encima */}
              {/* Si no hay descripción (null), muestro un span con texto gris */}
              <td className="description-cell" title={producto.descripcion || ""}>
                {producto.descripcion || (
                  <span className="no-description">Sin descripcion</span>
                )}
              </td>

              {/* Botones de acción: editar y eliminar */}
              <td>
                <div className="action-buttons">

                  {/* Al hacer click llamo a onEdit pasando el producto completo */}
                  {/* ProductsPage se encargará de cargar los datos en el formulario */}
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => onEdit(producto)}
                  >
                    Editar
                  </button>

                  {/* Al hacer click llamo a onDelete pasando solo el id del producto */}
                  {/* ProductsPage pedirá confirmación antes de eliminarlo */}
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
