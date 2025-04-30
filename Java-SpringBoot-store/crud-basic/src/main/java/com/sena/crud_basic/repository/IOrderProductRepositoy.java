package com.sena.crud_basic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import com.sena.crud_basic.model.OrderProductDTO;
import java.util.List;

public interface IOrderProductRepositoy extends JpaRepository<OrderProductDTO, Integer> {

    // Listar todos los valores activos
    @Query("SELECT b FROM order_products b WHERE b.status=1")
    List<OrderProductDTO> findAllOrderProductActive();

    // Listar con un filtro
    @Query("SELECT op FROM order_products op JOIN op.product p WHERE p.nameProduct LIKE %?1%")
    List<OrderProductDTO> search(String filter);

    // Actualizar todos los campos excepto el ID
    @Transactional
    @Modifying
    @Query("UPDATE order_products op SET op.order = ?2, op.product = ?3, op.status = ?4, op.quantity = ?5, op.price = ?6, op.total = ?7 WHERE op.idOrderProduct = ?1")
    int updateOrderProductById(Integer id, com.sena.crud_basic.model.ordersDTO order,
            com.sena.crud_basic.model.productsDTO product, Integer status, int quantity, double price, double total);

    // Eliminar por ID (físico)
    @Transactional
    @Modifying
    @Query("DELETE FROM order_products op WHERE op.idOrderProduct = ?1")
    void deleteById(Integer id);
}