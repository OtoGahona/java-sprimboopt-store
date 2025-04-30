package com.sena.crud_basic.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.sena.crud_basic.repository.IProductsRepository;
import com.sena.crud_basic.model.productsDTO;
import com.sena.crud_basic.DTO.responseDTO;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private IProductsRepository productsRepository;

    // Listar todos los valores activos
    public List<productsDTO> getAllProducts() {
        return productsRepository.findAllProductsActive();
    }

    // Listar con un filtro
    public List<productsDTO> getFilteredProducts(String filter) {
        return productsRepository.search(filter);
    }

    // Listar por ID
    public productsDTO getProductById(int id) {
        return productsRepository.findById(id).orElse(null); // Manejo de null si no se encuentra
    }

    // Guardar o actualizar un producto
    public productsDTO saveProduct(productsDTO product) {
        return productsRepository.save(product);
    }

    // Actualizar todos los datos excepto el ID
    public responseDTO updateProduct(int id, productsDTO updatedProduct) {
        productsDTO existingProduct = getProductById(id);
        if (existingProduct != null) {
            existingProduct.setNameProduct(updatedProduct.getNameProduct());
            existingProduct.setPriceProduct(updatedProduct.getPriceProduct());
            existingProduct.setStatus(updatedProduct.getStatus());
            productsRepository.save(existingProduct);
            return new responseDTO("OK", "Producto actualizado correctamente");
        } else {
            return new responseDTO("ERROR", "Producto no encontrado");
        }
    }

    // Eliminar registro por ID (físico)
    public responseDTO deleteProductById(int id) {
        try {
            productsRepository.deleteById(id);
            return new responseDTO("OK", "Producto eliminado correctamente");
        } catch (Exception e) {
            return new responseDTO("ERROR", "Error al eliminar el producto: " + e.getMessage());
        }
    }

    // Eliminar lógicamente
    public responseDTO deleteProduct(int id) {
        productsDTO product = getProductById(id);
        if (product != null) {
            product.setStatus(0); // Cambia el estado a 0 (inactivo)
            productsRepository.save(product); // Usa la instancia inyectada para guardar los cambios
            return new responseDTO("OK", "Producto eliminado correctamente");
        } else {
            return new responseDTO("ERROR", "Producto no encontrado");
        }
    }
}