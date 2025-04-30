package com.sena.crud_basic.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import com.sena.crud_basic.model.ordersDTO;

public interface IOrdersRepository extends JpaRepository<ordersDTO, Integer> {

        // Listar todos los valores activos
        @Query("SELECT b FROM orders b WHERE b.status=1")
        List<ordersDTO> findAllOrdersActive();

        // Listar con un filtro y un JOIN para client y seller
        @Query("SELECT o FROM orders o " +
                        "JOIN o.client c " +
                        "JOIN o.trader s " +
                        "WHERE c.nameClient LIKE %?1% OR s.nameTrader LIKE %?1%")
        List<ordersDTO> search(String filter);

        // Actualizar todos los campos excepto el ID
        @Transactional
        @Modifying
        @Query("UPDATE orders o SET o.client = ?2, o.trader = ?3, o.dateOrder = ?4, o.status = ?5 WHERE o.idOrders = ?1")
        int updateOrderById(Integer id, com.sena.crud_basic.model.clientDTO client,
                        com.sena.crud_basic.model.TradersDTO trader, java.time.LocalDate dateOrder, Integer status);

        // Eliminar por ID (físico)
        @Transactional
        @Modifying
        @Query("DELETE FROM orders o WHERE o.idOrders = ?1")
        void deleteById(Integer id);
}