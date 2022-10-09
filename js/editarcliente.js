(function(){    //IFI

    let DB;

    document.addEventListener('DOMContentLoaded',()=>{
        conectarDB();

        const parametrosURL = new URLSearchParams(window.location.search);
        const idCliente = parametrosURL.get('id');
        if(idCliente)
        {
            setTimeout(() => {
                 obtenerCliente(idCliente);
            }, 1000);
           
        }


    })

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

    function obtenerCliente(idCliente){
        const transaccion = DB.transaction(['crm'],'readwrite');

        const objectStore = transaccion.objectStore('crm');

        const cliente = objectStore.openCursor();

        cliente.onsuccess = function(e){
            const cursor = e.target.result;
            
            if(cursor)
            { 
                const {id} = cursor.value;
                if(id === Number(idCliente))
                 {
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
             } 
        }
    }

    function llenarFormulario(cliente){
        const {nombre,telefono,email,empresa,id} = cliente;

        const nombreInput = document.querySelector('#nombre');

        nombreInput.value = nombre;
    }

})();