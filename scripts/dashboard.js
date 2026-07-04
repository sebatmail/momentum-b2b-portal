let tablaDashboard;

window.onload = function () {
    obtenerPartnersParaLogin();
};

async function obtenerPartnersParaLogin() {
    try {
        const respuesta = await fetch('/usuarios');
        if (!respuesta.ok) return;

        const usuarios = await respuesta.json();
        const select = document.getElementById('selectPartnerLogin');

        usuarios.forEach(usuario => {
            const opcion = document.createElement('option');
            opcion.value = usuario._id;
            opcion.textContent = `${usuario.nombre} (${usuario.rut})`;
            select.appendChild(opcion);
        });
    } catch (error) {
        console.log('Error obteniendo partners: ', error);
    }
}

async function iniciarDashboard() {
    const select = document.getElementById('selectPartnerLogin');
    const usuarioId = select.value;
    const partnerName = select.options[select.selectedIndex].text.split(' (')[0];

    if (!usuarioId) {
        alert("Por favor, selecciona un perfil de Partner.");
        return;
    }

    try {
        const respuesta = await fetch(`/proyectos/partner/${usuarioId}`);
        const proyectos = await respuesta.json();

        // Calcular KPIs
        const totalReferidos = proyectos.length;
        const volumenVentas = proyectos.reduce((acc, curr) => acc + (curr.presupuesto || 0), 0);

        // Actualizar UI
        document.getElementById('partnerNameDisplay').textContent = partnerName;
        document.getElementById('kpiTotalReferidos').textContent = totalReferidos;
        document.getElementById('kpiTotalPresupuesto').textContent = `$${volumenVentas.toLocaleString()}`;

        // Mostrar Dashboard
        document.getElementById('loginSection').classList.add('d-none');
        document.getElementById('dashboardContent').classList.remove('d-none');

        // Renderizar Tabla
        if (tablaDashboard) {
            tablaDashboard.destroy();
        }

        tablaDashboard = new DataTable('#tablaDashboard', {
            data: proyectos,
            columns: [
                { data: 'nombre' },
                { data: 'categoria', defaultContent: 'Servicio Base' },
                { 
                    data: 'estado',
                    render: function(data) {
                        return `<span class="text-info">${data}</span>`;
                    }
                },
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
                emptyTable: "Aún no has referido clientes a MomentumSpace."
            }
        });

    } catch (error) {
        console.log('Error al cargar dashboard: ', error);
        alert('Hubo un error al cargar el dashboard.');
    }
}

function cerrarDashboard() {
    document.getElementById('dashboardContent').classList.add('d-none');
    document.getElementById('loginSection').classList.remove('d-none');
    document.getElementById('selectPartnerLogin').value = "";
}
