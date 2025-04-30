// URL base de la API
const apiUrlOrderProducts = 'http://localhost:8080/api/v1/orderProducts';

const apiEndpointsOrderProducts = {
    fetchAll: '/obtener/',
    search: '/', 
    filter: '/search/{filter}',
    getById: '/{id}',
    create: '/enviar/',
    update: '/update/',
    delete: '/delete/',
    deactivate: '/'
};

// Elementos del DOM - Los obtenemos cuando el DOM esté cargado
let orderProductForm;
let orderProductModal;
let closeModal;
let modalTitle;
let saveButton;
let cancelButton;
let searchForm;
let searchInput;
let searchType;
let tbody;
let addOrderProductButton;

// Inicializa todos los elementos del DOM
function initializeElements() {
    orderProductForm = document.getElementById('orderProductForm');
    orderProductModal = document.getElementById('orderProductModal');
    closeModal = document.getElementById('closeModal');
    modalTitle = document.getElementById('modalTitle');
    saveButton = document.getElementById('saveButton');
    cancelButton = document.getElementById('cancelOrderProductButton');
    searchForm = document.getElementById('search-form');
    searchInput = document.getElementById('search-input');
    searchType = document.getElementById('search-type');
    tbody = document.getElementById('orderProductsTableBody');
    addOrderProductButton = document.getElementById('addOrderProductButton');

    // Inicializar listeners
    initializeEventListeners();
}

// Configura todos los event listeners
function initializeEventListeners() {
    // Botón para mostrar el modal de creación
    if (addOrderProductButton) {
        addOrderProductButton.addEventListener('click', showCreateForm);
    }

    // Botón para cerrar el modal (X)
    if (closeModal) {
        closeModal.addEventListener('click', hideCreateForm);
    }

    // Botón de cancelar en el modal
    if (cancelButton) {
        cancelButton.addEventListener('click', hideCreateForm);
    }

    // Formulario de búsqueda
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const filter = searchInput.value.trim();
            const type = searchType.value;

            if (!filter) {
                alert('Por favor, ingresa un término de búsqueda.');
                return;
            }

            searchOrderProducts(filter, type);
        });
    }
}

// Obtener todos los detalles de pedidos
async function fetchAllOrderProducts() {
    try {
        const response = await fetch(apiUrlOrderProducts + apiEndpointsOrderProducts.fetchAll);
        const data = await response.json();
        console.log('Detalles de pedidos:', data);
        return data;
    } catch (error) {
        console.error('Error al obtener los detalles de pedidos:', error);
        return [];
    }
}

// Buscar un detalle de pedido por ID y devolver todos los datos
async function searchOrderProduct(id) {
    try {
        const response = await fetch(apiUrlOrderProducts + apiEndpointsOrderProducts.search + id);
        console.log('URL generada para la solicitud:', apiUrlOrderProducts + apiEndpointsOrderProducts.search + id);
        const data = await response.json();
        console.log('Respuesta completa de la API para el ID:', id, data);

        // Verificar si la respuesta es un objeto válido
        if (!data || typeof data !== 'object') {
            alert('No se encontraron datos para el ID proporcionado.');
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error al buscar el detalle de pedido:', error);
        throw error;
    }
}

// Función para buscar detalles de pedidos por filtro (ID o Nombre del Producto)
async function searchOrderProducts(filter, searchType) {
    try {
        let endpoint;

        if (searchType === 'id') {
            // Buscar por ID
            endpoint = apiEndpointsOrderProducts.getById.replace('{id}', filter);
        } else if (searchType === 'product') {
            // Buscar por Nombre del Producto
            endpoint = apiEndpointsOrderProducts.filter.replace('{filter}', encodeURIComponent(filter));
        } else {
            throw new Error('Tipo de búsqueda no válido');
        }

        const response = await fetch(`${apiUrlOrderProducts}${endpoint}`);
        if (!response.ok) {
            throw new Error('Error al buscar detalles de pedidos');
        }

        const orderProducts = searchType === 'id' ? [await response.json()] : await response.json();
        renderOrderProducts(orderProducts);
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo realizar la búsqueda. Inténtalo de nuevo.');
    }
}

// Crear un nuevo detalle de pedido
async function createOrderProduct(orderProduct) {
    try {
        const response = await fetch(apiUrlOrderProducts + apiEndpointsOrderProducts.create, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderProduct)
        });

        const data = await response.json();
        console.log('Respuesta del backend:', data);
        return data;
    } catch (error) {
        console.error('Error al crear el detalle de pedido:', error);
        throw error;
    }
}

