let productos = [];
let carrito = [];
const CATEGORIAS = ["CALZADO", "SUPERIOR", "INFERIOR"];


function guardarLocalStorage() {
  localStorage.setItem("productos", JSON.stringify(productos));
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarLocalStorage() {
  const productosGuardados = JSON.parse(localStorage.getItem("productos"));
  if (productosGuardados) productos = productosGuardados;

  const carritoGuardado = JSON.parse(localStorage.getItem("carrito"));
  if (carritoGuardado) carrito = carritoGuardado;
}

async function cargarProductos() {
  try {
    cargarLocalStorage();
    if(productos.length>0){
      renderizarProductos(productos);
    }
    else{
      const respuesta = await fetch("../mock/productos.json");
      productos = await respuesta.json();
      renderizarProductos(productos);
    }
    if(carrito.length>0){
      renderizarCarrito();
    }
    

  } catch (error) {
    console.error("Error cargando productos:", error);
    mostrarMensaje("Error cargando productos", "error");
  }
}


document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();


  document.getElementById("formProducto").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("productoId").value;
    if (id) {
      guardarEdicion(id);
    } else {
      agregarProducto();
    }
  });

  document.getElementById("btnCancelarEdicion").addEventListener("click", () => {
    limpiarFormulario();
  });


  document.getElementById("buscarInput").addEventListener("input", buscarProducto);
});


function renderizarProductos(productosAMostrar) {
  const lista = document.getElementById("listaProductos");
  lista.innerHTML = "";

  if (productosAMostrar.length === 0) {
    lista.innerHTML = "<li>No hay productos disponibles.</li>";
    return;
  }

  productosAMostrar.forEach((producto) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <strong>${producto.nombre}</strong><br>
      Categoría: ${producto.categoria}<br>
      Precio: $${producto.precio}<br>
      Stock: ${producto.stock}<br>
      <button onclick="agregarAlCarrito('${producto.id}')">Agregar al carrito</button>
      <button onclick="cargarEdicion('${producto.id}')">Editar</button>
      <button onclick="eliminarProducto('${producto.id}')">Eliminar</button>
    `;
    lista.appendChild(item);
  });
}


function agregarProducto() {
  const nombre = document.getElementById("nombreProducto").value.trim().toUpperCase();
  const categoria = document.getElementById("categoriaProducto").value.trim().toUpperCase();
  const precio = parseFloat(document.getElementById("precioProducto").value);
  const unidades = parseInt(document.getElementById("unidadesProducto").value);

  if (!nombre || !categoria || isNaN(precio) || isNaN(unidades) || precio < 0 || unidades <= 0 || !CATEGORIAS.includes(categoria)) {
    return mostrarMensaje("Datos inválidos. Revisa los campos.", "error");
  }

  const nuevoProducto = {
    id: crypto.randomUUID(),
    nombre,
    categoria,
    precio,
    stock: unidades,
  };

  productos.push(nuevoProducto);
  guardarLocalStorage();
  mostrarMensaje("Producto agregado correctamente", "success");
  limpiarFormulario();
  renderizarProductos(productos);
  actualizarDropdown(productos);
}

function cargarEdicion(id) {
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;

  document.getElementById("productoId").value = producto.id;
  document.getElementById("nombreProducto").value = producto.nombre;
  document.getElementById("categoriaProducto").value = producto.categoria;
  document.getElementById("precioProducto").value = producto.precio;
  document.getElementById("unidadesProducto").value = producto.stock;

  document.getElementById("btnAgregarEditar").textContent = "Guardar Cambios";
  document.getElementById("btnCancelarEdicion").hidden = false;
}

function guardarEdicion(id) {
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;

  const nombre = document.getElementById("nombreProducto").value.trim().toUpperCase();
  const categoria = document.getElementById("categoriaProducto").value.trim().toUpperCase();
  const precio = parseFloat(document.getElementById("precioProducto").value);
  const unidades = parseInt(document.getElementById("unidadesProducto").value);

  if (!nombre || !categoria || isNaN(precio) || isNaN(unidades) || precio < 0 || unidades < 0 || !CATEGORIAS.includes(categoria)) {
    return mostrarMensaje("Datos inválidos al editar", "error");
  }

  producto.nombre = nombre;
  producto.categoria = categoria;
  producto.precio = precio;
  producto.stock = unidades;

  guardarLocalStorage();
  mostrarMensaje("Producto actualizado", "success");
  limpiarFormulario();
  renderizarProductos(productos);
  actualizarDropdown(productos);
}

function limpiarFormulario() {
  document.getElementById("formProducto").reset();
  document.getElementById("productoId").value = "";
  document.getElementById("btnAgregarEditar").textContent = "Agregar Producto";
  document.getElementById("btnCancelarEdicion").hidden = true;
}


function eliminarProducto(id) {
  Swal.fire({
    title: '¿Seguro que quieres eliminar este producto?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      productos = productos.filter((p) => p.id !== id);
      carrito = carrito.filter((c) => c.id !== id);
      guardarLocalStorage();
      renderizarProductos(productos);
      renderizarCarrito();
      actualizarDropdown(productos);
      mostrarMensaje("Producto eliminado", "success");
    }
  });
}


function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  if (!producto || producto.stock <= 0) {
    return mostrarMensaje("Producto sin stock", "warning");
  }

  const item = carrito.find((p) => p.id === id);
  if (item) {
    item.unidades++;
  } else {
    carrito.push({ ...producto, unidades: 1 });
  }

  producto.stock--;
  guardarLocalStorage();
  mostrarMensaje("Producto agregado al carrito", "success");
  renderizarProductos(productos);
  renderizarCarrito();
}

function renderizarCarrito() {
  const contenedor = document.getElementById("carrito");
  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>El carrito está vacío.</p>";
    return;
  }

  const lista = document.createElement("ul");

  carrito.forEach((item) => {
    const producto = productos.find(p => p.id === item.id);
    const stockDisponible = producto ? producto.stock : 0;

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.nombre}</strong> - $${item.precio} x ${item.unidades}
      <button onclick="modificarCantidad('${item.id}', -1)">-</button>
      <button onclick="modificarCantidad('${item.id}', 1)" ${stockDisponible <= 0 ? "disabled" : ""}>+</button>
      <button onclick="eliminarDelCarrito('${item.id}')">Eliminar</button>
    `;
    lista.appendChild(li);
  });

  contenedor.appendChild(lista);

  const total = carrito.reduce((acc, item) => acc + item.precio * item.unidades, 0);
  contenedor.innerHTML += `<strong>Total: $${total}</strong><br>`;

  const btnCheckout = document.createElement("button");
  btnCheckout.textContent = "Finalizar compra";
  btnCheckout.disabled = carrito.length === 0;
  btnCheckout.onclick = finalizarCompra;
  contenedor.appendChild(btnCheckout);
}

