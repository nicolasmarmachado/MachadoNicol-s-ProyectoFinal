//PONER ID EN JSON Y ATRIBUTO DATA-ID EN LA CARD
//HACER CARRITO PARA QUE SUME
//LE DOY A VACIARCARRITO Y CUANDO HAGO CLICK DE NUEVO, SIGUE SUMANDO (VER ULTIMAS FUNCINOES AGREGADAS PORQUE ANTES FUNCIONABA)
// usar sweet alert para cartel error en clima. 

// --------Card con los rubros disponibles--------
const cardContainer = document.querySelector("#container-card");

function cardRubros(){
    for(let rubro of rubros){
    cardContainer.innerHTML+=`
      <div class="card" data-rubro="${rubro}" style="width: 18rem;">
        <img src="assets/img/cart.png" class="card-img-top" alt="...">
        <div class="card-body">
          <p class="card-text">${rubro}</p>
        </div>
      </div>
    `
  }

}
cardRubros()

//--------Recuperación de las cards y obtención de los negocios del rubro seleccionado--------

const cards=document.querySelectorAll('.card')

let rubroSeleccionado;
let muestraRubro;

cards.forEach((card)=>{
  card.addEventListener("click", function () {
    rubroSeleccionado = card.getAttribute("data-rubro");
    mostrarRubro();
    desaparecerRubros();
  });
})

let jsonRubros;
let cardNegocio;
let negocioSeleccionado;

async function mostrarRubro() {
  try{
    const consultaRubros= await fetch('assets/js/data.json')
    jsonRubros=await consultaRubros.json()      
    const negociosFiltrados = jsonRubros.filter(item => item.rubro === rubroSeleccionado);
    const nombresNegocios = [...new Set(negociosFiltrados.map(item => item.negocio))];//Para evitar repetir los negocios
    muestraRubro = document.querySelector(".muestraRubro")
    muestraRubro.innerHTML = "";
    for (const negocio of nombresNegocios) {
      muestraRubro.innerHTML += `
      <div class="card cardNegocio negocio" data-negocio="${negocio}" style="width: 18rem;">
        <img src="assets/img/cart.png" class="card-img-top" alt="...">
        <div class="card-body">
          <p class="card-textNegocio">${negocio}</p>
        </div>
      </div>`;
    }
      const cardsNegocio = document.querySelectorAll('.cardNegocio')

      cardsNegocio.forEach((item) => {
        item.addEventListener("click", function () {
          negocioSeleccionado = item.getAttribute('data-negocio')
        })
      })
  }catch(error){
    swal("Disculpe las molestias!", "No se han podido obtener los negocios del rubro seleccionado. Intente nuevamente más tarde");
  }
  const posicion= muestraRubro.offsetTop;
  window.scrollTo({
    top: posicion,
    behavior: 'smooth'
  })
}

//--------Función para animaciones del click en las cards--------

function desaparecerRubros(){
  cardContainer.classList.add('animate__animated')
  cardContainer.classList.remove('animate__backInRight')
  cardContainer.classList.add('animate__backOutRight')
  muestraRubro.classList.add('animate__backInRight')
  muestraRubro.classList.remove('animate__backOutLeft') 
}

//--------Botón Volver para mostrar rubros--------

const btnVolver= document.querySelector('.boton-volver')

btnVolver.addEventListener('click', volverRubros)


function volverRubros(){
  cardContainer.classList.remove('animate__backOutRight')
  cardContainer.classList.add('animate__backInRight') 
  muestraRubro.classList.add('animate__animated') 
  muestraRubro.classList.add('animate__backOutLeft') 
  articulos.innerHTML='';
}
  
//--------Muestra de los artículos para la venta--------

let articulos;

muestraRubro = document.querySelector(".muestraRubro")

muestraRubro.addEventListener('click', mostrarArticulos)
  
function mostrarArticulos() {
  const consultaJson=rubro.filter((item)=>item.negocio==negocioSeleccionado)
  const art = [...new Set(consultaJson.map(item => item.articulo))];
  const precio = [...new Set(consultaJson.map(item => item.precio))];

  const arrayArtPrecio = [];
  
  let objeto=[];

  articulos = document.querySelector("#articulos");

  while (articulos.firstChild) {
    articulos.firstChild.remove();
  }

  for (let i = 0; i < art.length; i++) {
      objeto = {
      articulo: art[i],
      precio: precio[i]
    };
    arrayArtPrecio.push(objeto);

    articulos.innerHTML += `
    <div class="infoCard">
      <div class="card cardArticulo"style="width: 18rem;">
        <img src="assets/img/cart.png" class="card-img-top" alt="...">
        <div class="card-body">
          <p class="card-textNegocio titulo">${objeto.articulo}</p>
          <p class="card-textNegocio precio">${objeto.precio}</p>
          <a href="#" class="agregarCarrito">Agregar al Carrito</a> 
        </div>
      </div>
    </div>
    `;
  }
  
  const posicion= articulos.offsetTop;
  window.scrollTo({
    top: posicion,
    behavior: 'smooth'
  })
}

