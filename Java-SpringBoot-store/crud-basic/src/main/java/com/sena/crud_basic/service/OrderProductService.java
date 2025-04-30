package com.sena.crud_basic.service;

import com.sena.crud_basic.model.OrderProductDTO;
import com.sena.crud_basic.repository.IOrderProductRepositoy;
import com.sena.crud_basic.DTO.responseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderProductService {

    @Autowired
    private IOrderProductRepositoy orderProductRepositoy;

    // Listar todos los valores activos
    public List<OrderProductDTO> getAllOrderProducts() {
        return orderProductRepositoy.findAllOrderProductActive();
    }

    // Listar con un filtro
    public List<OrderProductDTO> getFilteredOrderProducts(String filter) {
        return orderProductRepositoy.search(filter);
    }

    // Listar por ID
    public OrderProductDTO getOrderProductById(int id) {
        return orderProductRepositoy.findById(id).orElse(null); // Manejo de null si no se encuentra
    }

    // Guardar o actualizar una relación
    public OrderProductDTO saveOrderProduct(OrderProductDTO orderProduct) {
        return orderProductRepositoy.save(orderProduct);
    }

    // Actualizar todos los datos excepto el ID
    public responseDTO updateOrderProduct(int id, OrderProductDTO updatedOrderProduct) {
        OrderProductDTO existingOrderProduct = getOrderProductById(id);
        if (existingOrderProduct != null) {
            existingOrderProduct.setOrder(updatedOrderProduct.getOrder());
            existingOrderProduct.setProduct(updatedOrderProduct.getProduct());
            existingOrderProduct.setStatus(updatedOrderProduct.getStatus());
            existingOrderProduct.setQuantity(updatedOrderProduct.getQuantity());
            existingOrderProduct.setPrice(updatedOrderProduct.getPrice());
            existingOrderProduct.setTotal(updatedOrderProduct.getTotal());
            orderProductRepositoy.save(existingOrderProduct);
            return new responseDTO("OK", "Relación orden-producto actualizada correctamente");
        } else {
            return new responseDTO("ERROR", "Relación orden-producto no encontrada");
        }
    }

    // Eliminar registro por ID (físico)
    public responseDTO deleteOrderProductById(int id) {
        try {
            orderProductRepositoy.deleteById(id);
            return new responseDTO("OK", "Relación orden-producto eliminada correctamente");
        } catch (Exception e) {
            return new responseDTO("ERROR", "Error al eliminar la relación orden-producto: " + e.getMessage());
        }
    }

    // Eliminar lógicamente
    public responseDTO deleteOrderProduct(int id) {
        OrderProductDTO orderProduct = getOrderProductById(id);
        if (orderProduct != null) {
            orderProduct.setStatus(0); // Cambia el estado a 0 (inactivo)
            orderProductRepositoy.save(orderProduct); // Usa la instancia inyectada para guardar los cambios
            return new responseDTO("OK", "Relación orden-producto eliminada correctamente");
        } else {
            return new responseDTO("ERROR", "Relación orden-producto no encontrada");
        }
    }
}