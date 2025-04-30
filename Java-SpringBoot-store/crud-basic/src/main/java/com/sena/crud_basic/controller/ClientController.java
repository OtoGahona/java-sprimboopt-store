package com.sena.crud_basic.controller;

import com.sena.crud_basic.DTO.responseDTO;
import com.sena.crud_basic.model.clientDTO;
import com.sena.crud_basic.service.ClientService;
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
@RequestMapping("/api/v1/clients")
public class ClientController {

    @Autowired
    private ClientService clientService;

    // Registrar un cliente
    @PostMapping("/enviar/")
    public ResponseEntity<responseDTO> registerClient(@RequestBody clientDTO client) {
        clientService.saveClient(client);
        return new ResponseEntity<>(new responseDTO("OK", "Cliente registrado correctamente"), HttpStatus.CREATED);
    }

    // Listar todos los valores activos
    @GetMapping("/obtener/")
    public ResponseEntity<List<clientDTO>> getAllClients() {
        List<clientDTO> clients = clientService.getAllClients();
        return new ResponseEntity<>(clients, HttpStatus.OK);
    }

    // Listar con un filtro
    @GetMapping("/search/{filter}")
    public ResponseEntity<List<clientDTO>> search(@PathVariable String filter) {
        List<clientDTO> clients = clientService.getFilteredClients(filter);
        return new ResponseEntity<>(clients, HttpStatus.OK);
    }

    // Listar por ID
    @GetMapping("/{id}")
    public ResponseEntity<Object> getClientById(@PathVariable int id) {
        clientDTO client = clientService.getClientById(id);
        if (client != null) {
            return new ResponseEntity<>(client, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new responseDTO("ERROR", "Cliente no encontrado"), HttpStatus.NOT_FOUND);
        }
    }

    // Eliminar registro por ID (físico)
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<responseDTO> deleteClientById(@PathVariable int id) {
        responseDTO response = clientService.deleteClientById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Actualizar todos los datos excepto el ID
    @PutMapping("/update/{id}")
    public ResponseEntity<responseDTO> updateClient(
            @PathVariable int id,
            @RequestBody clientDTO client) {
        responseDTO response = clientService.updateClient(
                id,
                client.getNameClient(),
                client.getPhoneClient(),
                client.getStatus());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Eliminar lógicamente
    @DeleteMapping("/{id}")
    public ResponseEntity<responseDTO> deleteClient(@PathVariable int id) {
        responseDTO response = clientService.delete(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}