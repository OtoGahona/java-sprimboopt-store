package com.sena.crud_basic.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity(name = "order_products")
public class OrderProductDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int idOrderProduct;

    @ManyToOne
    @JoinColumn(name = "idOrders")
    private ordersDTO order;

    @ManyToOne
    @JoinColumn(name = "idProduct")
    private productsDTO product;

    @Column(name = "status")
    private int status;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "price", nullable = false)
    private double price;

    @Column(name = "total", nullable = false)
    private double total;

    // Constructor vacío (necesario para JPA)
    public OrderProductDTO() {
    }

    // Constructor completo
    public OrderProductDTO(int idOrderProduct, ordersDTO order, productsDTO product, int status, int quantity,
            double price, double total) {
        this.idOrderProduct = idOrderProduct;
        this.order = order;
        this.product = product;
        this.status = status;
        this.quantity = quantity;
        this.price = price;
        this.total = total;
    }

    // Getters y setters
    public int getIdOrderProduct() {
        return idOrderProduct;
    }

    public void setIdOrderProduct(int idOrderProduct) {
        this.idOrderProduct = idOrderProduct;
    }

    public ordersDTO getOrder() {
        return order;
    }

    public void setOrder(ordersDTO order) {
        this.order = order;
    }

    public productsDTO getProduct() {
        return product;
    }

    public void setProduct(productsDTO product) {
        this.product = product;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }
}