// produtos.ts
// Funções que cuidam do catálogo de produtos.

import { Produto, Categoria, Resultado, ok, falha } from "./types";

// Catálogo em memória.
// O projeto não usa banco de dados, então os produtos ficam neste array.
const produtos: Produto[] = [
  { id: 1, nome: "Notebook", categoria: "informatica", preco: 2500, estoque: 15 },
  { id: 2, nome: "Mouse", categoria: "perifericos", preco: 100, estoque: 20 },
  { id: 3, nome: "Teclado", categoria: "perifericos", preco: 150, estoque: 10 },
  { id: 4, nome: "Monitor", categoria: "monitores", preco: 800, estoque: 5 },
  { id: 5, nome: "Impressora", categoria: "informatica", preco: 300, estoque: 8 },
  { id: 6, nome: "Cadeira Gamer", categoria: "acessorios", preco: 1200, estoque: 3 },
  { id: 7, nome: "Mesa Gamer", categoria: "acessorios", preco: 700, estoque: 2 },
  { id: 8, nome: "Webcam", categoria: "perifericos", preco: 250, estoque: 12 },
  { id: 9, nome: "Fone de Ouvido", categoria: "acessorios", preco: 150, estoque: 7 },
  { id: 10, nome: "Placa de Vídeo", categoria: "informatica", preco: 2000, estoque: 4 },
];

// Guarda o próximo id livre.
// O catálogo acima usa de 1 a 10, então o próximo é 11.
let proximoId = 11;

// Tipo usado para cadastrar um produto.
// O id é opcional: se não for informado, o sistema gera sozinho.
export type DadosProduto = {
  id?: number;
  nome: string;
  categoria: Categoria;
  preco: number;
  estoque: number;
};

// Confere as regras do enunciado.
// Se estiver tudo certo devolve null; se tiver erro, devolve a mensagem.
function validar(dados: DadosProduto): string | null {
  if (dados.nome === undefined || dados.nome.trim() === "") {
    return "O nome do produto não pode estar vazio.";
  }
  if (dados.preco <= 0) {
    return "O preço deve ser maior que zero.";
  }
  if (dados.estoque < 0) {
    return "O estoque não pode ser negativo.";
  }
  return null;
}

// ------------------------------------------------------------
// Cadastrar um produto novo
// ------------------------------------------------------------
export function cadastrarProduto(dados: DadosProduto): Resultado<Produto> {
  const erro = validar(dados);
  if (erro !== null) {
    return falha<Produto>(erro);
  }

  // Regra: não pode existir outro produto com o mesmo id.
  if (dados.id !== undefined && buscarProdutoPorId(dados.id) !== undefined) {
    return falha<Produto>(`Já existe um produto com o id ${dados.id}.`);
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

  const novo: Produto = {
    id: id,
    nome: dados.nome.trim(),
    categoria: dados.categoria,
    preco: dados.preco,
    estoque: dados.estoque,
  };

  produtos.push(novo);
  return ok(novo);
}

// ------------------------------------------------------------
// Listar todos os produtos
// ------------------------------------------------------------
export function listarProdutos(): Produto[] {
  // O map cria um array novo, copiando cada produto.
  // Assim quem chama não mexe no catálogo original sem querer.
  return produtos.map((p) => ({ ...p }));
}

// ------------------------------------------------------------
// Buscar um produto pelo id
// ------------------------------------------------------------
export function buscarProdutoPorId(id: number): Produto | undefined {
  return produtos.find((p) => p.id === id);
}

// ------------------------------------------------------------
// Buscar produtos por parte do nome
// ------------------------------------------------------------
export function buscarProdutosPorNome(termo: string): Produto[] {
  // toLowerCase deixa a busca sem diferenciar maiúscula de minúscula.
  const busca = termo.trim().toLowerCase();
  if (busca === "") {
    return [];
  }

  return produtos.filter((p) => p.nome.toLowerCase().includes(busca));
}

// ------------------------------------------------------------
// Filtrar produtos por categoria
// ------------------------------------------------------------
export function filtrarProdutosPorCategoria(categoria: string): Produto[] {
  const alvo = categoria.trim().toLowerCase();
  return produtos.filter((p) => p.categoria.toLowerCase() === alvo);
}

// ------------------------------------------------------------
// Atualizar um produto
// ------------------------------------------------------------
// "Partial<Produto>" quer dizer "um produto em que todos os campos
// são opcionais". Assim o main pode mandar só o preço, por exemplo.
export function atualizarProduto(
  id: number,
  dados: Partial<Produto>,
): Resultado<Produto> {
  const produto = buscarProdutoPorId(id);
  if (produto === undefined) {
    return falha<Produto>(`Produto com id ${id} não encontrado.`);
  }

  // Monta primeiro uma versão nova, sem mexer no produto do catálogo.
  const atualizado: Produto = {
    id: produto.id,
    nome: dados.nome !== undefined ? dados.nome.trim() : produto.nome,
    categoria: dados.categoria !== undefined ? dados.categoria : produto.categoria,
    preco: dados.preco !== undefined ? dados.preco : produto.preco,
    estoque: dados.estoque !== undefined ? dados.estoque : produto.estoque,
  };

  // Valida a versão nova. Se der erro, o produto original fica intacto.
  const erro = validar(atualizado);
  if (erro !== null) {
    return falha<Produto>(erro);
  }

  // Deu tudo certo: agora copia os valores para o produto do catálogo.
  produto.nome = atualizado.nome;
  produto.categoria = atualizado.categoria;
  produto.preco = atualizado.preco;
  produto.estoque = atualizado.estoque;

  return ok(produto);
}

// ------------------------------------------------------------
// Remover um produto
// ------------------------------------------------------------
export function removerProduto(id: number): Resultado<Produto> {
  const indice = produtos.findIndex((p) => p.id === id);

  if (indice === -1) {
    return falha<Produto>(`Produto com id ${id} não encontrado.`);
  }

  const removidos = produtos.splice(indice, 1);
  const removido = removidos[0];

  // Conferência extra: o TypeScript não sabe que o array tem item,
  // então precisamos testar antes de devolver.
  if (removido === undefined) {
    return falha<Produto>(`Produto com id ${id} não encontrado.`);
  }

  return ok(removido);
}

// ------------------------------------------------------------
// Baixar o estoque depois de uma compra
// ------------------------------------------------------------
// Fica aqui porque é o módulo de produtos que cuida do estoque.
export function baixarEstoque(
  id: number,
  quantidade: number,
): Resultado<Produto> {
  const produto = buscarProdutoPorId(id);
  if (produto === undefined) {
    return falha<Produto>(`Produto com id ${id} não encontrado.`);
  }

  if (quantidade <= 0) {
    return falha<Produto>("A quantidade deve ser maior que zero.");
  }

  if (quantidade > produto.estoque) {
    return falha<Produto>(
      `Estoque insuficiente para ${produto.nome}. Disponível: ${produto.estoque}.`,
    );
  }

  produto.estoque = produto.estoque - quantidade;
  return ok(produto);
}