// Actualizar un detalle de pedido
async function updateOrderProduct(id, updatedOrderProduct) {
    try {
        const response = await fetch(apiUrlOrderProducts + apiEndpointsOrderProducts.update + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedOrderProduct)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el detalle de pedido');
        }

        const data = await response.json();
        console.log('Respuesta del backend al actualizar:', data);
        return data;
    } catch (error) {
        console.error('Error al actualizar el detalle de pedido:', error);
        throw error;
    }
}

// Eliminar un detalle de pedido físicamente
async function deleteOrderProduct(id) {
    try {
        const response = await fetch(apiUrlOrderProducts + apiEndpointsOrderProducts.delete + id, {
            method: 'DELETE'
        });
        console.log('Detalle de pedido eliminado:', response.status);
        return response.status;
    } catch (error) {
        console.error('Error al eliminar el detalle de pedido:', error);
        throw error;
    }
}

// Desactivar un detalle de pedido (eliminación lógica)
async function deactivateOrderProduct(id) {
    try {
        const response = await fetch(apiUrlOrderProducts + apiEndpointsOrderProducts.deactivate + id, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error al desactivar el detalle de pedido');
        }
        const data = await response.json();
        console.log('Detalle de pedido desactivado:', data);
        return data;
    } catch (error) {
        console.error('Error al desactivar el detalle de pedido:', error);
        throw error;
    }
}

