package com.sena.crud_basic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import com.sena.crud_basic.model.productsDTO;
import java.util.List;

public interface IProductsRepository extends JpaRepository<productsDTO, Integer> {

    // Listar todos los valores activos
    @Query("SELECT b FROM products b WHERE b.status=1")
    List<productsDTO> findAllProductsActive();

    // Listar con un filtro
    @Query("SELECT b FROM products b WHERE b.nameProduct LIKE %?1% OR CAST(b.priceProduct AS string) LIKE %?1%")
    List<productsDTO> search(String filter);

    // Actualizar todos los campos excepto el ID
    @Transactional
    @Modifying
    @Query("UPDATE products b SET b.nameProduct = ?2, b.priceProduct = ?3, b.status = ?4 WHERE b.idProduct = ?1")
    int updateProductById(Integer id, String nameProduct, double priceProduct, Integer status);

    // Eliminar por ID (físico)
    @Transactional
    @Modifying
    @Query("DELETE FROM products b WHERE b.idProduct = ?1")
    void deleteById(Integer id);
}