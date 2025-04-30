package com.sena.crud_basic.controller;

import com.sena.crud_basic.DTO.responseDTO;
import com.sena.crud_basic.model.OrderProductDTO;
import com.sena.crud_basic.service.OrderProductService;
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
@RequestMapping("/api/v1/orderProducts")
public class OrderProductController {

    @Autowired
    private OrderProductService orderProductService;

    // Registrar una relación orden-producto
    @PostMapping("/enviar/")
    public ResponseEntity<responseDTO> registerOrderProduct(@RequestBody OrderProductDTO orderProduct) {
        orderProductService.saveOrderProduct(orderProduct);
        return new ResponseEntity<>(new responseDTO("OK", "Relación orden-producto registrada correctamente"), HttpStatus.CREATED);
    }

    // Listar todas las relaciones activas
    @GetMapping("/obtener/")
    public ResponseEntity<List<OrderProductDTO>> getAllOrderProducts() {
        List<OrderProductDTO> orderProducts = orderProductService.getAllOrderProducts();
        return new ResponseEntity<>(orderProducts, HttpStatus.OK);
    }

    // Listar con un filtro
    @GetMapping("/search/{filter}")
    public ResponseEntity<List<OrderProductDTO>> search(@PathVariable String filter) {
        List<OrderProductDTO> orderProducts = orderProductService.getFilteredOrderProducts(filter);
        return new ResponseEntity<>(orderProducts, HttpStatus.OK);
    }

    // Listar por ID
    @GetMapping("/{id}")
    public ResponseEntity<Object> getOrderProductById(@PathVariable int id) {
        OrderProductDTO orderProduct = orderProductService.getOrderProductById(id);
        if (orderProduct != null) {
            return new ResponseEntity<>(orderProduct, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new responseDTO("ERROR", "Relación orden-producto no encontrada"), HttpStatus.NOT_FOUND);
        }
    }

    // Actualizar todos los datos excepto el ID
    @PutMapping("/update/{id}")
    public ResponseEntity<responseDTO> updateOrderProduct(
            @PathVariable int id,
            @RequestBody OrderProductDTO updatedOrderProduct) {
        responseDTO response = orderProductService.updateOrderProduct(id, updatedOrderProduct);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Eliminar una relación físicamente por ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<responseDTO> deleteOrderProductById(@PathVariable int id) {
        responseDTO response = orderProductService.deleteOrderProductById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Eliminar una relación lógicamente (cambiar estado a inactivo)
    @DeleteMapping("/{id}")
    public ResponseEntity<responseDTO> deleteOrderProduct(@PathVariable int id) {
        responseDTO response = orderProductService.deleteOrderProduct(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}