package com.sena.crud_basic.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.sena.crud_basic.repository.ITradersRepository;
import com.sena.crud_basic.model.TradersDTO;
import com.sena.crud_basic.DTO.responseDTO;
import java.util.List;

@Service
public class TradersService {

    @Autowired
    private ITradersRepository tradersRepository;

    // Listar todos los valores activos
    public List<TradersDTO> getAllTraders() {
        return tradersRepository.findAllTradersActive();
    }

    // Listar con un filtro
    public List<TradersDTO> getFilteredTraders(String filter) {
        return tradersRepository.search(filter);
    }

    // Listar por ID
    public TradersDTO getTraderById(int id) {
        return tradersRepository.findById(id).orElse(null); // Manejo de null si no se encuentra
    }

    // Guardar o actualizar un vendedor
    public TradersDTO saveTrader(TradersDTO trader) {
        return tradersRepository.save(trader);
    }

    // Actualizar todos los datos excepto el ID
    public responseDTO updateTrader(int id, TradersDTO updatedTrader) {
        TradersDTO existingTrader = getTraderById(id);
        if (existingTrader != null) {
            existingTrader.setNameTrader(updatedTrader.getNameTrader());
            existingTrader.setStatus(updatedTrader.getStatus());
            tradersRepository.save(existingTrader);
            return new responseDTO("OK", "Vendedor actualizado correctamente");
        } else {
            return new responseDTO("ERROR", "Vendedor no encontrado");
        }
    }

    // Eliminar registro por ID (físico)
    public responseDTO deleteTraderById(int id) {
        try {
            tradersRepository.deleteById(id);
            return new responseDTO("OK", "Vendedor eliminado correctamente");
        } catch (Exception e) {
            return new responseDTO("ERROR", "Error al eliminar el vendedor: " + e.getMessage());
        }
    }

    // Eliminar lógicamente
    public responseDTO deleteTrader(int id) {
        TradersDTO trader = getTraderById(id);
        if (trader != null) {
            trader.setStatus(0); // Cambia el estado a 0 (inactivo)
            tradersRepository.save(trader); // Usa la instancia inyectada para guardar los cambios
            return new responseDTO("OK", "Vendedor eliminado correctamente");
        } else {
            return new responseDTO("ERROR", "Vendedor no encontrado");
        }
    }
}