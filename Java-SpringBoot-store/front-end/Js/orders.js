// URL base de la API
const apiUrlOrders = 'http://localhost:8080/api/v1/orders';
const apiUrlClients = 'http://localhost:8080/api/v1/clients';
const apiUrlTraders = 'http://localhost:8080/api/v1/traders';

const apiEndpointsOrders = {
    fetchAll: '/obtener/',
    search: '/search/',
    filter: '/search/{filter}',
    getById: '/{id}',
    create: '/enviar/',
    update: '/update/{id}',
    delete: '/delete/{id}',
    deactivate: '/{id}'
};

// Obtener todos los pedidos
async function fetchAllOrders() {
    try {
        const response = await fetch(`${apiUrlOrders}${apiEndpointsOrders.fetchAll}`);
        if (!response.ok) throw new Error('Error al obtener los pedidos');
        const data = await response.json();
        console.log('Respuesta de la API (pedidos):', data);
        return data;
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        return [];
    }
}

// Obtener todos los clientes
async function fetchAllClients() {
    try {
        const response = await fetch(`${apiUrlClients}/obtener/`);
        if (!response.ok) throw new Error('Error al obtener los clientes');
        const data = await response.json();
        console.log('Clientes obtenidos:', data);
        return data;
    } catch (error) {
        console.error('Error al obtener los clientes:', error);
        return [];
    }
}

// Obtener todos los vendedores
async function fetchAllTraders() {
    try {
        const response = await fetch(`${apiUrlTraders}/obtener/`);
        if (!response.ok) throw new Error('Error al obtener los vendedores');
        const data = await response.json();
        console.log('Vendedores obtenidos:', data);
        return data;
    } catch (error) {
        console.error('Error al obtener los vendedores:', error);
        return [];
    }
}

