package com.sena.crud_basic.model;

import java.time.LocalDate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity(name = "orders")
public class ordersDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int idOrders;

    @ManyToOne
    @JoinColumn(name = "idClient")
    private clientDTO client;

    @ManyToOne
    @JoinColumn(name = "idTrader")
    private TradersDTO trader;

    @Column(name = "date")
    private LocalDate dateOrder;

    @Column(name = "status")
    private int status;

    // Constructor vacío (necesario para JPA)
    public ordersDTO() {
    }

    // Constructor completo
    public ordersDTO(int idOrders, clientDTO client, TradersDTO trader, LocalDate dateOrder, int status) {
        this.idOrders = idOrders;
        this.client = client;
        this.trader = trader;
        this.dateOrder = dateOrder;
        this.status = status;
    }

    // Getters y setters
    public int getIdOrders() {
        return idOrders;
    }

    public void setIdOrders(int idOrders) {
        this.idOrders = idOrders;
    }

    public clientDTO getClient() {
        return client;
    }

    public void setClient(clientDTO client) {
        this.client = client;
    }

    public TradersDTO getTrader() {
        return trader;
    }

    public void setTrader(TradersDTO trader) {
        this.trader = trader;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public LocalDate getDateOrder() {
        return dateOrder;
    }

    public void setDateOrder(LocalDate dateOrder) {
        this.dateOrder = dateOrder;
    }
}