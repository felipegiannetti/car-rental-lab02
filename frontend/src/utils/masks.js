/** Formata CPF: 000.000.000-00 */
export function formatCPF(value) {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

/** Formata RG: 00.000.000-0 */
export function formatRG(value) {
  const d = value.replace(/\D/g, '').slice(0, 9)
  if (d.length <= 2) return d
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}-${d.slice(8)}`
}

/** Remove formatação — retorna apenas dígitos */
export const rawDigits = (value) => (value ?? '').replace(/\D/g, '')

/** Aplica máscara de CPF para exibição de valor vindo do banco (somente dígitos) */
export function displayCPF(cpf) {
  return formatCPF(cpf ?? '')
}

/** Aplica máscara de RG para exibição */
export function displayRG(rg) {
  return formatRG(rg ?? '')
}

export const PROFISSOES = [
  'Administrador(a)',
  'Advogado(a)',
  'Analista de Sistemas',
  'Arquiteto(a)',
  'Assistente Social',
  'Autônomo(a)',
  'Biomédico(a)',
  'Comerciante',
  'Contador(a)',
  'Designer',
  'Economista',
  'Enfermeiro(a)',
  'Engenheiro(a)',
  'Estudante',
  'Farmacêutico(a)',
  'Fisioterapeuta',
  'Funcionário(a) Público(a)',
  'Médico(a)',
  'Modelo',
  'Nutricionista',
  'Odontólogo(a)',
  'Professor(a)',
  'Psicólogo(a)',
  'Técnico(a)',
  'Veterinário(a)',
  'Outros',
]
