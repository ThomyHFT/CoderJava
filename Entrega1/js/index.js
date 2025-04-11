//  precios
const preciosPlan = {
    basico: 5000,
    estandar: 7500,
    premium: 10000
  };
  const precioPorPerfilExtra = 2000;
  const precioContenidoExclusivo = 3500;
  
  // planes disponibles
  const planesDisponibles = ["básico", "estándar", "premium"];
  
 
  function calcularSuscripcion() {
    let plan = prompt("Elige un plan: Básico, Estándar o Premium").toLowerCase();
    while (!planesDisponibles.includes(plan)) {
      plan = prompt("Plan no válido. Ingresa: Básico, Estándar o Premium").toLowerCase();
    }
  
    let perfilesExtras = parseInt(prompt("¿Cuántos perfiles adicionales necesitas? (0 si ninguno)"));
    if (isNaN(perfilesExtras) || perfilesExtras < 0) perfilesExtras = 0;
  
    let quiereContenidoExclusivo = confirm("¿Deseas acceso a contenido exclusivo?");
  
    // Cálculo
    let total = preciosPlan[plan] + (perfilesExtras * precioPorPerfilExtra);
    if (quiereContenidoExclusivo) total += precioContenidoExclusivo;
  
    // Salida
    alert(`Resumen de tu suscripción:\n
    Plan elegido: ${plan}
    Perfiles adicionales: ${perfilesExtras}
    Contenido exclusivo: ${quiereContenidoExclusivo ? "Sí" : "No"}
    Precio mensual estimado: $${total.toLocaleString("es-CL")}`);
  }
  
  // mensaje inicial
  function iniciarSimulador() {
    alert("¡Bienvenido al simulador de suscripción de Streaming!");
    calcularSuscripcion();
  }
  
  // ejecutar simulador
  iniciarSimulador();
  