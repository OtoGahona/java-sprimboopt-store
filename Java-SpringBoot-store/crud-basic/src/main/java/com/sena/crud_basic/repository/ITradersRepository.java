package com.sena.crud_basic.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import com.sena.crud_basic.model.TradersDTO;

public interface ITradersRepository extends JpaRepository<TradersDTO, Integer> {

    // Listar todos los valores activos
    @Query("SELECT b FROM traders b WHERE b.status=1")
    List<TradersDTO> findAllTradersActive();

    // Listar con un filtro
    @Query("SELECT b FROM traders b WHERE b.nameTrader LIKE %?1%")
    List<TradersDTO> search(String filter);

    // Actualizar todos los campos excepto el ID
    @Transactional
    @Modifying
    @Query("UPDATE traders b SET b.nameTrader = ?2, b.status = ?3 WHERE b.idTrader = ?1")
    int updateTraderById(Integer id, String nameTrader, Integer status);

    // Eliminar por ID (físico)
    @Transactional
    @Modifying
    @Query("DELETE FROM traders b WHERE b.idTrader = ?1")
    void deleteById(Integer id);
}