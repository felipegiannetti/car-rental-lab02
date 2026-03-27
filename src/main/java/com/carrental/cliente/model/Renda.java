package com.carrental.cliente.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

/**
 * Entidade que representa um rendimento de um cliente.
 * Cada cliente pode ter no máximo 3 rendas cadastradas.
 */
@Entity
@Table(name = "rendas")
public class Renda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRenda;

    @Column(nullable = false)
    private String entidadeEmpregadora;

    @Column(nullable = false)
    private Double valorRendimento;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    public Long getIdRenda() { return idRenda; }
    public void setIdRenda(Long idRenda) { this.idRenda = idRenda; }

    public String getEntidadeEmpregadora() { return entidadeEmpregadora; }
    public void setEntidadeEmpregadora(String e) { this.entidadeEmpregadora = e; }

    public Double getValorRendimento() { return valorRendimento; }
    public void setValorRendimento(Double v) { this.valorRendimento = v; }

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
}
