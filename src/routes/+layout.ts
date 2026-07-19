// Sitio 100% estático (adapter-static): prerenderizamos todas las rutas.
// Los datos son ficticios y deterministas, así que todo puede generarse en build.
export const prerender = true;

// URLs limpias en hosting Apache (Hostinger): cada ruta se genera como
// carpeta/index.html (p.ej. /panel/index.html), así /panel abre sin ".html"
// y sin el 403 que da Apache al pedir una carpeta sin índice.
export const trailingSlash = 'always';
