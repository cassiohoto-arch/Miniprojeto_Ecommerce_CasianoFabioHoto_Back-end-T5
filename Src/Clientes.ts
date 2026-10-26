// clientes.ts
// Funções que cuidam do cadastro de clientes.

import { Cliente, Resultado, ok, falha } from "./types";

// Lista de clientes em memória.
const clientes: Cliente[] = [
  { id: 1, nome: "Carlos Antonio", email: "carlos.antonio@email.com" },
  { id: 2, nome: "Ana Pereira Da Costa", email: "anacosta@icloud.com" },
  { id: 3, nome: "Paulo Oliveira", email: "oliveira.paulo@email.com" },
  { id: 4, nome: "Cristian da Rosa", email: "cristian_rosa@hotmail.com" },
];

// Próximo id livre.
// A lista acima usa de 1 a 4, então o próximo é 5.
let proximoId = 5;

// Tipo usado para cadastrar um cliente.
// O id é opcional: se não for informado, o sistema gera sozinho.
export type DadosCliente = {
  id?: number;
  nome: string;
  email: string;
};

// Confere se o e-mail tem o formato básico: algo@algo.algo
function emailValido(email: string): boolean {
  if (email.includes("@") === false) {
    return false;
  }
  if (email.includes(".") === false) {
    return false;
  }
  if (email.includes(" ")) {
    return false;
  }
  return true;
}

// Confere as regras do enunciado.
// Se estiver tudo certo devolve null; se tiver erro, devolve a mensagem.
function validar(dados: DadosCliente): string | null {
  if (dados.nome === undefined || dados.nome.trim() === "") {
    return "O nome do cliente deve ser informado.";
  }
  if (dados.nome.trim().length < 3) {
    return "O nome do cliente precisa ter pelo menos 3 caracteres.";
  }
  if (dados.email === undefined || dados.email.trim() === "") {
    return "O e-mail do cliente deve ser informado.";
  }
  if (emailValido(dados.email) === false) {
    return "O e-mail informado não é válido.";
  }
  return null;
}

// ------------------------------------------------------------
// Cadastrar um cliente novo
// ------------------------------------------------------------
export function cadastrarCliente(dados: DadosCliente): Resultado<Cliente> {
  const erro = validar(dados);
  if (erro !== null) {
    return falha<Cliente>(erro);
  }

  // Guardamos o e-mail em minúsculo para comparar sempre igual.
  // Assim "Ana@Email.com" e "ana@email.com" contam como o mesmo.
  const email = dados.email.trim().toLowerCase();
  const nome = dados.nome.trim();

  // Regra: não pode existir outro cliente com o mesmo id.
  if (dados.id !== undefined && buscarClientePorId(dados.id) !== undefined) {
    return falha<Cliente>(`Já existe um cliente com o id ${dados.id}.`);
  }

  // Regra: não pode existir outro cliente com o mesmo e-mail.
  if (buscarClientePorEmail(email) !== undefined) {
    return falha<Cliente>(`Já existe um cliente com o e-mail ${email}.`);
  }

  // Usa o id informado ou o próximo livre.
  let id: number;
  if (dados.id !== undefined) {
    id = dados.id;
  } else {
    id = proximoId;
  }

  // Se o id usado for maior que o próximo, avança o contador.
  if (id >= proximoId) {
    proximoId = id + 1;
  }

  const novo: Cliente = {
    id: id,
    nome: nome,
    email: email,
  };

  clientes.push(novo);
  return ok(novo);
}

// ------------------------------------------------------------
// Listar todos os clientes
// ------------------------------------------------------------
export function listarClientes(): Cliente[] {
  // O map cria um array novo, copiando cada cliente.
  return clientes.map((c) => ({ ...c }));
}

// ------------------------------------------------------------
// Buscar um cliente pelo id
// ------------------------------------------------------------
export function buscarClientePorId(id: number): Cliente | undefined {
  return clientes.find((c) => c.id === id);
}

// ------------------------------------------------------------
// Buscar um cliente pelo e-mail
// ------------------------------------------------------------
export function buscarClientePorEmail(email: string): Cliente | undefined {
  const alvo = email.trim().toLowerCase();
  return clientes.find((c) => c.email === alvo);
}