package com.carrental.cliente.model;

import com.carrental.shared.model.Usuario;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidade que representa um cliente do sistema de aluguel.
 * Herda atributos de acesso de Usuario e adiciona dados pessoais,
 * foto de perfil e lista de rendimentos (máximo 3).
 */
@Entity
@Table(name = "clientes")
public class Cliente extends Usuario {

    @Column(nullable = false)
    private String rg;

    @Column(nullable = false, unique = true)
    private String cpf;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String endereco;

    @Column
    private String profissao;

    @JsonIgnore
    @Column(name = "foto", columnDefinition = "LONGBLOB")
    private byte[] foto;

    @Column(name = "foto_tipo", length = 100)
    private String fotoTipo;

    @OneToMany(
        mappedBy = "cliente",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.EAGER
    )
    private List<Renda> rendas = new ArrayList<>();

    // ── getters / setters ──────────────────────────────────────────────

    public String getRg() { return rg; }
    public void setRg(String rg) { this.rg = rg; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public String getProfissao() { return profissao; }
    public void setProfissao(String profissao) { this.profissao = profissao; }

    public byte[] getFoto() { return foto; }
    public void setFoto(byte[] foto) { this.foto = foto; }

    public String getFotoTipo() { return fotoTipo; }
    public void setFotoTipo(String fotoTipo) { this.fotoTipo = fotoTipo; }

    public List<Renda> getRendas() { return rendas; }
    public void setRendas(List<Renda> rendas) { this.rendas = rendas; }

    /** Indica ao front-end se existe foto salva, sem transmitir os bytes. */
    public boolean isTemFoto() {
        return foto != null && foto.length > 0;
    }

    public double getTotalRendimentos() {
        return rendas.stream().mapToDouble(Renda::getValorRendimento).sum();
    }
}
