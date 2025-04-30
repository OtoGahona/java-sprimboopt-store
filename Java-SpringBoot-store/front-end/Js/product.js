const apiUrlProducts = 'http://localhost:8080/api/v1/products';

const apiEndpointsProducts = {
    fetchAll: '/obtener/',
    create: '/enviar/',
    filter: '/search/{filter}',
    getById: '/{id}',
    update: '/update/{id}',
    delete: '/delete/{id}', // Eliminación física
    deactivate: '/{id}' // Eliminación lógica
};

// Función para listar todos los productos
async function fetchProducts() {
    try {
        const response = await fetch(`${apiUrlProducts}${apiEndpointsProducts.fetchAll}`);
        if (!response.ok) {
            if (response.status === 400) {
                throw new Error('Solicitud inválida. Verifica los datos enviados.');
            } else if (response.status === 404) {
                throw new Error('Producto no encontrado.');
            } else {
                throw new Error('Ocurrió un error inesperado.');
            }
        }
        const products = await response.json();
        console.log('Productos obtenidos:', products); // Depuración
        renderProducts(products);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para registrar un nuevo producto
async function createProduct(productData) {
    try {
        // Agregar el estado activo por defecto
        productData.status = 1;

        console.log('Llamando a createProduct con datos:', productData); // Depuración
        const response = await fetch(`${apiUrlProducts}${apiEndpointsProducts.create}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });

        if (!response.ok) {
            if (response.status === 400) {
                throw new Error('Solicitud inválida. Verifica los datos enviados.');
            } else if (response.status === 404) {
                throw new Error('Producto no encontrado.');
            } else {
                throw new Error('Ocurrió un error inesperado.');
            }
        }

        alert('Producto registrado exitosamente');
        await fetchProducts(); // Actualizar la lista de productos
        toggleForm(); // Ocultar el formulario
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo registrar el producto. Por favor, inténtalo de nuevo.');
    }
}

// Función para actualizar un producto
async function updateProduct(productData) {
    try {
        const endpoint = apiEndpointsProducts.update.replace('{id}', productData.idProduct);

        // Asegurarse de que el estado del producto se mantenga activo si no se especifica
        if (!productData.status) {
            productData.status = 1; // Estado activo por defecto
        }

        const response = await fetch(`${apiUrlProducts}${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });

        if (!response.ok) {
            if (response.status === 400) {
                throw new Error('Solicitud inválida. Verifica los datos enviados.');
            } else if (response.status === 404) {
                throw new Error('Producto no encontrado.');
            } else {
                throw new Error('Ocurrió un error inesperado.');
            }
        }

        alert('Producto actualizado exitosamente');
        fetchProducts(); // Actualizar la lista de productos
        toggleForm(); // Ocultar el formulario
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo actualizar el producto.');
    }
}

// Función para eliminar un producto físicamente
async function deleteProduct(productId) {
    if (!productId || isNaN(productId)) {
        alert('ID de producto inválido.');
        return;
    }

    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este producto de forma permanente?');
    if (!confirmDelete) {
        return;
    }

    try {
        const endpoint = apiEndpointsProducts.delete.replace('{id}', productId);

        const response = await fetch(`${apiUrlProducts}${endpoint}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            if (response.status === 400) {
                throw new Error('Solicitud inválida. Verifica los datos enviados.');
            } else if (response.status === 404) {
                throw new Error('Producto no encontrado.');
            } else {
                throw new Error('Ocurrió un error inesperado.');
            }
        }

        alert('Producto eliminado exitosamente');
        fetchProducts();
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo eliminar el producto.');
    }
}

// Función para desactivar un producto (eliminación lógica)
async function deactivateProduct(productId) {
    const button = document.querySelector(`button[onclick="deactivateProduct(${productId})"]`);
    if (button) button.disabled = true;

    try {
        const confirmDeactivate = confirm('¿Estás seguro de que deseas desactivar este producto?');
        if (!confirmDeactivate) {
            if (button) button.disabled = false;
            return;
        }

        const endpoint = apiEndpointsProducts.deactivate.replace('{id}', productId);
        const response = await fetch(`${apiUrlProducts}${endpoint}`, { method: 'DELETE' });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error al desactivar el producto: ${errorMessage}`);
        }

        alert('Producto desactivado exitosamente');
        fetchProducts();
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo desactivar el producto.');
    } finally {
        if (button) button.disabled = false;
    }
}

// Función para buscar productos por filtro (ID, Nombre o Precio)
async function searchProducts(filter, searchType) {
    try {
        let endpoint;

        if (searchType === 'id') {
            // Buscar por ID
            endpoint = apiEndpointsProducts.getById.replace('{id}', filter);
        } else if (searchType === 'name' || searchType === 'price') {
            // Buscar por Nombre o Precio
            endpoint = apiEndpointsProducts.filter.replace('{filter}', encodeURIComponent(filter));
        } else {
            throw new Error('Tipo de búsqueda no válido');
        }

        const response = await fetch(`${apiUrlProducts}${endpoint}`);
        if (!response.ok) {
            throw new Error('Error al buscar productos');
        }

        const products = searchType === 'id' ? [await response.json()] : await response.json();
        renderProducts(products); // Renderizar los productos encontrados
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo realizar la búsqueda. Inténtalo de nuevo.');
    }
}

// Función para renderizar los productos en la tabla
function renderProducts(products) {
    const productList = document.getElementById('product-list');
    if (!productList) {
        console.error('No se encontró el elemento con ID "product-list"');
        return;
    }
    
    productList.innerHTML = ''; // Limpiar contenido previo

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.idProduct}</td>
            <td>${product.nameProduct}</td>
            <td>$${parseFloat(product.priceProduct).toFixed(2)}</td>
            <td>
                <button class="btn btn-primary" onclick="fetchProductById(${product.idProduct})">Editar</button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.idProduct})">Eliminar</button>
                <button class="btn btn-warning" onclick="deactivateProduct(${product.idProduct})">Desactivar</button>
            </td>
        `;
        productList.appendChild(row);
    });
}

// Función para obtener un producto por ID y cargarlo en el formulario
async function fetchProductById(productId) {
    try {
        const endpoint = apiEndpointsProducts.getById.replace('{id}', productId);
        const response = await fetch(`${apiUrlProducts}${endpoint}`);
        if (!response.ok) {
            if (response.status === 400) {
                throw new Error('Solicitud inválida. Verifica los datos enviados.');
            } else if (response.status === 404) {
                throw new Error('Producto no encontrado.');
            } else {
                throw new Error('Ocurrió un error inesperado.');
            }
        }
        const product = await response.json();

        // Cargar los datos en el formulario
        document.getElementById('product-id').value = product.idProduct;
        document.getElementById('name').value = product.nameProduct;
        document.getElementById('price').value = product.priceProduct;

        // Mostrar el formulario
        toggleForm();
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo cargar el producto para edición.');
    }
}

// Validar campos del formulario
async function validateForm(name, price, currentProductId = null) {
    if (!name.trim()) {
        alert('El nombre del producto no puede estar vacío.');
        return false;
    }
    if (isNaN(price) || parseFloat(price) <= 0) {
        alert('El precio debe ser un número positivo.');
        return false;
    }
    
    try {
        if (await isProductNameDuplicate(name, currentProductId)) {
            alert('El nombre del producto ya existe. Usa otro nombre.');
            return false;
        }
    } catch (error) {
        console.error('Error al verificar duplicados:', error);
        // Continuar a pesar del error en la verificación de duplicados
    }
    
    return true;
}

// Verificar si el nombre del producto ya existe
async function isProductNameDuplicate(name, currentProductId = null) {
    try {
        const response = await fetch(`${apiUrlProducts}${apiEndpointsProducts.fetchAll}`);
        if (!response.ok) return false; // Si hay error, permitir continuar
        
        const products = await response.json();

        // Verificar si el nombre ya existe en otro producto
        return products.some(product => 
            product.nameProduct.toLowerCase() === name.toLowerCase() && 
            product.idProduct !== (currentProductId ? parseInt(currentProductId) : null)
        );
    } catch (error) {
        console.error('Error al verificar duplicados:', error);
        return false; // En caso de error, permitir continuar
    }
}

// Mostrar/ocultar el formulario
function toggleForm() {
    const modal = document.getElementById('add-product-modal');
    if (!modal) {
        console.error('No se encontró el elemento con ID "add-product-modal"');
        return;
    }
    
    modal.style.display = modal.style.display === 'none' || modal.style.display === '' ? 'flex' : 'none';
}

// Asociar el botón "Agregar Producto" con el formulario
document.addEventListener('DOMContentLoaded', function() {
    const addProductBtn = document.getElementById('add-product');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            // Limpiar el formulario
            const form = document.getElementById('product-form');
            if (form) form.reset();
            
            // Limpiar campos específicos
            const idField = document.getElementById('product-id');
            if (idField) idField.value = '';
            
            toggleForm(); // Mostrar el formulario
        });
    }

    // Cargar la lista de productos
    fetchProducts();

    // Configurar el formulario de búsqueda
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const searchType = document.getElementById('search-type');
            const searchInput = document.getElementById('search-input');
            
            if (searchType && searchInput) {
                const filter = searchInput.value.trim();
                
                if (!filter) {
                    alert('Por favor, ingresa un término de búsqueda.');
                    return;
                }
                
                searchProducts(filter, searchType.value);
            }
        });
    }

    // Configurar el formulario de producto
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const productId = document.getElementById('product-id').value;
            const name = document.getElementById('name').value;
            const price = document.getElementById('price').value;
            
            if (!await validateForm(name, price, productId || null)) {
                return;
            }
            
            const productData = {
                nameProduct: name,
                priceProduct: parseFloat(price),
            };
            
            if (productId) {
                productData.idProduct = productId;
                updateProduct(productData);
            } else {
                createProduct(productData);
            }
        });
    }
});

// Cerrar el modal al hacer clic fuera de él
window.addEventListener('click', function(event) {
    const modal = document.getElementById('add-product-modal');
    if (modal && event.target === modal) {
        modal.style.display = 'none';
    }
});