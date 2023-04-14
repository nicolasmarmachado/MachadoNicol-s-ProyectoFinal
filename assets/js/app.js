//HACER QUE SE BORREN LAS CARDS DE ARTICULOS Y QUE NO SE SUMEN AL CLICKEAR DE NUEVO.
//QUE HAGA SCROLL A LAS TARJETAS
//HACER CARRITO PARA QUE SUME
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
    console.log(nombresNegocios)
    muestraRubro = document.querySelector(".muestraRubro")
    console.log(muestraRubro)
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
      console.log(cardsNegocio)

      cardsNegocio.forEach((item) => {
        item.addEventListener("click", function () {
          negocioSeleccionado = item.getAttribute('data-negocio')
          console.log(negocioSeleccionado)
        })
      })
  }catch(error){
    console.log(error)
  }
  // const posicion= muestraRubro.offsetTop;
  // window.scrollTo({
  //   top: posicion,
  //   behavior: 'smooth'
  // })
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
  // articulos.innerHTML='';

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
      <div class="card cardArticulo"style="width: 18rem;">
        <img src="assets/img/cart.png" class="card-img-top" alt="...">
        <div class="card-body">
          <p class="card-textNegocio">${objeto.articulo}</p>
          <p class="card-textNegocio">${objeto.precio}</p>
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
btnSubir=document.querySelector('#btnSubir')

btnSubir.addEventListener('click', reiniciarSitio)

function reiniciarSitio(){
  articulos.innerHTML='';
  muestraRubro.innerHTML='';
  cardRubros(); 
}
  //--------API clima--------

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
  let html=document.querySelector('#clima')
  html.innerHTML=`  
  T: ${tempC.toFixed(0)} °C <br>
  H: ${humedad} %
  `
})
.catch((err)=>{
  console.log(err)
})



