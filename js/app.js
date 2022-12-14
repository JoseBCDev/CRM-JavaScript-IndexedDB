(function(){    //IFI

    let DB;
    const lista_clientes = document.querySelector('#listado-clientes');

    document.addEventListener('DOMContentLoaded',()=>{
        crearBD();

        if(window.indexedDB.open('crm',1))
        {
            obtenerClientes();
        }

        lista_clientes.addEventListener('click',eliminarRegistro);
    })

    function crearBD(){

        const crearBD = window.indexedDB.open('crm',1);

        crearBD.onerror = function(){
            console.log('No se pudo crear la BDindex');
        }

        crearBD.onsuccess = function(){
            DB = crearBD.result;
            console.log('Se creo la BDindex');
        }

        crearBD.onupgradeneeded = function(e){
            const db = e.target.result;

            const objectStore = db.createObjectStore('crm',{
                keyPath: 'id',
                autoIncrement: true
            });

            objectStore.createIndex('nombre','nombre',{unique:false});
            objectStore.createIndex('email','email',{unique:true});
            objectStore.createIndex('telefono','telefono',{unique:false});
            objectStore.createIndex('empresa','empresa',{unique:false});
            objectStore.createIndex('id','id',{unique:true});
        }
    }

    function eliminarRegistro(e)
    {
        if(e.target.classList.contains('eliminar')){
            const idEliminar = Number(e.target.dataset.cliente);

            const confirmar = confirm('Deseas Eliminar este cliente');

            if(confirmar)
            {
                const transaccion = DB.transaction(['crm'],'readwrite');
                const objectStore = transaccion.objectStore('crm');

                objectStore.delete(idEliminar);

                transaccion.oncomplete = function(){
                    e.target.parentElement.parentElement.remove();
                }

                transaccion.onerror = function(){
                    console.log('No se pudo eliminar');
                }
            }
        }
    }
    function obtenerClientes()
    {
        const abrirConexion = window.indexedDB.open('crm',1);

        abrirConexion.onerror = function(){
            console.log('nose pudo conectar');
        }

        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;

            const objectStore = DB.transaction('crm').objectStore('crm');

            objectStore.openCursor().onsuccess = function(e){
                const cursor = e.target.result;

                if(cursor)
                {
                    const {nombre,email,telefono,empresa,id} = cursor.value;
                    
                    lista_clientes.innerHTML += `
                    <tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-sm leading-5 font-medium text-gray-700 text-lg font-bold">${nombre}</p>
                            <p class="text-sm leading-10 text-gray-700">${email}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-gray-700">${telefono}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 leading-5 text-gray-700">
                            <p class="text-gray-600">${empresa}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                            <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                            <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                        </td>
                    </tr>
                    `;

                    cursor.continue();
                }else{
                    console.log('no hay registro');
                }
            }
        }
        
        


    }
})();