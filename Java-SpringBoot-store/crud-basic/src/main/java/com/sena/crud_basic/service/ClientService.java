package com.sena.crud_basic.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.sena.crud_basic.repository.IClientRepository;
import com.sena.crud_basic.model.clientDTO;
import com.sena.crud_basic.DTO.responseDTO;
import java.util.List;

@Service
public class ClientService {

    @Autowired
    private IClientRepository clientRepository;

    // Listar todos los valores activos
    public List<clientDTO> getAllClients() {
        return clientRepository.findAllClientActive();
    }

    // Listar con un filtro
    public List<clientDTO> getFilteredClients(String filter) {
        return clientRepository.search(filter);
    }

    // Listar por ID
    public clientDTO getClientById(int id) {
        return clientRepository.findById(id).orElse(null); // Manejo de null si no se encuentra
    }

    // Guardar o actualizar un cliente
    public clientDTO saveClient(clientDTO client) {
        return clientRepository.save(client);
    }

    // Actualizar todos los datos excepto el ID
    public responseDTO updateClient(int id, String nameClient, String phoneClient, Integer status) {
        int rowsUpdated = clientRepository.updateClientById(id, nameClient, phoneClient, status);
        if (rowsUpdated > 0) {
            return new responseDTO("OK", "Cliente actualizado correctamente");
        } else {
            return new responseDTO("ERROR", "Cliente no encontrado o no se pudo actualizar");
        }
    }

    // Eliminar registro por ID
    public responseDTO deleteClientById(int id) {
        try {
            clientRepository.deleteById(id);
            return new responseDTO("OK", "Cliente eliminado correctamente");
        } catch (Exception e) {
            return new responseDTO("ERROR", "Error al eliminar el cliente: " + e.getMessage());
        }
    }

    // Eliminar lógicamente
    public responseDTO delete(int id) {
        clientDTO client = getClientById(id);
        if (client != null) {
            client.setStatus(0); // Cambia el estado a 0 (inactivo)
            clientRepository.save(client); // Usa la instancia inyectada para guardar los cambios
            return new responseDTO("OK", "Se eliminó correctamente");
        } else {
            return new responseDTO("ERROR", "Cliente no encontrado");
        }
    }
}