// Crear un nuevo pedido
async function createOrder(orderData) {
    try {
        console.log('Datos enviados al backend:', orderData);
        const response = await fetch(`${apiUrlOrders}${apiEndpointsOrders.create}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        if (!response.ok) throw new Error('Error al crear el pedido');
        const data = await response.json();
        console.log('Pedido creado:', data);
        return data;
    } catch (error) {
        console.error('Error al crear el pedido:', error);
        alert('Error al crear el pedido. Por favor, inténtalo de nuevo.');
    }
}

// Actualizar un pedido existente
async function updateOrder(id, orderData) {
    try {
        const endpoint = apiEndpointsOrders.update.replace('{id}', id);
        console.log('Actualizando pedido con ID:', id);
        console.log('Datos enviados para actualización:', orderData);
        
        const response = await fetch(`${apiUrlOrders}${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        
        if (!response.ok) throw new Error('Error al actualizar el pedido');
        const data = await response.json();
        console.log('Pedido actualizado:', data);
        return data;
    } catch (error) {
        console.error('Error al actualizar el pedido:', error);
        alert('Error al actualizar el pedido. Por favor, inténtalo de nuevo.');
    }
}

// Eliminar un pedido físicamente
async function deleteOrder(id) {
    try {
        const endpoint = apiEndpointsOrders.delete.replace('{id}', id);
        const response = await fetch(`${apiUrlOrders}${endpoint}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar el pedido');
        console.log('Pedido eliminado correctamente');
        return true;
    } catch (error) {
        console.error('Error al eliminar el pedido:', error);
        alert('Error al eliminar el pedido. Por favor, inténtalo de nuevo.');
        return false;
    }
}

// Desactivar un pedido (eliminación lógica)
async function deactivateOrder(id) {
    try {
        const endpoint = apiEndpointsOrders.deactivate.replace('{id}', id);
        console.log('Endpoint para desactivar:', apiUrlOrders + endpoint);
        const response = await fetch(`${apiUrlOrders}${endpoint}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al desactivar el pedido');
        console.log('Pedido desactivado correctamente');
        return true;
    } catch (error) {
        console.error('Error al desactivar el pedido:', error);
        alert('Error al desactivar el pedido. Por favor, inténtalo de nuevo.');
        return false;
    }
}

// Función para renderizar los pedidos en la tabla
function renderPedidos(pedidos) {
    const pedidosTableBody = document.getElementById('pedidosTableBody');
    if (!pedidosTableBody) {
        console.error('Elemento pedidosTableBody no encontrado');
        return;
    }
    
    pedidosTableBody.innerHTML = ''; // Limpiar contenido previo

    if (!pedidos || pedidos.length === 0) {
        // Mostrar mensaje si no hay pedidos
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5" class="text-center">No hay pedidos disponibles</td>';
        pedidosTableBody.appendChild(row);
        return;
    }

    pedidos.forEach(pedido => {
        // Extraer los datos necesarios con verificación de null/undefined
        const idOrder = pedido.idOrder || pedido.idOrders || 'N/A';
        const dateOrder = pedido.dateOrder || 'N/A';
        const clientName = pedido.client?.nameClient || 'N/A';
        const traderName = pedido.trader?.nameTrader || pedido.seller?.nameSeller || 'N/A';
        
        // Crear la fila con los botones de acción
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${idOrder}</td>
            <td>${formatearFecha(dateOrder)}</td>
            <td>${clientName}</td>
            <td>${traderName}</td>
            <td>
                <button class="btn btn-primary" onclick="editarPedido('${idOrder}')">Editar</button>
                <button class="btn btn-danger" onclick="eliminarPedido('${idOrder}')">Eliminar</button>
                <button class="btn btn-warning" onclick="desactivarPedido('${idOrder}')">Desactivar</button>
            </td>
        `;
        pedidosTableBody.appendChild(row);
    });
}

// Formatear fecha para mostrarla en la tabla
function formatearFecha(fechaString) {
    if (!fechaString || fechaString === 'N/A') return 'N/A';
    
    try {
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString('es-ES');
    } catch (error) {
        console.error('Error al formatear fecha:', error);
        return fechaString;
    }
}

// Obtener todos los pedidos y renderizarlos en la tabla
async function loadPedidos() {
    const pedidosTableBody = document.getElementById('pedidosTableBody');
    if (!pedidosTableBody) {
        console.error('Elemento pedidosTableBody no encontrado en el DOM.');
        return;
    }

    pedidosTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Cargando...</td></tr>'; // Mensaje de carga

    try {
        const pedidos = await fetchAllOrders();
        renderPedidos(pedidos);
    } catch (error) {
        console.error('Error al cargar los pedidos:', error);
        pedidosTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Error al cargar pedidos</td></tr>';
    }
}

// Cargar opciones de clientes para el select
async function loadClientOptions() {
    try {
        const clients = await fetchAllClients();
        const clientSelect = document.getElementById('client');
        
        if (!clientSelect) {
            console.error('Elemento select de clientes no encontrado');
            return;
        }
        
        // Limpiar opciones existentes excepto la primera vacía
        while (clientSelect.options.length > 1) {
            clientSelect.remove(1);
        }
        
        // Agregar opciones de clientes
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.idClient;
            option.textContent = client.nameClient;
            clientSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar clientes:', error);
    }
}

// Cargar opciones de vendedores para el select
async function loadTraderOptions() {
    try {
        const traders = await fetchAllTraders();
        const sellerSelect = document.getElementById('seller');
        
        if (!sellerSelect) {
            console.error('Elemento select de vendedores no encontrado');
            return;
        }
        
        // Limpiar opciones existentes excepto la primera vacía
        while (sellerSelect.options.length > 1) {
            sellerSelect.remove(1);
        }
        
        // Agregar opciones de vendedores
        traders.forEach(trader => {
            const option = document.createElement('option');
            option.value = trader.idTrader;
            option.textContent = trader.nameTrader;
            sellerSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar vendedores:', error);
    }
}

// Función para agregar un nuevo pedido (muestra el modal vacío)
function addPedido() {
    // Establecer la fecha actual
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    const dateOrderInput = document.getElementById('dateOrder');
    if (dateOrderInput) {
        dateOrderInput.value = formattedDate;
    }
    
    // Limpiar el ID y mostrar el modal
    const pedidoIdInput = document.getElementById('pedidoId');
    if (pedidoIdInput) {
        pedidoIdInput.value = '';
    }
    
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
        modalTitle.textContent = 'Agregar Nuevo Pedido';
    }
    
    // Cargar las opciones de clientes y vendedores
    loadClientOptions();
    loadTraderOptions();
    
    // Mostrar el modal
    const modal = document.getElementById('pedidoModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Función global para editar un pedido (será llamada desde onclick en el botón)
window.editarPedido = async function(idOrder) {
    console.log('Editando pedido con ID:', idOrder);
    
    if (!idOrder || idOrder === 'N/A') {
        alert('ID de pedido inválido');
        return;
    }
    
    try {
        // Obtener el pedido por ID
        const response = await fetch(`${apiUrlOrders}/${idOrder}`);
        if (!response.ok) {
            throw new Error(`Error al obtener el pedido: ${response.status}`);
        }
        
        const pedido = await response.json();
        console.log('Datos del pedido a editar:', pedido);
        
        // Cargar las opciones de clientes y vendedores
        await loadClientOptions();
        await loadTraderOptions();
        
        // Configurar el formulario con los datos del pedido
        const pedidoIdInput = document.getElementById('pedidoId');
        const clientSelect = document.getElementById('client');
        const sellerSelect = document.getElementById('seller');
        const dateOrderInput = document.getElementById('dateOrder');
        const modalTitle = document.getElementById('modalTitle');
        
        if (pedidoIdInput) pedidoIdInput.value = idOrder;
        if (clientSelect) clientSelect.value = pedido.client?.idClient || '';
        if (sellerSelect) sellerSelect.value = pedido.trader?.idTrader || '';
        
        // Formatear la fecha si es necesario
        if (dateOrderInput && pedido.dateOrder) {
            const fechaObj = new Date(pedido.dateOrder);
            const fechaFormateada = fechaObj.toISOString().split('T')[0];
            dateOrderInput.value = fechaFormateada;
        }
        
        // Cambiar el título del modal
        if (modalTitle) modalTitle.textContent = 'Editar Pedido';
        
        // Mostrar el modal
        const modal = document.getElementById('pedidoModal');
        if (modal) modal.style.display = 'block';
    } catch (error) {
        console.error('Error al cargar el pedido para editar:', error);
        alert('No se pudo cargar el pedido para editar. Por favor, inténtalo de nuevo.');
    }
};

// Función global para eliminar un pedido
window.eliminarPedido = async function(idOrder) {
    console.log('Eliminando pedido con ID:', idOrder);
    
    if (!idOrder || idOrder === 'N/A') {
        alert('ID de pedido inválido');
        return;
    }
    
    // Preguntar al usuario si está seguro de eliminar el pedido
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este pedido?');
    if (!confirmDelete) {
        return; // Salir si el usuario cancela
    }

    try {
        const success = await deleteOrder(idOrder);
        if (success) {
            loadPedidos(); // Recargar la tabla
            alert('Pedido eliminado exitosamente');
        }
    } catch (error) {
        console.error('Error al eliminar el pedido:', error);
    }
};

// Función global para desactivar un pedido
window.desactivarPedido = async function(idOrder) {
    console.log('Desactivando pedido con ID:', idOrder);
    
    if (!idOrder || idOrder === 'N/A') {
        alert('ID de pedido inválido');
        return;
    }
    
    const confirmDeactivate = confirm('¿Estás seguro de que deseas desactivar este pedido?');
    if (!confirmDeactivate) {
        return; // Salir si el usuario cancela
    }

    try {
        const success = await deactivateOrder(idOrder);
        if (success) {
            loadPedidos(); // Recargar la tabla
            alert('Pedido desactivado exitosamente');
        }
    } catch (error) {
        console.error('Error al desactivar el pedido:', error);
    }
};

// Inicializar la página cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando página de pedidos...');
    
    // Configurar el formulario de pedidos
    const pedidoForm = document.getElementById('pedidoForm');
    if (pedidoForm) {
        pedidoForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            // Obtener los valores del formulario
            const pedidoId = document.getElementById('pedidoId').value;
            const clientId = document.getElementById('client').value;
            const sellerId = document.getElementById('seller').value;
            const dateOrder = document.getElementById('dateOrder').value;
            
            // Validar campos obligatorios
            if (!clientId || !sellerId || !dateOrder) {
                alert('Por favor, completa todos los campos obligatorios.');
                return;
            }
            
            // Crear el objeto con los datos del pedido
            const pedidoData = {
                client: { idClient: clientId },
                trader: { idTrader: sellerId },
                dateOrder: dateOrder,
                status: 1 // Estado activo
            };
            
            try {
                if (pedidoId) {
                    // Actualizar pedido existente
                    pedidoData.idOrder = pedidoId;
                    await updateOrder(pedidoId, pedidoData);
                    alert('Pedido actualizado exitosamente');
                } else {
                    // Crear nuevo pedido
                    await createOrder(pedidoData);
                    alert('Pedido creado exitosamente');
                }
                
                // Cerrar el modal y actualizar la tabla
                const modal = document.getElementById('pedidoModal');
                if (modal) modal.style.display = 'none';
                
                loadPedidos();
            } catch (error) {
                console.error('Error al guardar el pedido:', error);
            }
        });
    }
    
    // Configurar eventos para los botones
    const addPedidoButton = document.getElementById('addPedidoButton');
    if (addPedidoButton) {
        addPedidoButton.addEventListener('click', addPedido);
    }
    
    const loadPedidosButton = document.getElementById('loadPedidosButton');
    if (loadPedidosButton) {
        loadPedidosButton.addEventListener('click', loadPedidos);
    }
    
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            const modal = document.getElementById('pedidoModal');
            if (modal) modal.style.display = 'none';
        });
    }
    
    const cancelPedidoButton = document.getElementById('cancelPedidoButton');
    if (cancelPedidoButton) {
        cancelPedidoButton.addEventListener('click', function() {
            const modal = document.getElementById('pedidoModal');
            if (modal) modal.style.display = 'none';
        });
    }
    
    // Configurar el formulario de búsqueda
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const searchType = document.getElementById('search-type').value;
            const searchInput = document.getElementById('search-input').value.trim();
            
            if (!searchInput) {
                alert('Por favor, ingresa un término de búsqueda.');
                return;
            }
            
            try {
                let response;
                if (searchType === 'id') {
                    response = await fetch(`${apiUrlOrders}/${searchInput}`);
                    if (response.ok) {
                        const pedido = await response.json();
                        renderPedidos([pedido]);
                    } else {
                        alert('No se encontró ningún pedido con ese ID.');
                    }   
                } else {
                    // Implementar búsqueda por cliente o vendedor si es necesario
                    alert('Búsqueda por ' + searchType + ' no implementada aún.');
                }
            } catch (error) {
                console.error('Error en la búsqueda:', error);
                alert('Error al realizar la búsqueda.');
            }
        });
    }
    
    // Cargar los pedidos al iniciar la página
    loadPedidos();
});