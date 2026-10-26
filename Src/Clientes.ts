
// Clientes.ts - Cadastro e consulta de clientes


import { Cliente, Resultado, ok, falha } from "./Types";

// Base de clientes em memória. Declaração ÚNICA do array.

const clientes: Cliente[] = [
  { id: 1, nome: "Carlos Antonio", email: "carlos.antonio@email.com" },
  { id: 2, nome: "Ana Pereira Da Costa", email: "anacosta@icloud.com" },
  { id: 3, nome: "Paulo Oliveira", email: "oliveira.paulo@email.com" },
  { id: 4, nome: "Cristian da Rosa", email: "cristian_rosa@hotmail.com" },
];

// Próximo id livre: 5, porque a lista já usa de 1 a 4.
let proximoId = 5;


// Tipo de entrada do cadastro. O id é OPCIONAL.

export type DadosCliente = {
  id?: number;
  nome: string;
  email: string;
};


// Validação simples de e-mail: algo@algo.algo

function emailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Cadastra um novo cliente.
export function cadastrarCliente(dados: DadosCliente): Resultado<Cliente> {
  const nome = (dados.nome ?? "").trim();
  const email = (dados.email ?? "").trim().toLowerCase();

  // Regra: nome obrigatório
  if (nome === "") {
    return falha<Cliente>("O nome do cliente deve ser informado.");
  }
  // Regra: nome com pelo menos 3 caracteres
  if (nome.length < 3) {
    return falha<Cliente>("O nome do cliente precisa ter pelo menos 3 caracteres.");
  }
  // Regra: e-mail obrigatório
  if (email === "") {
    return falha<Cliente>("O e-mail do cliente deve ser informado.");
  }
  // Regra: e-mail com formato válido
  if (!emailValido(email)) {
    return falha<Cliente>(`O e-mail "${email}" não é válido.`);
  }

  // Regra: id não pode repetir
  if (dados.id !== undefined && buscarClientePorId(dados.id)) {
    return falha<Cliente>(`Já existe um cliente com o id ${dados.id}.`);
  }
  // Regra: e-mail não pode repetir
  if (buscarClientePorEmail(email)) {
    return falha<Cliente>(`Já existe um cliente com o e-mail ${email}.`);
  }

  const id = dados.id ?? proximoId;
  if (id >= proximoId) {
    proximoId = id + 1;
  }

  const novo: Cliente = { id, nome, email };
  clientes.push(novo);
  return ok(novo);
}

// Lista todos os clientes. Retorna cópia para não expor o array interno. */
export function listarClientes(): Cliente[] {
  return clientes.map((c) => ({ ...c }));
}

// Busca um cliente pelo identificador único.
export function buscarClientePorId(id: number): Cliente | undefined {
  return clientes.find((c) => c.id === id);
}

// Busca um cliente pelo e-mail (comparação em minúsculas).
export function buscarClientePorEmail(email: string): Cliente | undefined {
  const alvo = email.trim().toLowerCase();
  return clientes.find((c) => c.email === alvo);
}