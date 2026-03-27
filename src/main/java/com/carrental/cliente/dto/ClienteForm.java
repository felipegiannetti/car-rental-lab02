package com.carrental.cliente.dto;

import io.micronaut.core.annotation.Introspected;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO de entrada para criação e atualização de clientes.
 * Encapsula dados de acesso, dados pessoais, foto (base64) e até 3 rendimentos.
 * CPF e RG chegam sem formatação (apenas dígitos) — normalização feita no serviço.
 */
@Introspected
public class ClienteForm {

    private Long id;

    @NotBlank(message = "Nome de usuário é obrigatório")
    private String nomeUsuario;

    private String senha;

    @NotBlank(message = "Nome completo é obrigatório")
    private String nome;

    @NotBlank(message = "RG é obrigatório")
    private String rg;

    @NotBlank(message = "CPF é obrigatório")
    private String cpf;

    @NotBlank(message = "Endereço é obrigatório")
    private String endereco;

    private String profissao;

    /** Data URL completa — ex: "data:image/jpeg;base64,/9j/4AAQ..." */
    private String fotoBase64;

    // Renda 1
    private String renda1Entidade;
    private Double renda1Valor;

    // Renda 2
    private String renda2Entidade;
    private Double renda2Valor;

    // Renda 3
    private String renda3Entidade;
    private Double renda3Valor;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNomeUsuario() { return nomeUsuario; }
    public void setNomeUsuario(String v) { this.nomeUsuario = v; }

    public String getSenha() { return senha; }
    public void setSenha(String v) { this.senha = v; }

    public String getNome() { return nome; }
    public void setNome(String v) { this.nome = v; }

    public String getRg() { return rg; }
    public void setRg(String v) { this.rg = v; }

    public String getCpf() { return cpf; }
    public void setCpf(String v) { this.cpf = v; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String v) { this.endereco = v; }

    public String getProfissao() { return profissao; }
    public void setProfissao(String v) { this.profissao = v; }

    public String getFotoBase64() { return fotoBase64; }
    public void setFotoBase64(String v) { this.fotoBase64 = v; }

    public String getRenda1Entidade() { return renda1Entidade; }
    public void setRenda1Entidade(String v) { this.renda1Entidade = v; }

    public Double getRenda1Valor() { return renda1Valor; }
    public void setRenda1Valor(Double v) { this.renda1Valor = v; }

    public String getRenda2Entidade() { return renda2Entidade; }
    public void setRenda2Entidade(String v) { this.renda2Entidade = v; }

    public Double getRenda2Valor() { return renda2Valor; }
    public void setRenda2Valor(Double v) { this.renda2Valor = v; }

    public String getRenda3Entidade() { return renda3Entidade; }
    public void setRenda3Entidade(String v) { this.renda3Entidade = v; }

    public Double getRenda3Valor() { return renda3Valor; }
    public void setRenda3Valor(Double v) { this.renda3Valor = v; }
}
