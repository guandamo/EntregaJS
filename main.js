const monedasJSON = '{"monedas": [{"nombre": "Bitcoin", "abreviatura": "BTC", "precio": 27500}, {"nombre": "Ethereum", "abreviatura": "ETH", "precio": 1800}, {"nombre": "Litecoin", "abreviatura": "LTC", "precio": 135}]}';

const monedas = JSON.parse(monedasJSON).monedas;

let saldoDisponible = 0;

const saldoIngresado = document.getElementById("saldo");
const saldoDispoElemento = document.getElementById("saldo-dispo");
const cantidadComprarElementos = document.querySelectorAll("#Cantidad-comprar");
const comprarBotones = document.querySelectorAll(".comprar");

document.getElementById("saldo-ingresar").addEventListener("submit", (event) => {
event.preventDefault();
const saldo = Number(saldoIngresado.value);
if (isNaN(saldo) || saldo <= 0) {
swal("Ingrese un saldo válido");
return;
}
saldoDisponible = saldo;
guardarSaldoEnLocalStorage(saldoDisponible);
actualizarSaldoDisponible();
saldoIngresado.value = "";
});

for (let i = 0; i < monedas.length; i++) {
const moneda = monedas[i];
const cantidadComprarElemento = cantidadComprarElementos[i];
const comprarBoton = comprarBotones[i];

comprarBoton.addEventListener("click", () => {
const cantidadComprar = Number(cantidadComprarElemento.value);
if (isNaN(cantidadComprar) || cantidadComprar <= 0) {
    swal("Ingrese una cantidad valida");
    return;
}
const precioTotal = cantidadComprar * moneda.precio;
if (precioTotal > saldoDisponible) {
    swal("No tiene suficiente saldo para comprar esta cantidad");
    return;
}

const promesaCompra = new Promise((resolve, reject) => {
    setTimeout(() => {
    saldoDisponible -= precioTotal;
    guardarSaldoEnLocalStorage(saldoDisponible);
    actualizarSaldoDisponible();
    cantidadComprarElemento.value = "1";
    resolve(`Ha comprado ${cantidadComprar} ${moneda.abreviatura} por un total de ${precioTotal}`);
    }, 2000);
});

promesaCompra.then((mensaje) => {
    const toast = document.querySelector("#comprar");
    Toastify({
    text: mensaje,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top",
    position: "right",
    background: "linear-gradient(to right, #00b09b, #96c93d)",
    stopOnFocus: true,
    }).showToast();
});
});
}

function guardarSaldoEnLocalStorage(saldo) {
localStorage.setItem("saldo", saldo);
}

function obtenerSaldoDelLocalStorage() {
const saldoGuardado = localStorage.getItem("saldo");
if (saldoGuardado !== null) {
saldoDisponible = Number(saldoGuardado);
}
actualizarSaldoDisponible();
}

function actualizarSaldoDisponible() {
saldoDispoElemento.value = saldoDisponible.toFixed(2);
}

obtenerSaldoDelLocalStorage();
