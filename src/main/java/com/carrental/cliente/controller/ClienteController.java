package com.carrental.cliente.controller;

import com.carrental.cliente.dto.ClienteForm;
import com.carrental.cliente.model.Cliente;
import com.carrental.cliente.service.ClienteService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Controller REST do módulo de clientes.
 * Expõe CRUD em /api/clientes, busca por CPF e streaming de foto.
 */
@Controller("/api/clientes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    /** GET /api/clientes — lista todos */
    @Get
    public List<Cliente> listar() {
        return clienteService.listarTodos();
    }

    /** POST /api/clientes — cria novo cliente */
    @Post
    public HttpResponse<?> criar(@Body ClienteForm form) {
        try {
            return HttpResponse.created(clienteService.criar(form));
        } catch (IllegalArgumentException e) {
            return HttpResponse.badRequest(Map.of("message", e.getMessage()));
        }
    }

    /** GET /api/clientes/{id} — busca por id */
    @Get("/{id}")
    public HttpResponse<?> buscar(Long id) {
        return clienteService.buscarPorId(id)
                .<HttpResponse<?>>map(HttpResponse::ok)
                .orElse(HttpResponse.notFound(Map.of("message", "Cliente não encontrado: " + id)));
    }

    /**
     * GET /api/clientes/buscar-cpf/{cpf} — verifica se CPF já existe.
     * Retorna { encontrado: true, id, nome } ou { encontrado: false }.
     * Útil para o front-end detectar duplicatas em tempo real.
     */
    @Get("/buscar-cpf/{cpf}")
    public HttpResponse<?> buscarPorCpf(String cpf) {
        return clienteService.buscarPorCpf(cpf)
                .<HttpResponse<?>>map(c -> HttpResponse.ok(
                        Map.of("encontrado", true, "id", c.getId(), "nome", c.getNome())))
                .orElse(HttpResponse.ok(Map.of("encontrado", false)));
    }

    /** GET /api/clientes/{id}/foto — retorna os bytes da foto de perfil */
    @Get("/{id}/foto")
    @Produces(MediaType.ALL)
    public HttpResponse<?> getFoto(Long id) {
        Optional<Cliente> opt = clienteService.buscarPorId(id);
        if (opt.isEmpty() || opt.get().getFoto() == null || opt.get().getFoto().length == 0) {
            return HttpResponse.notFound();
        }
        Cliente c = opt.get();
        String tipo = c.getFotoTipo() != null ? c.getFotoTipo() : "image/jpeg";
        return HttpResponse.ok(c.getFoto())
                .header("Content-Type", tipo)
                .header("Cache-Control", "max-age=3600");
    }

    /** PUT /api/clientes/{id} — atualiza cliente */
    @Put("/{id}")
    public HttpResponse<?> atualizar(Long id, @Body ClienteForm form) {
        try {
            return HttpResponse.ok(clienteService.atualizar(id, form));
        } catch (IllegalArgumentException e) {
            return HttpResponse.badRequest(Map.of("message", e.getMessage()));
        }
    }

    /** DELETE /api/clientes/{id} — remove cliente e suas rendas */
    @Delete("/{id}")
    public HttpResponse<?> deletar(Long id) {
        try {
            clienteService.deletar(id);
            return HttpResponse.noContent();
        } catch (Exception e) {
            return HttpResponse.badRequest(Map.of("message", e.getMessage()));
        }
    }
}
