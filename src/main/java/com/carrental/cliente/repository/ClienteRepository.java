package com.carrental.cliente.repository;

import com.carrental.cliente.model.Cliente;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repositório de acesso a dados para a entidade Cliente.
 * Provê operações CRUD e consultas customizadas por CPF.
 */
@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByCpf(String cpf);

    boolean existsByCpf(String cpf);

    boolean existsByCpfAndIdNot(String cpf, Long id);
}
