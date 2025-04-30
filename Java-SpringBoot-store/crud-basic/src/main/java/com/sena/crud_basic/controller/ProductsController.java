package com.sena.crud_basic.controller;

import com.sena.crud_basic.DTO.responseDTO;
import com.sena.crud_basic.model.productsDTO;
import com.sena.crud_basic.service.ProductService;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class ProductsController {

    @Autowired
    private ProductService productService;

    // Registrar un producto
    @PostMapping("/enviar/")
    public ResponseEntity<responseDTO> registerProduct(@RequestBody productsDTO product) {
        productService.saveProduct(product);
        return new ResponseEntity<>(new responseDTO("OK", "Producto registrado correctamente"), HttpStatus.CREATED);
    }

    // Listar todos los valores activos
    @GetMapping("/obtener/")
    public ResponseEntity<List<productsDTO>> getAllProducts() {
        List<productsDTO> products = productService.getAllProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // Listar con un filtro
    @GetMapping("/search/{filter}")
    public ResponseEntity<List<productsDTO>> search(@PathVariable String filter) {
        List<productsDTO> products = productService.getFilteredProducts(filter);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // Listar por ID
    @GetMapping("/{id}")
    public ResponseEntity<Object> getProductById(@PathVariable int id) {
        productsDTO product = productService.getProductById(id);
        if (product != null) {
            return new ResponseEntity<>(product, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new responseDTO("ERROR", "Producto no encontrado"), HttpStatus.NOT_FOUND);
        }
    }

    // Actualizar todos los datos excepto el ID
    @PutMapping("/update/{id}")
    public ResponseEntity<responseDTO> updateProduct(
            @PathVariable int id,
            @RequestBody productsDTO updatedProduct) {
        responseDTO response = productService.updateProduct(id, updatedProduct);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Eliminar un producto físicamente por ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<responseDTO> deleteProductById(@PathVariable int id) {
        responseDTO response = productService.deleteProductById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Eliminar un producto lógicamente (cambiar estado a inactivo)
    @DeleteMapping("/{id}")
    public ResponseEntity<responseDTO> deleteProduct(@PathVariable int id) {
        responseDTO response = productService.deleteProduct(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}