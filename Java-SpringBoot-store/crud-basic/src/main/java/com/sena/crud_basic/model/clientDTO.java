package com.sena.crud_basic.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity(name = "client")
public class clientDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int idClient;

    @Column(name = "name", nullable = false, length = 100)
    private String nameClient;

    @Column(name = "phone", nullable = false, length = 10)
    private String phoneClient;

    @Column(name = "status")
    private int status; 

    public clientDTO() {
    }

    public clientDTO(int idClient, String nameClient, String phoneClient, int status) {
        this.idClient = idClient;
        this.nameClient = nameClient;
        this.phoneClient = phoneClient;
        this.status = status;
    }

    public int getIdClient() {
        return idClient;
    }

    public void setIdClient(int idClient) {
        this.idClient = idClient;
    }

    public String getNameClient() {
        return nameClient;
    }

    public void setNameClient(String nameClient) {
        this.nameClient = nameClient;
    }

    public String getPhoneClient() {
        return phoneClient;
    }

    public void setPhoneClient(String phoneClient) {
        this.phoneClient = phoneClient;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    
}