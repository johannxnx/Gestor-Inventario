// Una interfaz en TypeScript define la "forma" de un objeto
// Es como un contrato: cualquier objeto de tipo Producto DEBE tener estos campos

// Producto representa un registro que viene de la base de datos
// Tiene todos los campos incluyendo id y created_at que genera el servidor
export interface Producto {
  id: number;               // identificador único generado por la base de datos
  codigo: string;           // código del producto (ej: "PROD-001")
  nombre: string;           // nombre descriptivo del producto
  descripcion: string | null; // puede ser null si no se ingresó descripción
  precio: number;           // precio en quetzales
  categoria: string;        // categoría del producto (ej: "Ferretería")
  created_at?: string;      // fecha de creación, el ? significa que es opcional
}

// ProductoFormData representa los datos del formulario de crear/editar
// Es diferente a Producto porque:
// 1. No tiene id (el formulario no lo necesita)
// 2. precio es string porque los inputs HTML siempre devuelven texto
//    y se convierte a número antes de enviarlo al backend
export interface ProductoFormData {
  codigo: string;
  nombre: string;
  descripcion: string;  // aquí siempre es string (no null) porque el input devuelve ""
  precio: string;       // string en el formulario, se convierte a number al enviar
  categoria: string;
}
