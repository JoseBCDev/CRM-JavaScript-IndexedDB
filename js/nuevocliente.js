(function(){ //IFI

    let DB;

    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded',()=>{
        conectarDB();

        formulario.addEventListener('submit', validarCliente);

    });

    function conectarDB(){
        const abrirConexion = window.indexedDB.open('crm',1);

        abrirConexion.onerror = function(){
            console.log('No se pudo conectar a la BDindex');
        }

        abrirConexion.onsuccess = function(){
            console.log('Se establecio conexion con exito');
            DB = abrirConexion.result;
        }
    }

    function validarCliente(e){

        e.preventDefault();

        //Extraccion de los campos del input
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        //Validacion de los campos del formulario
        if(nombre === '' || email === '' || telefono === '' || empresa === '')
        {
            imprimirAlerta('Todos los campos son Obligatorios','error');
        }

        //Creacion de Objeto
        const cliente = {
            nombre,
            email,
            telefono,
            empresa
        }
        //Agrega un id random por el momento
        cliente.id = Date.now();
        //invoca la funcion enviando el objeto cliente
        crearNuevoCliente(cliente);
    }

    function crearNuevoCliente(cliente)
    {
        //para realizar una operacion add,delete,put, se debe generar uan transaccion
        const transaccion = DB.transaction(['crm'],'readwrite');

        const objectStore = transaccion.objectStore('crm');

        objectStore.add(cliente);

         transaccion.oncomplete = function(){
            imprimirAlerta('Se Agrego Correctamente');

            setTimeout(() => {
                //direccionando a otra pagina
                window.location.href = 'index.html';
            }, 3000);
        }

        transaccion.onerror = function(){
            imprimirAlerta('Esos datos ya existen','error');
        }

        
    }

    function imprimirAlerta(mensaje,tipo)
    {

        const alerta = document.querySelector('.alerta');

        if(!alerta)
        {
            const divMensaje = document.createElement('div');
            divMensaje.classList.add('px-4','py-3','rouded','max-w-lg',',mx-auto','mt-6','text-center','border','alerta');


            if(tipo === 'error')
            {
                divMensaje.classList.add('bg-red-100','border-red-400','text-red-700');
            }else{
                divMensaje.classList.add('bg-green-100','border-green-400','text-green-700');
            }

                divMensaje.textContent = mensaje;

            formulario.appendChild(divMensaje);

            setTimeout(() => {
                divMensaje.remove();
            }, 3000); 
        }
        
    }
})();