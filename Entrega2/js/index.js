document.addEventListener("DOMContentLoaded", function() {
    dropDownList();
});

const categorias = ["CALZADO", "SUPERIOR", "INFERIOR"];
let productos = JSON.parse(localStorage.getItem("productos")) || [];

function agregarProducto() {
    const nombre = document.getElementById("Nombre");
    const categoria = document.getElementById("Categoria");
    const precio = document.getElementById("Precio");

    const producto = {
        nombre: nombre.value.toUpperCase(),
        categoria: categoria.value.toUpperCase(),
        precio: parseFloat(precio.value)
    };

    if (producto.nombre && producto.categoria && !isNaN(producto.precio)) {
        procesarProducto(producto, verificarProducto);
        nombre.value = "";
        categoria.value = "";
        precio.value = "";
    } else {
        alert("Por favor completa todos los campos correctamente.");
    }
}

function procesarProducto(producto, respuesta) {
    if (respuesta(producto)) {
        productos.push(producto);
        localStorage.setItem("productos", JSON.stringify(productos));
        alert("Producto agregado correctamente");
        dropDownList();
        return true;
    } else {
        alert("Categoria no valida, Intente con:\n Calzado, Superior o Inferior");
        return false;
    }
}

function verificarProducto(producto) {
    return producto && categorias.includes(producto.categoria);
}

function eliminarProducto() {
    const nombreProducto = document.getElementById("drop").value;
    console.log(nombreProducto);

    const actualizacion = productos.filter(function(item) {
        return item.nombre !== nombreProducto;
    });

    if (actualizacion.length !== productos.length) {
        productos = actualizacion;
        localStorage.setItem("productos", JSON.stringify(productos));
        alert("Producto eliminado con éxito!");
        const lista = document.getElementById("listaProductos");
        lista.innerHTML = "";
        dropDownList();
    } else {
        alert("No se eliminó el producto");
    }
}

function listarProductos(producto) {

    const lista = document.getElementById("listaProductos");
    lista.innerHTML = "";

    if (!producto) {
        productos.forEach(function(element) {
            const item = document.createElement("li");
            item.textContent = `Producto: ${element.nombre} - Categoria: ${element.categoria} - Precio: $${element.precio}`;
            lista.appendChild(item);
        });
    } else {
        producto.forEach(element=>{
            const item = document.createElement("li");
            item.textContent = `Producto: ${element.nombre} - Categoria: ${element.categoria} - Precio $${element.precio}`;
            lista.appendChild(item);
        })
        
    }
}

function buscarProducto() {
    const producto = document.getElementById("buscarInput").value.toUpperCase();
    const productosBuscar = [];

    if (producto) {
        productos.forEach(function(element) {
            if (element.nombre.includes(producto)) {
                productosBuscar.push(element);
            }
        });

        if (productosBuscar.length > 0) {
            listarProductos(productosBuscar);
        } else {
            alert("Producto no encontrado");
        }
    }
}

function dropDownList() {
    const select = document.getElementById("drop");
    select.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.textContent = "Producto";
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.value = "";
    select.appendChild(placeholder);

    productos.forEach(function(element) {
        const item = document.createElement("option");
        item.textContent = element.nombre;
        item.value = element.nombre;
        select.appendChild(item);
    });
}
