const apiUrl = 'http://localhost:8080/api/v1/traders';

const apiEndpoints = {
    fetchAll: '/obtener/',
    create: '/enviar/',
    filter: '/search/{filter}',
    getById: '/{id}',
    update: '/update/{id}',
    delete: '/delete/{id}', // Eliminación física
    deactivate: '/{id}' // Eliminación lógica
};

// Función para listar todos los vendedores
async function fetchTraders() {
    try {
        const response = await fetch(`${apiUrl}${apiEndpoints.fetchAll}`);
        if (!response.ok) {
            throw new Error('Error al obtener los vendedores');
        }
        const traders = await response.json();
        renderTraders(traders);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Validar los campos del formulario antes de enviar
function validateForm(traderData) {
    if (!traderData.nameTrader || traderData.nameTrader.trim() === '') {
        alert('El nombre del vendedor es obligatorio.');
        return false;
    }
    return true;
}

// Función para registrar un nuevo vendedor
async function createTrader(traderData) {
    try {
        if (!validateForm(traderData)) {
            return;
        }

        traderData.status = 1; // Activo por defecto

        const response = await fetch(`${apiUrl}${apiEndpoints.create}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(traderData), // Enviar los datos del vendedor
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error al registrar el vendedor: ${errorMessage}`);
        }

        alert('Vendedor registrado exitosamente');
        await fetchTraders(); // Actualizar la lista de vendedores
        toggleTraderForm(); // Ocultar el formulario
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo registrar el vendedor. Por favor, inténtalo de nuevo.');
    }
}

// Función para actualizar un vendedor
async function updateTrader(traderData) {
    try {
        if (!validateForm(traderData)) {
            return;
        }

        traderData.status = 1; // Activo por defecto al editar

        const endpoint = apiEndpoints.update.replace('{id}', traderData.idTrader);

        const response = await fetch(`${apiUrl}${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(traderData),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error al actualizar el vendedor: ${errorMessage}`);
        }

        alert('Vendedor actualizado exitosamente');
        fetchTraders(); // Actualizar la lista de vendedores
        toggleTraderForm(); // Ocultar el formulario
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo actualizar el vendedor.');
    }
}

// Función para eliminar un vendedor físicamente
async function deleteTrader(traderId) {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este vendedor de forma permanente?');
    if (!confirmDelete) {
        return;
    }

    try {
        const endpoint = apiEndpoints.delete.replace('{id}', traderId);

        const response = await fetch(`${apiUrl}${endpoint}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error al eliminar el vendedor: ${errorMessage}`);
        }

        alert('Vendedor eliminado exitosamente');
        fetchTraders();
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo eliminar el vendedor.');
    }
}

