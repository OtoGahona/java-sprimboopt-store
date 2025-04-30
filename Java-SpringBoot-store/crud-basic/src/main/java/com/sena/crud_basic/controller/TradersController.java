package com.sena.crud_basic.controller;

import com.sena.crud_basic.DTO.responseDTO;
import com.sena.crud_basic.model.TradersDTO;
import com.sena.crud_basic.service.TradersService;
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
@RequestMapping("/api/v1/traders")
public class TradersController {

    @Autowired
    private TradersService tradersService;

    // Registrar un vendedor
    @PostMapping("/enviar/")
    public ResponseEntity<responseDTO> registerTrader(@RequestBody TradersDTO trader) {
        tradersService.saveTrader(trader);
        return new ResponseEntity<>(new responseDTO("OK", "Vendedor registrado correctamente"), HttpStatus.CREATED);
    }

    // Listar todos los valores activos
    @GetMapping("/obtener/")
    public ResponseEntity<List<TradersDTO>> getAllTraders() {
        List<TradersDTO> sellers = tradersService.getAllTraders();
        return new ResponseEntity<>(sellers, HttpStatus.OK);
    }

    // Listar con un filtro
    @GetMapping("/search/{filter}")
    public ResponseEntity<List<TradersDTO>> search(@PathVariable String filter) {
        List<TradersDTO> sellers = tradersService.getFilteredTraders(filter);
        return new ResponseEntity<>(sellers, HttpStatus.OK);
    }

    // Listar por ID
    @GetMapping("/{id}")
    public ResponseEntity<Object> getTraderById(@PathVariable int id) {
        TradersDTO trader = tradersService.getTraderById(id);
        if (trader != null) {
            return new ResponseEntity<>(trader, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new responseDTO("ERROR", "Vendedor no encontrado"), HttpStatus.NOT_FOUND);
        }
    }

    // Actualizar todos los datos excepto el ID
    @PutMapping("/update/{id}")
    public ResponseEntity<responseDTO> updateTrader(
            @PathVariable int id,
            @RequestBody TradersDTO updatedTrader) {
        responseDTO response = tradersService.updateTrader(id, updatedTrader);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Eliminar un vendedor físicamente por ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<responseDTO> deleteSellerById(@PathVariable int id) {
        responseDTO response = tradersService.deleteTraderById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Eliminar un vendedor lógicamente (cambiar estado a inactivo)
    @DeleteMapping("/{id}")
    public ResponseEntity<responseDTO> deleteTrader(@PathVariable int id) {
        responseDTO response = tradersService.deleteTrader(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}