//--------Borrar elementos al hacer click en 'Subir'--------

let btnSubir;
btnSubir=document.querySelector('.btnSubir')

btnSubir.addEventListener('click', reiniciarSitio)

function reiniciarSitio(){
  articulos.innerHTML='';
  muestraRubro.innerHTML='';
  volverRubros();
}

//--------BOTONES PARA COMPRA--------

//--------CARRITO--------
let articulosCarrito=[]//no const porque sino no suma los productos iguales
const listaProductos=document.querySelector('.listaProductos')
const contenedorCarrito=document.querySelector('#listaCarrito tbody')
const vaciarCarritoBtn=document.querySelector('#vaciarCarrito')
const carrito=document.querySelector('#carrito')

listaProductos.addEventListener('click', agregarProducto)
carrito.addEventListener('click', eliminarProducto)
vaciarCarritoBtn.addEventListener('click', vaciarCarrito)

let producto;

function eliminarProducto(e){
  e.preventDefault();
  if(e.target.classList.contains('borrarProducto')){
    producto=e.target.parentElement.parentElement;
    const productoId=producto.querySelector('a').getAttribute('data-id');
    articulosCarrito=articulosCarrito.filter(producto=>producto.id!==productoId)
    carritoHTML();
  }
}

function agregarProducto(e){
  e.preventDefault()
  if(e.target.classList.contains('agregarCarrito')){
    producto=e.target.parentElement.parentElement
    leerDatosProducto(producto)
  }
}

function leerDatosProducto(producto){
  const infoProducto={
    imagen: producto.querySelector('img').src,
    titulo: producto.querySelector('.titulo').textContent,
    precio: producto.querySelector('.precio').textContent,
    id: producto.querySelector('a').getAttribute('data-id'),
    cantidad: 1
  } 

  if(articulosCarrito.some(producto=>producto.id===infoProducto.id)){
      const productos=articulosCarrito.map(producto=>{
        if(producto.id===infoProducto.id){
          let cantidad = parseInt(producto.cantidad);
          cantidad += 1;
          producto.cantidad=cantidad;
          return producto
        }else{
          return producto
        }
      })
      articulosCarrito=productos.slice()
  }else{
  }
  articulosCarrito.push(infoProducto)  
  carritoHTML()
}

function carritoHTML(){
  vaciarCarrito();
  articulosCarrito.forEach(producto=>{
    const row=document.createElement('tr')
    row.innerHTML = `
    <td>
      <img src="${producto.imagen}" width="50" alt="">
    </td>
    <td>${producto.titulo}</td>
    <td>${producto.precio}</td>
    <td>${producto.cantidad}</td>
    <td>
      <a href="#" class="borrarProducto" data-id="${producto.id}">Borrar</a>
    </td>
    `;
    contenedorCarrito.appendChild(row);
  })
}

function vaciarCarrito(){
  while(contenedorCarrito.firstChild){
    contenedorCarrito.removeChild(contenedorCarrito.firstChild)
  }
}

//--------Ir a Comprar carrito--------
const comprarCarritoBtn = document.querySelector('#comprarCarrito');

comprarCarritoBtn.addEventListener('click', function(e) {
  e.preventDefault();
  window.location.href = 'compraCarrito.html';
});

const resumenCompra=document.querySelector('#resumenCompra')

articulosCarrito.forEach(producto=>{
  const row=document.createElement('tr')
  row.innerHTML = `
  <td>
    <img src="${producto.imagen}" width="50" alt="">
  </td>
  <td>${producto.titulo}</td>
  <td>${producto.precio}</td>
  <td>${producto.cantidad}</td>
  <td>
    <a href="#" class="borrarProducto" data-id="${producto.id}">Borrar</a>
  </td>
  `;
  resumenCompra.appendChild(row);
})

//--------Volver a Inicio--------

const volverInicio = document.querySelector('.inicio');

volverInicio.addEventListener('click', function(e) {
  e.preventDefault();
  window.location.href = 'index.html';
});

  //--------API clima--------
// let ciudad=document.querySelector('.busquedaLocacion').value
// ciudad=encodeURIComponent(ciudad)
// console.log(ciudad)
const key='194becd837b9fcdbb0f4a963b0a5f357';
const ciudad='Franck';

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${key}`)
.then((resp)=>{
  return resp.json()
})
.then((clima)=>{
  let temp=clima.main.temp
  let humedad=clima.main.humidity
  let tempC= temp -273.15
  let html=document.querySelector('.clima')
  html.innerHTML=`  
 <b> ${ciudad} </b>
 <b> T: ${tempC.toFixed(0)} °C </b>
 <b> H: ${humedad} % </b>
  `
})
.catch((err)=>{
  swal("No se pueden obtener los datos del clima de su ciudad");
})