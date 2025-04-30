package com.sena.crud_basic.model;

public class responseDTO {

    private String message;
    private String status;

    public responseDTO() {
    }

    public responseDTO(String message, String status) {
        this.message = message;
        this.status = status;
    }

    public String getMessage() {
        return this.message;
    }

    public String getStatus() {
        return this.status;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public responseDTO message(String message) {
        this.message = message;
        return this;
    }

    public responseDTO status(String status) {
        this.status = status;
        return this;
    }

}