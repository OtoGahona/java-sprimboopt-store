package com.sena.crud_basic.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity(name = "traders")
public class TradersDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int idTrader;

    @Column(name = "name", nullable = false, length = 100)
    private String nameTrader;

    @Column(name = "status")
    private int status;

    // Constructor vacío (necesario para JPA)
    public TradersDTO() {
    }

    // Constructor completo
    public TradersDTO(int idTrader, String nameTrader, int status) {
        this.idTrader = idTrader;
        this.nameTrader = nameTrader;
        this.status = status;
    }

    // Getters y setters
    public int getIdTrader() {
        return idTrader;
    }

    public void setIdTrader(int idTrader) {
        this.idTrader = idTrader;
    }

    public String getNameTrader() {
        return nameTrader;
    }

    public void setNameTrader(String nameTrader) {
        this.nameTrader = nameTrader;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}