// Función para desactivar un vendedor (eliminación lógica)
async function deactivateTrader(traderId) {
    const confirmDeactivate = confirm('¿Estás seguro de que deseas desactivar este vendedor?');
    if (!confirmDeactivate) {
        return;
    }

    try {
        const endpoint = apiEndpoints.deactivate.replace('{id}', traderId);

        const response = await fetch(`${apiUrl}${endpoint}`, {
           method: 'DELETE',
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error al desactivar el vendedor: ${errorMessage}`);
        }

        alert('Vendedor desactivado exitosamente');
        fetchTraders();
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo desactivar el vendedor.');
    }
}

// Función para buscar vendedores por filtro (ID o Nombre)
async function searchTraders(filter, searchType) {
    try {
        let endpoint;

        if (searchType === 'id') {
            // Buscar por ID
            endpoint = apiEndpoints.getById.replace('{id}', filter);
        } else if (searchType === 'name') {
            // Buscar por Nombre
            endpoint = apiEndpoints.filter.replace('{filter}', encodeURIComponent(filter));
        } else {
            throw new Error('Tipo de búsqueda no válido');
        }

        const response = await fetch(`${apiUrl}${endpoint}`);
        if (!response.ok) {
            throw new Error('Error al buscar vendedores');
        }

        const traders = searchType === 'id' ? [await response.json()] : await response.json();
        renderTraders(traders); // Renderizar los vendedores encontrados
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo realizar la búsqueda. Inténtalo de nuevo.');
    }
}

// Función para renderizar los vendedores en la tabla
function renderTraders(traders) {
    const tradersList = document.getElementById('traders-list');
    tradersList.innerHTML = ''; // Limpiar contenido previo

    traders.forEach(trader => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${trader.idTrader}</td>
            <td>${trader.nameTrader}</td>
            <td>${trader.status === 1 ? 'Activo' : 'Inactivo'}</td>
            <td>
                <button class="btn btn-primary" onclick="fetchTraderById(${trader.idTrader})">Editar</button>
                <button class="btn btn-danger" onclick="deleteTrader(${trader.idTrader})">Eliminar</button>
                <button class="btn btn-warning" onclick="deactivateTrader(${trader.idTrader})">Desactivar</button>
            </td>
        `;
        tradersList.appendChild(row);
    });
}

// Función para obtener un vendedor por ID y cargarlo en el formulario
async function fetchTraderById(traderId) {
    try {
        const endpoint = apiEndpoints.getById.replace('{id}', traderId);
        const response = await fetch(`${apiUrl}${endpoint}`);
        if (!response.ok) {
            throw new Error('Error al obtener el vendedor');
        }
        const trader = await response.json();

        // Validar que los datos del vendedor sean correctos
        if (!trader || !trader.idTrader || !trader.nameTrader) {
            throw new Error('Datos del vendedor inválidos');
        }

        // Cargar los datos en el formulario
        document.getElementById('trader-id').value = trader.idTrader;
        document.getElementById('trader-name').value = trader.nameTrader;

        // Cambiar el título y botón para indicar que es una edición
        document.getElementById('titulo-trader').textContent = 'Actualizar Vendedor';
        document.getElementById('submit-trader-btn').textContent = 'Actualizar';

        // Mostrar el formulario
        toggleTraderForm();
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo cargar los datos del vendedor. Por favor, inténtalo de nuevo.');
    }
}

// Mostrar/ocultar el formulario modal
function toggleTraderForm() {
    const modal = document.getElementById('add-trader-modal');
    modal.style.display = modal.style.display === 'none' || modal.style.display === '' ? 'flex' : 'none';
    
    // Si estamos cerrando el modal, resetear el formulario
    if (modal.style.display === 'none') {
        document.getElementById('trader-form').reset();
        document.getElementById('trader-id').value = '';
        document.getElementById('titulo-trader').textContent = 'Agregar Nuevo Vendedor';
        document.getElementById('submit-trader-btn').textContent = 'Guardar';
    }
}

// Cerrar el modal al hacer clic fuera de él
window.onclick = function (event) {
    const modal = document.getElementById('add-trader-modal');
    if (event.target === modal) {
        toggleTraderForm();
    }
};

// Manejar el envío del formulario con validaciones
document.getElementById('trader-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const traderId = document.getElementById('trader-id').value;
    const name = document.getElementById('trader-name').value.trim();

    const traderData = {
        nameTrader: name,
    };

    // Validar los datos del formulario
    if (!validateForm(traderData)) {
        return;
    }

    if (traderId) {
        traderData.idTrader = traderId;
        updateTrader(traderData);
    } else {
        createTrader(traderData);
    }
});

// Asociar el botón "Agregar Vendedor" con abrir el formulario en modo creación
document.getElementById('add-trader').addEventListener('click', function() {
    // Asegurar que el formulario está limpio y en modo creación
    document.getElementById('trader-form').reset();
    document.getElementById('trader-id').value = '';
    document.getElementById('titulo-trader').textContent = 'Agregar Nuevo Vendedor';
    document.getElementById('submit-trader-btn').textContent = 'Guardar';
    toggleTraderForm();
});

// Manejar el evento de búsqueda
document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    const searchType = document.getElementById('search-type').value; // Obtener el tipo de búsqueda
    const filter = document.getElementById('search-input').value.trim(); // Obtener el valor ingresado

    if (!filter) {
        alert('Por favor, ingresa un término de búsqueda.');
        return;
    }

    // Llamar a la función de búsqueda con el filtro y el tipo de búsqueda
    searchTraders(filter, searchType);
});

// Cargar la lista de vendedores al cargar la página
document.addEventListener('DOMContentLoaded', fetchTraders);