function modificarCantidad(id, cambio) {
  const item = carrito.find((p) => p.id === id);
  const producto = productos.find((p) => p.id === id);
  if (!item || !producto) return;

  if (cambio > 0 && producto.stock <= 0) {
    return mostrarMensaje("No hay stock disponible", "warning");
  }

  item.unidades += cambio;
  producto.stock -= cambio;

  if (item.unidades <= 0) {
    eliminarDelCarrito(id);
  } else {
    guardarLocalStorage();
    renderizarProductos(productos);
    renderizarCarrito();
  }
}

function eliminarDelCarrito(id) {
  const index = carrito.findIndex((p) => p.id === id);
  if (index === -1) return;


  const producto = productos.find((p) => p.id === id);
  if (producto) producto.stock += carrito[index].unidades;

  carrito.splice(index, 1);
  guardarLocalStorage();
  renderizarProductos(productos);
  renderizarCarrito();
  mostrarMensaje("Producto eliminado del carrito", "info");
}

function finalizarCompra() {
  if (carrito.length === 0) return;

  Swal.fire({
    title: "¿Deseas confirmar la compra?",
    text: "Esta acción no se puede deshacer",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, confirmar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
    
      const fecha = new Date();
      const fechaFormateada = fecha.toLocaleDateString();
      const horaFormateada = fecha.toLocaleTimeString();


      const numeroOrden = Math.floor(100000 + Math.random() * 900000);

    
      let resumen = `
        <p><strong>Orden #${numeroOrden}</strong></p>
        <p><strong>Fecha:</strong> ${fechaFormateada}</p>
        <p><strong>Hora:</strong> ${horaFormateada}</p>
        <hr>
        <ul style="text-align:left">
      `;

      let total = 0;

      carrito.forEach((producto) => {
        const subtotal = producto.precio * producto.unidades;
        total += subtotal;
        resumen += `<li><strong>${producto.nombre}</strong> x${producto.unidades} - $${subtotal.toLocaleString()}</li>`;
      });

      resumen += `</ul><hr><p><strong>Total: $${total.toLocaleString()}</strong></p>`;

      Swal.fire({
        title: "¡Compra realizada con éxito!",
        html: resumen,
        icon: "success",
        confirmButtonText: "Aceptar"
      });

      carrito = [];
      guardarLocalStorage();
      renderizarCarrito();
      renderizarProductos(productos);
    }
  });
}


function buscarProducto() {
  const texto = document.getElementById("buscarInput").value.trim().toUpperCase();
  const filtrados = productos.filter((p) => p.nombre.includes(texto));
  renderizarProductos(filtrados);
}


function mostrarMensaje(texto, icono = "info") {
  Swal.fire({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    title: texto,
    icon: icono,
  });
}
