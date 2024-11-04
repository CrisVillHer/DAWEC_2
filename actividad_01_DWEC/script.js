class Carrito {

    #productos = [];

    constructor(productos) {
        this.#productos = [];
    }
    
    actualizarUnidades(sku, unidades) {
    // Actualiza el número de unidades que se quieren comprar de un producto

    const productoExistente = this.#productos.find(producto => producto.sku === sku);
    if (productoExistente) {
        productoExistente.quantity = unidades;
    } else {
        this.#productos.push({ sku, quantity: unidades });
    }

    }

    obtenerInformacionProducto(sku) {
    // Devuelve los datos de un producto además de las unidades seleccionadas

        for (const producto of this.#productos) {
            if (producto.sku === sku) {
                return {
                    sku: producto.sku,
                    quantity: producto.quantity
                };
            }
        }
        return null; 

    }

    obtenerCarrito() {
    // Devuelve información de los productos añadidos al carrito
    // Además del total calculado de todos los productos

    let total = 0;
    const productosConPrecios = [];

    this.#productos.forEach(producto => {
        const precioPorUnidad = preciosPorSKU[producto.sku] || 0;
        const totalPrecio = precioPorUnidad * producto.quantity;
        total += totalPrecio; // Acumular el total

        productosConPrecios.push({
            sku: producto.sku,
            quantity: producto.quantity,
            totalPrecio: totalPrecio.toFixed(2) // Formatear a dos decimales
        });
    });

    return {
        total: total.toFixed(2),
        currency: "€",
        products: productosConPrecios
    };

    }
    }

 //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------   

var productos = [];
let moneda;
const preciosPorSKU = {};
const carrito = new Carrito();


