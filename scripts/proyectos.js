window.onload = function () {
    obtenerProyectos();
    obtenerUsuariosParaSelect();
};

async function obtenerProyectos() {
    try {
        const respuesta = await fetch('/proyectos');
        
        if (!respuesta.ok) {
            console.log('No hay proyectos registrados o hubo un error.');
            return;
        }

        const proyectos = await respuesta.json();

        new DataTable('#tablaProyectos', {
            data: proyectos,
            columns: [
                { data: 'nombre' },
                { 
                    data: null, 
                    render: function (data, type, row) {
                        return `${row.usuario_nombre || 'N/A'} <br><small class="text-secondary">${row.usuario_rut || ''}</small>`;
                    }
                },
                { 
                    data: 'prioridad',
                    render: function(data) {
                        let badgeColor = data === 'Alta' ? 'danger' : data === 'Media' ? 'warning' : 'success';
                        return `<span class="badge bg-${badgeColor}">${data}</span>`;
                    }
                },
                { data: 'estado' },
                { 
                    data: 'avance',
                    render: function(data) {
                        return `
                        <div class="progress" style="height: 20px; background-color: #1a1a24;">
                            <div class="progress-bar bg-info progress-bar-striped progress-bar-animated" role="progressbar" style="width: ${data}%;" aria-valuenow="${data}" aria-valuemin="0" aria-valuemax="100">${data}%</div>
                        </div>`;
                    }
                },
                { 
                    data: 'presupuesto',
                    render: function(data) {
                        return data ? `$${data.toLocaleString()}` : '$0';
                    }
                }
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json',
            }
        });
    } catch (error) {
        console.log('Error: ', error);
    }
}

async function obtenerUsuariosParaSelect() {
    try {
        const respuesta = await fetch('/usuarios');
        if (!respuesta.ok) return;

        const usuarios = await respuesta.json();
        const select = document.getElementById('selectUsuario');

        usuarios.forEach(usuario => {
            const opcion = document.createElement('option');
            opcion.value = usuario._id;
            opcion.textContent = `${usuario.nombre} (${usuario.rut})`;
            select.appendChild(opcion);
        });
    } catch (error) {
        console.log('Error obteniendo usuarios: ', error);
    }
}

async function guardarProyecto() {
    const form = document.getElementById('registroProyecto');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const respuesta = await fetch('/guardarProyecto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (respuesta.ok) {
            alert('¡Misión iniciada exitosamente!');
            location.reload(); // Recarga para ver el nuevo proyecto en la tabla
        } else {
            alert('Error al iniciar la misión.');
        }
    } catch (error) {
        console.log('Error al guardar el proyecto: ', error);
    }
}
