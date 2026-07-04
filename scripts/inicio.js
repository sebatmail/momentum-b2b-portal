window.onload = function () {
    obtenerUsuarios();
};

async function obtenerUsuarios() {
    try {
        const respuesta = await fetch('/usuarios');
        const usuarios = await respuesta.json();

        console.log(usuarios);

        new DataTable('#tablaUsuarios',{
            data: usuarios,
            columns:[
                {data:'nombre'},
                {data:'correo'},
                {data:'rut'},
                {data:'telefono'},
                {
                    data:'fechaNacimiento',
                    render: function(data) {
                        return data ? new Date(data).toLocaleDateString() : '';
                    }
                },
                {data:'genero'},
                {data:'nacionalidad'}
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json',
            }
        });
    } catch (error) {
        console.log('Error: ', error);
    }
};
