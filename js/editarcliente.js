(function(){    //IFI

    let idCliente;


    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded',()=>{
       conectarDB();

        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');
        if(idCliente)
        {
            setTimeout(() => {
                 obtenerCliente(idCliente);
            }, 1000);          
        }

       formulario.addEventListener('submit',actualizarCliente)

    })

    function actualizarCliente(e){
        e.preventDefault();

        if(nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === '')
        {
            imprimirAlerta('Todos los campos son Obligatorios','error');

            return;
        }

        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente)
        }

        const transaccion = DB.transaction(['crm'],'readwrite');

        const objectStore = transaccion.objectStore('crm');

        objectStore.put(clienteActualizado);

        transaccion.oncomplete = function(){
            imprimirAlerta('Se realizo la Modificación');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }

        transaccion.onerror = function(){
            imprimirAlerta('No se pudo modificar','error');
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
        

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;

    }

})();