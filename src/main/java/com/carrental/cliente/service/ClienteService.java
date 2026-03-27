package com.carrental.cliente.service;

import com.carrental.cliente.dto.ClienteForm;
import com.carrental.cliente.model.Cliente;
import com.carrental.cliente.model.Renda;
import com.carrental.cliente.repository.ClienteRepository;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;

import java.util.Base64;
import java.util.List;
import java.util.Optional;

/**
 * Serviço responsável pela lógica de negócio do módulo de clientes.
 * Garante unicidade de CPF, normalização de documentos,
 * processamento de foto e limite de 3 rendimentos por cliente.
 */
@Singleton
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public Optional<Cliente> buscarPorId(Long id) {
        return clienteRepository.findById(id);
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public Optional<Cliente> buscarPorCpf(String cpf) {
        String cpfNorm = normalizarDigitos(cpf);
        return clienteRepository.findByCpf(cpfNorm);
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public Optional<byte[]> buscarFoto(Long id) {
        return buscarPorId(id)
                .filter(c -> c.getFoto() != null && c.getFoto().length > 0)
                .map(Cliente::getFoto);
    }

    @Transactional
    public Cliente criar(ClienteForm form) {
        String cpfNorm = normalizarDigitos(form.getCpf());
        if (clienteRepository.existsByCpf(cpfNorm)) {
            throw new IllegalArgumentException("CPF já cadastrado: " + form.getCpf());
        }
        Cliente cliente = new Cliente();
        cliente.setTipoUsuario("CLIENTE");
        preencherCliente(cliente, form);
        return clienteRepository.save(cliente);
    }

    @Transactional
    public Cliente atualizar(Long id, ClienteForm form) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado: " + id));

        String cpfNorm = normalizarDigitos(form.getCpf());
        if (!cliente.getCpf().equals(cpfNorm)
                && clienteRepository.existsByCpfAndIdNot(cpfNorm, id)) {
            throw new IllegalArgumentException("CPF já cadastrado para outro cliente.");
        }

        preencherCliente(cliente, form);
        return clienteRepository.update(cliente);
    }

    @Transactional
    public void deletar(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado: " + id));
        clienteRepository.delete(cliente);
    }

    public ClienteForm toForm(Cliente cliente) {
        ClienteForm form = new ClienteForm();
        form.setId(cliente.getId());
        form.setNomeUsuario(cliente.getNomeUsuario());
        form.setNome(cliente.getNome());
        form.setRg(cliente.getRg());
        form.setCpf(cliente.getCpf());
        form.setEndereco(cliente.getEndereco());
        form.setProfissao(cliente.getProfissao());

        List<Renda> rendas = cliente.getRendas();
        if (rendas.size() > 0) {
            form.setRenda1Entidade(rendas.get(0).getEntidadeEmpregadora());
            form.setRenda1Valor(rendas.get(0).getValorRendimento());
        }
        if (rendas.size() > 1) {
            form.setRenda2Entidade(rendas.get(1).getEntidadeEmpregadora());
            form.setRenda2Valor(rendas.get(1).getValorRendimento());
        }
        if (rendas.size() > 2) {
            form.setRenda3Entidade(rendas.get(2).getEntidadeEmpregadora());
            form.setRenda3Valor(rendas.get(2).getValorRendimento());
        }
        return form;
    }

    // ── private helpers ────────────────────────────────────────────────────

    private void preencherCliente(Cliente cliente, ClienteForm form) {
        cliente.setNomeUsuario(form.getNomeUsuario());
        if (form.getSenha() != null && !form.getSenha().isBlank()) {
            cliente.setSenha(form.getSenha());
        }
        cliente.setNome(form.getNome());
        cliente.setRg(normalizarDigitos(form.getRg()));
        cliente.setCpf(normalizarDigitos(form.getCpf()));
        cliente.setEndereco(form.getEndereco());
        cliente.setProfissao(form.getProfissao() != null ? form.getProfissao() : "Sem profissão");

        processarFoto(cliente, form.getFotoBase64());

        cliente.getRendas().clear();
        adicionarRenda(cliente, form.getRenda1Entidade(), form.getRenda1Valor());
        adicionarRenda(cliente, form.getRenda2Entidade(), form.getRenda2Valor());
        adicionarRenda(cliente, form.getRenda3Entidade(), form.getRenda3Valor());
    }

    private void processarFoto(Cliente cliente, String fotoBase64) {
        if (fotoBase64 == null || fotoBase64.isBlank()) return;
        try {
            if (fotoBase64.contains(",")) {
                String[] partes = fotoBase64.split(",", 2);
                String header = partes[0]; // "data:image/jpeg;base64"
                String tipo = header.contains(":") ? header.split(":")[1].split(";")[0] : "image/jpeg";
                cliente.setFotoTipo(tipo);
                cliente.setFoto(Base64.getDecoder().decode(partes[1]));
            } else {
                cliente.setFotoTipo("image/jpeg");
                cliente.setFoto(Base64.getDecoder().decode(fotoBase64));
            }
        } catch (Exception ignored) {
            // foto inválida — mantém a anterior
        }
    }

    private void adicionarRenda(Cliente cliente, String entidade, Double valor) {
        if (entidade != null && !entidade.isBlank() && valor != null) {
            Renda renda = new Renda();
            renda.setEntidadeEmpregadora(entidade);
            renda.setValorRendimento(valor);
            renda.setCliente(cliente);
            cliente.getRendas().add(renda);
        }
    }

    /** Remove qualquer caractere não-dígito (formatação de CPF/RG). */
    private String normalizarDigitos(String valor) {
        return valor == null ? "" : valor.replaceAll("\\D", "");
    }
}
