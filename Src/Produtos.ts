
// Produtos.ts - Cadastro, consulta, atualização e remoção

// Import normal (sem "type"): ok e falha são FUNÇÕES,

import { Produto, Categoria, Resultado, ok, falha } from "./Types";


// Catálogo em memória: substitui o banco de dados neste projeto.

const produtos: Produto[] = [
  { id: 1, nome: "Notebook", categoria: "informatica", preco: 2500.0, estoque: 15 },
  { id: 2, nome: "Mouse", categoria: "informatica", preco: 100.0, estoque: 20 },
  { id: 3, nome: "Teclado", categoria: "informatica", preco: 150.0, estoque: 10 },
  { id: 4, nome: "Monitor", categoria: "informatica", preco: 800.0, estoque: 5 },
  { id: 5, nome: "Impressora", categoria: "informatica", preco: 300.0, estoque: 8 },
  { id: 6, nome: "Cadeira Gamer", categoria: "informatica", preco: 1200.0, estoque: 3 },
  { id: 7, nome: "Mesa Gamer", categoria: "informatica", preco: 700.0, estoque: 2 },
  { id: 8, nome: "Webcam", categoria: "informatica", preco: 250.0, estoque: 12 },
  { id: 9, nome: "Fone de Ouvido", categoria: "informatica", preco: 150.0, estoque: 7 },
  { id: 10, nome: "Placa de Vídeo", categoria: "informatica", preco: 2000.0, estoque: 4 },
];

// Próximo id livre. Começa em 11 porque o catálogo já usa de 1 a 10.
let proximoId = 11;

// Tipo de entrada do cadastro.
// O id é OPCIONAL: se não vier, o sistema gera automaticamente.

export type DadosProduto = {
  id?: number;
  nome: string;
  categoria: Categoria;
  preco: number;
  estoque: number;
};

// Regras obrigatórias de um produto.
function validarDadosProduto(dados: DadosProduto): string | null {
  if (!dados.nome || dados.nome.trim() === "") {
    return "O nome do produto não pode estar vazio.";
  }
  if (!dados.categoria || dados.categoria.trim() === "") {
    return "A categoria não pode estar vazia.";
  }
  if (!Number.isFinite(dados.preco) || dados.preco <= 0) {
    return "O preço deve ser maior que zero.";
  }
  if (!Number.isInteger(dados.estoque) || dados.estoque < 0) {
    return "O estoque não pode ser negativo nem fracionado.";
  }
  return null;
}

// Cadastra um novo produto no catálogo. 
export function cadastrarProduto(dados: DadosProduto): Resultado<Produto> {
  const erro = validarDadosProduto(dados);
  if (erro) return falha<Produto>(erro);

  // Regra: não permitir id já utilizado.
  if (dados.id !== undefined && buscarProdutoPorId(dados.id)) {
    return falha<Produto>(`Já existe um produto com o id ${dados.id}.`);
  }

  const id = dados.id ?? proximoId;
  if (id >= proximoId) {
    proximoId = id + 1;
  }

  const novo: Produto = {
    id,
    nome: dados.nome.trim(),
    categoria: dados.categoria,
    preco: dados.preco,
    estoque: dados.estoque,
  };

  produtos.push(novo);
  return ok(novo);
}

// Lista todos os produtos. Retorna cópia para não expor o array interno. 
export function listarProdutos(): Produto[] {
  return produtos.map((p) => ({ ...p }));
}

// Busca um produto pelo identificador único. 
export function buscarProdutoPorId(id: number): Produto | undefined {
  return produtos.find((p) => p.id === id);
}

// Busca por parte do nome, sem diferenciar maiúsculas de minúsculas. 
export function buscarProdutosPorNome(termo: string): Produto[] {
  const busca = termo.trim().toLowerCase();
  if (busca === "") return [];
  return produtos.filter((p) => p.nome.toLowerCase().includes(busca));
}

// Filtra o catálogo por categoria. 
export function filtrarProdutosPorCategoria(categoria: string): Produto[] {
  const alvo = categoria.trim().toLowerCase();
  return produtos.filter((p) => p.categoria.toLowerCase() === alvo);
}

// Atualiza apenas os campos enviados, revalidando as regras. 
export function atualizarProduto(
  id: number,
  alteracoes: Partial<Omit<Produto, "id">>,
): Resultado<Produto> {
  const produto = buscarProdutoPorId(id);
  if (!produto) {
    return falha<Produto>(`Produto com id ${id} não encontrado.`);
  }

  // O id nunca pode ser alterado: é reaplicado no final da mesclagem.
  const atualizado = { ...produto, ...alteracoes, id: produto.id };

  const erro = validarDadosProduto({
    nome: atualizado.nome,
    categoria: atualizado.categoria,
    preco: atualizado.preco,
    estoque: atualizado.estoque,
  });
  if (erro) return falha<Produto>(erro);

  produto.nome = atualizado.nome.trim();
  produto.categoria = atualizado.categoria;
  produto.preco = atualizado.preco;
  produto.estoque = atualizado.estoque;

  return ok(produto);
}

// Remove um produto do catálogo. 
export function removerProduto(id: number): Resultado<Produto> {
  const indice = produtos.findIndex((p) => p.id === id);
  if (indice === -1) {
    return falha<Produto>(`Produto com id ${id} não encontrado.`);
  }

  const removido = produtos.splice(indice, 1)[0];
  return ok(removido);
}


//Baixa de estoque usada pela finalização de pedidos.
 
export function baixarEstoque(id: number, quantidade: number): Resultado<Produto> {
  const produto = buscarProdutoPorId(id);
  if (!produto) {
    return falha<Produto>(`Produto com id ${id} não encontrado.`);
  }
  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    return falha<Produto>("A quantidade para baixa deve ser maior que zero.");
  }
  if (quantidade > produto.estoque) {
    return falha<Produto>(
      `Estoque insuficiente para "${produto.nome}". Disponível: ${produto.estoque}, solicitado: ${quantidade}.`,
    );
  }

  produto.estoque -= quantidade;
  return ok(produto);
}