package com.sena.crud_basic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import com.sena.crud_basic.model.clientDTO;
import java.util.List;

public interface IClientRepository extends JpaRepository<clientDTO, Integer> {

    // Listar todos los valores activos
    @Query("SELECT b FROM client b WHERE b.status=1")
    List<clientDTO> findAllClientActive();

    // Listar con un filtro
    @Query("SELECT b FROM client b WHERE b.nameClient LIKE %?1% OR b.phoneClient LIKE %?1%")
    List<clientDTO> search(String filter);

    // Actualizar todos los campos excepto el ID
    @Transactional
    @Modifying
    @Query("UPDATE client b SET b.nameClient = ?2, b.phoneClient = ?3, b.status = ?4 WHERE b.idClient = ?1")
    int updateClientById(Integer id, String nameClient, String phoneClient, Integer status);

    // Eliminar por ID
    @Transactional
    @Modifying
    @Query("DELETE FROM client b WHERE b.idClient = ?1")
    void deleteById(Integer id);
}