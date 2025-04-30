package com.sena.crud_basic.controller;

import com.sena.crud_basic.DTO.responseDTO;
import com.sena.crud_basic.model.ordersDTO;
import com.sena.crud_basic.service.OrdersService;
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
@RequestMapping("/api/v1/orders")
public class OrdersController {

    @Autowired
    private OrdersService ordersService;

    // Registrar una orden
    @PostMapping("/enviar/")
    public ResponseEntity<responseDTO> registerOrder(@RequestBody ordersDTO order) {
        ordersService.saveOrder(order);
        return new ResponseEntity<>(new responseDTO("OK", "Orden registrada correctamente"), HttpStatus.CREATED);
    }

    // Listar todas las órdenes activas
    @GetMapping("/obtener/")
    public ResponseEntity<List<ordersDTO>> getAllOrders() {
        List<ordersDTO> orders = ordersService.getAllOrders();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    // Listar órdenes con un filtro
    @GetMapping("/search/{filter}")
    public ResponseEntity<List<ordersDTO>> search(@PathVariable String filter) {
        List<ordersDTO> orders = ordersService.getFilteredOrders(filter);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    // Listar una orden por ID
    @GetMapping("/{id}")
    public ResponseEntity<Object> getOrderById(@PathVariable int id) {
        ordersDTO order = ordersService.getOrderById(id);
        if (order != null) {
            return new ResponseEntity<>(order, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new responseDTO("ERROR", "Orden no encontrada"), HttpStatus.NOT_FOUND);
        }
    }

    // Actualizar todos los datos de una orden excepto el ID
    @PutMapping("/update/{id}")
    public ResponseEntity<responseDTO> updateOrder(
            @PathVariable int id,
            @RequestBody ordersDTO updatedOrder) {
        responseDTO response = ordersService.updateOrder(id, updatedOrder);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Eliminar una orden físicamente por ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<responseDTO> deleteOrderById(@PathVariable int id) {
        responseDTO response = ordersService.deleteOrderById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Eliminar una orden lógicamente (cambiar estado a inactivo)
    @DeleteMapping("/{id}")
    public ResponseEntity<responseDTO> deleteOrder(@PathVariable int id) {
        responseDTO response = ordersService.deleteOrder(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}