document.addEventListener('DOMContentLoaded',function(event) {
    const totalCarritoDiv = document.getElementById("productosCarrito"); // Div para mostrar los artículos del carrito

    function cargarTablaProductos(productos){       
        const tablaProducts = document.getElementById("tablaProductos");

       productos.forEach(pro => {


        const Products = {
            id: pro.SKU,
            descripcion: pro.title,
            precio: Number(pro.price)

        }

        preciosPorSKU[Products.id] = Products.precio;
        let precioProducto = Number(Products.precio);


 //--------------------------------------------------------------------------------------------------------------------------------------------------------------------TABLA


//---------------------------------------------------------------------------------------------------------------------------idProducto
        const ProductsId = document.createElement('td');

        const descripcionTexto = document.createElement('p');
        descripcionTexto.innerText = Products.descripcion;

        const idTexto = document.createElement('p');
        idTexto.innerText = Products.id;

        ProductsId.append(descripcionTexto, idTexto);


//-------------------------------------------------------------------------------------------------------------------------- Cantidad


        const inputCelda = document.createElement('td'); //-----------------input 
        const inputNum = document.createElement('input');
        inputNum.setAttribute('type', 'number');

        inputNum.style.width = "25px"; 
        inputNum.style.height = "25px"; 
        inputNum.style.padding = "2px";



        const resta = document.createElement('button') //-------------------boton de resta
        resta.textContent = "-"

        resta.style.marginRight = "5px"; 
        resta.style.padding = "5px";
        resta.style.fontSize = "12px";
        resta.style.width = "20px";
        

        resta.addEventListener('click', function() {
            let currentValue = Number(inputNum.value);
                if (currentValue > 1) {
                    inputNum.value = currentValue - 1;
                }
                actualizarCarrito(Products.id, Number(inputNum.value));
                actualizarPrecioTotal();
            });
   


        
        const suma = document.createElement('button')//---------------------boton de suma
        suma.textContent = "+"

        suma.style.marginLeft = "5px";
        suma.style.padding = "5px";
        suma.style.fontSize = "12px";

        suma.addEventListener('click', function() {
            let currentValue = Number(inputNum.value);
                inputNum.value = currentValue + 1;
                actualizarCarrito(Products.id, Number(inputNum.value));
                actualizarPrecioTotal();
            });



    


      // Evento para cambiar el precio total cuando se modifica el input directamente
        //lo que hace el addEventListener es que añade al input creado un evento que es 'input' en este caso lo qeu hace el evento es que hace lo que hace la funcion cuando el input cambia(se pone un num)
        //lo que hace la funcion es que si el numero que se introduce es menor que 1 entonces no te deja hacer nada y se pone a 1
        //Number(inputNum.value) lo que hace es covertir el input en un valor numerico porque si no se manejario como string por defecto
        //por ultimo se llama la funcion  actualizarPrecioTotal(); que se encarga de recalcular el precio total del producto en base a la cantidad ingresada en el campo de entrada inputNum.

      inputNum.addEventListener('input', function() {
        if (Number(inputNum.value) < 1) {
            inputNum.value = 1; 
        }
        actualizarCarrito(Products.id, Number(inputNum.value));
        actualizarPrecioTotal();
    });         

        
        
        inputCelda.append(resta, inputNum, suma);

//----------------------------------------------------------------------------------------------------------------------------Precio
       
        const price = document.createElement('td');
        price.innerText = `${precioProducto.toFixed(2)} ${moneda}`;
        

//----------------------------------------------------------------------------------------------------------------------------Total

        const precioTotal = document.createElement('td');
        precioTotal.innerText = `${precioProducto.toFixed(2)} ${moneda}` ;


     // Función para actualizar el precio total cuando cambia la cantidad
        function actualizarPrecioTotal() {
            let cantidad = Number(inputNum.value);
            let total = precioProducto * cantidad;
            
            precioTotal.innerText = `${total.toFixed(2)} ${moneda}` ;
        }


//Crea la fila y añade las celdas
        const tr = document.createElement('tr');
        tr.append(ProductsId, inputCelda, price, precioTotal); 

//Añade la fila a la tabla
        tablaProducts.append(tr);

       });
    }

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------FIN TABLA
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------FUNCIONES

 // Actualizar el carrito con la nueva cantidad y mostrar el total
 function actualizarCarrito(sku, unidades) {
    carrito.actualizarUnidades(sku, unidades);
    mostrarTotalCarrito();
}

function mostrarTotalCarrito() {
    totalCarritoDiv.innerHTML = ''; 
    const resumenCarrito = carrito.obtenerCarrito();

      // Crear un contenedor para mostrar los productos
      const productosDiv = document.createElement('div');
      productosDiv.style.display = 'flex';
      productosDiv.style.flexDirection = 'column';


    resumenCarrito.products.forEach(product => {
         // Obtener información del producto
        const infoProducto = carrito.obtenerInformacionProducto(product.sku); // Obtener info de cada producto


    if(infoProducto){

            // Crear un div para el producto 
            const itemDiv = document.createElement('div');
            itemDiv.style.display = 'flex';
            itemDiv.style.justifyContent = 'space-between';
            itemDiv.style.marginBottom = '5px';

            // Crear texto para el nombre, cantidad y precio del producto
        const nombreProducto = document.createElement('span');
        nombreProducto.innerText = `${infoProducto.quantity}x ${infoProducto.sku}`;
      

        const precioUnitario = preciosPorSKU[product.sku] || 0;
        const precioProducto = document.createElement('span');
        precioProducto.innerText = `${infoProducto.quantity}x${precioUnitario.toFixed(2)}€`;
        precioProducto.style.textAlign = 'right';

        itemDiv.appendChild(nombreProducto);
        itemDiv.appendChild(precioProducto);
        productosDiv.appendChild(itemDiv);
    
    }


       

    });

    // Agregar el contenedor de productos al div principal
    totalCarritoDiv.appendChild(productosDiv);


      // Mostrar el total en el elemento HTML con id "totalFinal"
      const totalFinalSpan = document.getElementById("totalFinal");
      totalFinalSpan.innerText = `${resumenCarrito.total} ${resumenCarrito.currency}`; 
}



 // Utilizando arrow functions
 fetch('https://jsonblob.com/api/1297988991251767296')
 .then(response => response.json())
        .then(stock => {
            productos = stock.products;
            moneda = stock.currency;
            cargarTablaProductos(productos);                 
            console.log(productos);
        });

});