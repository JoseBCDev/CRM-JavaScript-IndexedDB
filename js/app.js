(function(){    //IFI

    let DB;

    document.addEventListener('DOMContentLoaded',()=>{
        crearBD();
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
})();