// Función para renderizar los detalles de pedidos en la tabla
function renderOrderProducts(orderProducts) {
    if (!tbody) {
        console.error('Error: No se encontró el elemento tbody');
        return;
    }

    tbody.innerHTML = '';

    orderProducts.forEach(orderProduct => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${orderProduct.idOrderProduct}</td>
            <td>${orderProduct.order.client.nameClient}</td>
            <td>${orderProduct.product.nameProduct}</td>
            <td>${orderProduct.quantity}</td>
            <td>$${orderProduct.price.toFixed(2)}</td>
            <td>$${orderProduct.total.toFixed(2)}</td>
            <td>
                <button class="btn btn-primary" onclick="editOrderProduct(${orderProduct.idOrderProduct})">Editar</button>
                <button class="btn btn-danger" onclick="deleteOrderProductHandler(${orderProduct.idOrderProduct})">Eliminar</button>
                <button class="btn btn-warning" onclick="deactivateOrderProductHandler(${orderProduct.idOrderProduct})">Desactivar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Función para cargar todos los detalles de pedidos en la tabla
async function loadOrderProducts() {
    try {
        const orderProducts = await fetchAllOrderProducts();
        renderOrderProducts(orderProducts);
    } catch (error) {
        console.error('Error al cargar los detalles de pedidos:', error);
        alert('Error al cargar los detalles de pedidos. Por favor, intenta de nuevo más tarde.');
    }
}

// Función para mostrar el modal para crear un nuevo detalle de pedido
function showCreateForm() {
    console.log('Mostrando modal para crear nuevo detalle de pedido');
    
    if (!orderProductForm || !orderProductModal || !modalTitle || !saveButton) {
        console.error('Error: Elementos del modal no encontrados');
        return;
    }
    
    orderProductForm.reset();
    document.getElementById('orderProductId').value = '';
    modalTitle.textContent = 'Agregar Nuevo Detalle de Pedido';
    orderProductModal.style.display = 'block';
    
    // Configurar el botón de guardar para crear un nuevo detalle
    saveButton.textContent = 'Guardar';
    // Asignar función directamente para evitar problemas con onclick
    saveButton.removeEventListener('click', updateOrderProductHandler);
    saveButton.addEventListener('click', createOrderProductHandler);
}

// Función para ocultar el modal
function hideCreateForm() {
    console.log('Ocultando modal');
    
    if (!orderProductModal || !orderProductForm) {
        console.error('Error: Elementos del modal no encontrados');
        return;
    }
    
    orderProductModal.style.display = 'none';
    orderProductForm.reset();
}

// Función para manejar la creación de un nuevo detalle de pedido
async function createOrderProductHandler() {
    const orderId = document.getElementById('order').value;
    const productId = document.getElementById('product').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;

    // Validar campos
    if (!orderId || !productId || !quantity || !price) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const orderProduct = {
        order: {
            idOrders: parseInt(orderId)
        },
        product: {
            idProduct: parseInt(productId)
        },
        quantity: parseInt(quantity),
        price: parseFloat(price),
        total: parseFloat(quantity) * parseFloat(price),
        status: 1
    };

    console.log('Datos enviados al backend:', orderProduct);

    try {
        const newOrderProduct = await createOrderProduct(orderProduct);
        alert('Detalle de pedido creado exitosamente');
        hideCreateForm();
        loadOrderProducts();
    } catch (error) {
        console.error('Error al crear el detalle de pedido:', error);
        alert('Hubo un error al crear el detalle de pedido. Por favor, inténtalo de nuevo.');
    }
}

// Función para manejar la edición de un detalle de pedido
async function editOrderProduct(id) {
    console.log('ID proporcionado para editar:', id);

    if (!id || isNaN(id)) {
        console.error('ID inválido proporcionado para editar:', id);
        alert('El ID proporcionado no es válido.');
        return;
    }

    try {
        const orderProduct = await searchOrderProduct(id);

        if (!orderProduct) {
            alert('No se encontraron datos para el ID proporcionado.');
            return;
        }

        if (!orderProductForm || !orderProductModal || !modalTitle || !saveButton) {
            console.error('Error: Elementos del modal no encontrados');
            return;
        }

        // Llenar el formulario con los datos del detalle de pedido
        document.getElementById('orderProductId').value = id;
        document.getElementById('order').value = orderProduct.order.idOrders;
        document.getElementById('product').value = orderProduct.product.idProduct;
        document.getElementById('quantity').value = orderProduct.quantity;
        document.getElementById('price').value = orderProduct.price;

        // Mostrar el modal
        modalTitle.textContent = 'Editar Detalle de Pedido';
        orderProductModal.style.display = 'block';

        // Configurar el botón de guardar para actualizar
        saveButton.textContent = 'Actualizar';
        // Asignar función directamente para evitar problemas con onclick
        saveButton.removeEventListener('click', createOrderProductHandler);
        saveButton.addEventListener('click', updateOrderProductHandler);
    } catch (error) {
        console.error('Error al cargar los datos del detalle de pedido para editar:', error);
        alert('No se pudieron cargar los datos del detalle de pedido. Por favor, verifica el ID.');
    }
}

// Función para manejar la actualización de un detalle de pedido
async function updateOrderProductHandler() {
    const id = document.getElementById('orderProductId').value;
    const orderId = document.getElementById('order').value;
    const productId = document.getElementById('product').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;

    // Validar campos
    if (!orderId || !productId || !quantity || !price) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const updatedOrderProduct = {
        order: {
            idOrders: parseInt(orderId)
        },
        product: {
            idProduct: parseInt(productId)
        },
        quantity: parseInt(quantity),
        price: parseFloat(price),
        total: parseFloat(quantity) * parseFloat(price),
        status: 1
    };

    try {
        const response = await updateOrderProduct(id, updatedOrderProduct);
        alert(response.message || 'Detalle de pedido actualizado exitosamente');
        hideCreateForm();
        loadOrderProducts();
    } catch (error) {
        console.error('Error al actualizar el detalle de pedido:', error);
        alert('Hubo un error al actualizar el detalle de pedido. Por favor, inténtalo de nuevo.');
    }
}

// Función para manejar la eliminación de un detalle de pedido
async function deleteOrderProductHandler(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este detalle de pedido?')) {
        try {
            await deleteOrderProduct(id);
            alert('Detalle de pedido eliminado exitosamente');
            loadOrderProducts();
        } catch (error) {
            console.error('Error al eliminar el detalle de pedido:', error);
            alert('Error al eliminar el detalle de pedido. Por favor, intenta de nuevo.');
        }
    }
}

// Función para manejar la desactivación de un detalle de pedido
async function deactivateOrderProductHandler(id) {
    if (confirm('¿Estás seguro de que deseas desactivar este detalle de pedido?')) {
        try {
            const response = await deactivateOrderProduct(id);
            alert('Detalle de pedido desactivado exitosamente');
            loadOrderProducts();
        } catch (error) {
            console.error('Error al desactivar el detalle de pedido:', error);
            alert('Hubo un error al desactivar el detalle de pedido. Por favor, inténtalo de nuevo.');
        }
    }
}

// Inicializar la página cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando elementos...');
    initializeElements();
    loadOrderProducts();
});