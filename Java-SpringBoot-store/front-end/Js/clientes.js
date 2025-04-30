// URL base de la API
const apiUrl = 'http://localhost:8080/api/v1/clients';

const apiEndpoints = {
    fetchAll: '/obtener/',
    search: '/search/',
    filter: '/search/{filter}',
    getById: '/{id}',
    create: '/enviar/',
    update: '/update/{id}',
    delete: '/delete/{id}', // Eliminar un cliente físicamente
    deactivate: '/{id}' // Desactivar un cliente (eliminación lógica)
};

// Función para listar todos los clientes activos
async function fetchActiveClients() {
    try {
        const response = await fetch(`${apiUrl}${apiEndpoints.fetchAll}`);
        if (!response.ok) {
            throw new Error('Error al obtener los clientes activos');
        }
        const clients = await response.json();
        renderClients(clients);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para buscar clientes por filtro (nombre o teléfono)
async function searchClients(filter) {
    try {
        // Reemplazar {filter} con el valor del filtro proporcionado
        const endpoint = apiEndpoints.filter.replace('{filter}', encodeURIComponent(filter));

        const response = await fetch(`${apiUrl}${endpoint}`);
        if (!response.ok) {
            throw new Error('Error al buscar clientes');
        }

        const clients = await response.json();
        renderClients(clients); // Renderizar los clientes encontrados
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo realizar la búsqueda. Inténtalo de nuevo.');
    }
}

// Función para obtener un cliente por ID y mostrarlo en la tabla
async function fetchClientById(clientId) {
    try {
        // Reemplazar {id} con el clientId en el endpoint
        const endpoint = apiEndpoints.getById.replace('{id}', clientId);

        const response = await fetch(`${apiUrl}${endpoint}`);
        if (!response.ok) {
            throw new Error('Error al obtener el cliente');
        }

        const client = await response.json();
        
        // Solo mostrar el cliente en la tabla
        renderClients([client]);
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo obtener el cliente. Inténtalo de nuevo.');
    }
}

// Validar entrada del formulario
function validateClientForm(name, phone) {
    // Verificar que los campos no estén vacíos
    if (!name.trim() || !phone.trim()) {
        alert('Todos los campos son obligatorios.');
        return false;
    }

    // Validar que el teléfono contenga solo números y tenga una longitud mínima
    const phoneRegex = /^[0-9]{7,15}$/; // Solo números, entre 7 y 15 dígitos
    if (!phoneRegex.test(phone)) {
        alert('El número de teléfono debe contener solo números y tener entre 7 y 15 dígitos.');
        return false;
    }

    // Escapar caracteres especiales para evitar XSS
    const escapedName = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const escapedPhone = phone.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    return { name: escapedName, phone: escapedPhone };
}

// Función para registrar un nuevo cliente
async function createClient(clientData) {
    // Validar los datos antes de enviarlos al servidor
    const validatedData = validateClientForm(clientData.nameClient, clientData.phoneClient);
    if (!validatedData) return; // Detener si los datos no son válidos

    try {
        const response = await fetch(`${apiUrl}${apiEndpoints.create}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientData),
        });

        if (!response.ok) {
            // Si la respuesta no es exitosa, lanza un error con el mensaje de la API
            const errorMessage = await response.text();
            throw new Error(`Error al registrar el cliente: ${errorMessage}`);
        }

        // Si la respuesta es exitosa, mostrar mensaje de éxito
        alert('Cliente registrado exitosamente');
        fetchActiveClients(); // Actualizar la lista de clientes
        toggleForm(); // Cerrar el formulario
    } catch (error) {
        // Mostrar mensaje de error solo si ocurre un problema real
        console.error('Error:', error);
    }
}

// Función para actualizar un cliente
async function updateClient(clientData) {
    // Validar los datos antes de enviarlos al servidor
    const validatedData = validateClientForm(clientData.nameClient, clientData.phoneClient);
    if (!validatedData) return; // Detener si los datos no son válidos

    try {
        const endpoint = apiEndpoints.update.replace('{id}', clientData.idClient);

        const response = await fetch(`${apiUrl}${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientData),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error al actualizar el cliente: ${errorMessage}`);
        }

        alert('Cliente actualizado exitosamente');
        fetchActiveClients();
        toggleForm();
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo actualizar el cliente. Inténtalo de nuevo.');
    }
}

// Confirmar acciones críticas
async function deleteClient(clientId) {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este cliente de forma permanente?');
    if (!confirmDelete) {
        return; // Si el usuario cancela, no se ejecuta la eliminación
    }

    try {
        // Realizar la solicitud DELETE al endpoint correspondiente
        const response = await fetch(`${apiUrl}${apiEndpoints.delete.replace('{id}', clientId)}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            // Si la respuesta no es exitosa, lanza un error con el mensaje de la API
            const errorMessage = await response.text();
            throw new Error(`Error al eliminar el cliente: ${errorMessage}`);
        }

        console.log('Cliente eliminado físicamente');
        alert('Cliente eliminado exitosamente'); // Mensaje de éxito
        fetchActiveClients(); // Actualizar la lista de clientes
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo eliminar el cliente. Inténtalo de nuevo.');
    }
}

// Función para eliminar un cliente lógicamente (cambiar estado a inactivo)
async function deactivateClient(clientId) {
    console.log('Desactivando cliente con ID:', clientId); // Depuración
    const confirmDeactivate = confirm('¿Estás seguro de que deseas desactivar este cliente?');
    if (!confirmDeactivate) {
        return; // Si el usuario cancela, no se ejecuta la desactivación
    }

    try {
        // Reemplazar {id} con el clientId en la URL
        const endpoint = apiEndpoints.deactivate.replace('{id}', clientId);

        // Realizar la solicitud DELETE
        const response = await fetch(`${apiUrl}${endpoint}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 0 }), // Si el backend requiere un cuerpo, envíalo
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error al desactivar el cliente: ${errorMessage}`);
        }

        console.log('Cliente desactivado');
        alert('Cliente desactivado exitosamente'); // Mensaje de éxito
        fetchActiveClients(); // Actualizar la lista de clientes
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo desactivar el cliente. Inténtalo de nuevo.');
    }
}

// Función para renderizar los clientes en la tabla
function renderClients(clients) {
    const clientList = document.getElementById('client-list');
    clientList.innerHTML = ''; // Limpiar contenido previo

    clients.forEach(client => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${client.idClient}</td>
            <td>${client.nameClient}</td>
            <td>${client.phoneClient}</td>
            <td>${client.status === 1 ? 'Activo' : 'Inactivo'}</td>
            <td>
                <button class="btn btn-primary" onclick="fetchClientById(${client.idClient})">Editar</button>
                <button class="btn btn-danger" onclick="deleteClient(${client.idClient})">Eliminar</button>
                <button class="btn btn-warning" onclick="deactivateClient(${client.idClient})">Desactivar</button>
            </td>
        `;
        clientList.appendChild(row);
    });
}

// Función para mostrar u ocultar el formulario
function toggleForm() {
    const modal = document.getElementById('add-client-modal');
    modal.style.display = modal.style.display === 'none' || modal.style.display === '' ? 'flex' : 'none';
    
    // Si estamos cerrando el modal, resetear el formulario
    if (modal.style.display === 'none') {
        document.getElementById('client-form').reset();
        document.getElementById('client-id').value = '';
        document.getElementById('titulo').textContent = 'Agregar Nuevo Cliente';
        document.getElementById('submit-btn').textContent = 'Guardar';
    }
}

// Cerrar el modal al hacer clic fuera de él
window.onclick = function (event) {
    const modal = document.getElementById('add-client-modal');
    if (event.target === modal) {
        toggleForm();
    }
};

// Manejar el envío del formulario
document.getElementById('client-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    const clientId = document.getElementById('client-id').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;

    const validatedData = validateClientForm(name, phone);
    if (!validatedData) return; // Detener si los datos no son válidos

    const clientData = {
        nameClient: validatedData.name,
        phoneClient: validatedData.phone,
        status: 1 // Asegurar que el estado sea 1 (activo)
    };

    if (clientId) {
        // Si hay un ID, actualiza el cliente
        clientData.idClient = clientId;
        updateClient(clientData);
    } else {
        // Si no hay ID, crea un nuevo cliente
        createClient(clientData);
    }
});

// Asociar el botón "Agregar Cliente" con abrir el formulario en modo creación
document.getElementById('add-client').addEventListener('click', function() {
    // Asegurar que el formulario está limpio y en modo creación
    document.getElementById('client-form').reset();
    document.getElementById('client-id').value = '';
    document.getElementById('titulo').textContent = 'Agregar Nuevo Cliente';
    document.getElementById('submit-btn').textContent = 'Guardar';
    toggleForm();
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

    // Llamar al método correspondiente según el tipo de búsqueda
    if (searchType === 'id') {
        fetchClientById(filter); // Buscar por ID
    } else if (searchType === 'name' || searchType === 'phone') {
        searchClients(filter); // Buscar por nombre o teléfono
    }
});

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', fetchActiveClients);