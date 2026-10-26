// carrinho.ts
// Operações do carrinho de compras e cálculos de valores.

import {
  Carrinho,
  ItemCarrinho,
  ItemCarrinhoDetalhado,
  Resultado,
  ok,
  falha,
} from "./types";
import { buscarProdutoPorId } from "./produtos";

// Um carrinho para cada cliente.
// Usamos array porque o projeto pede armazenamento em array
// e porque é mais fácil de entender do que um Map.
const carrinhos: Carrinho[] = [];

// ------------------------------------------------------------
// Pegar o carrinho de um cliente
// ------------------------------------------------------------
// Se o cliente ainda não tem carrinho, criamos um vazio.
// Assim quem chama não precisa se preocupar com isso.
export function obterCarrinho(clienteId: number): Carrinho {
  const existente = carrinhos.find((c) => c.clienteId === clienteId);

  if (existente !== undefined) {
    return existente;
  }

  const novo: Carrinho = {
    clienteId: clienteId,
    itens: [],
  };

  carrinhos.push(novo);
  return novo;
}

// ------------------------------------------------------------
// Validar a quantidade
// ------------------------------------------------------------
// Devolve null se estiver certo, ou a mensagem de erro.
function validarQuantidade(quantidade: number): string | null {
  if (Number.isInteger(quantidade) === false) {
    return "A quantidade deve ser um número inteiro.";
  }
  if (quantidade <= 0) {
    return "A quantidade deve ser maior que zero.";
  }
  return null;
}

// ------------------------------------------------------------
// Adicionar um produto ao carrinho
// ------------------------------------------------------------
export function adicionarAoCarrinho(
  clienteId: number,
  produtoId: number,
  quantidade: number,
): Resultado<Carrinho> {
  // Regra: quantidade maior que zero
  const erroQuantidade = validarQuantidade(quantidade);
  if (erroQuantidade !== null) {
    return falha<Carrinho>(erroQuantidade);
  }

  // Regra: não adicionar produto que não existe
  const produto = buscarProdutoPorId(produtoId);
  if (produto === undefined) {
    return falha<Carrinho>(`Produto com id ${produtoId} não encontrado.`);
  }

  const carrinho = obterCarrinho(clienteId);

  // Verifica se o produto já está no carrinho.
  const itemExistente = carrinho.itens.find((i) => i.produtoId === produtoId);

  // Somamos com o que já existe antes de conferir o estoque.
  // Se o cliente tem 6 no carrinho e tenta mais 6, o total é 12.
  let quantidadeNoCarrinho = quantidade;
  if (itemExistente !== undefined) {
    quantidadeNoCarrinho = itemExistente.quantidade + quantidade;
  }

  // Regra: não pode passar do estoque disponível
  if (quantidadeNoCarrinho > produto.estoque) {
    return falha<Carrinho>(
      `Estoque insuficiente para ${produto.nome}. Disponível: ${produto.estoque}.`,
    );
  }

  if (itemExistente !== undefined) {
    // Regra: se o produto já está no carrinho, soma a quantidade
    // em vez de criar uma linha duplicada.
    itemExistente.quantidade = quantidadeNoCarrinho;
  } else {
    const novoItem: ItemCarrinho = {
      produtoId: produtoId,
      quantidade: quantidade,
    };
    carrinho.itens.push(novoItem);
  }

  return ok(carrinho);
}

// ------------------------------------------------------------
// Alterar a quantidade de um item do carrinho
// ------------------------------------------------------------
export function alterarQuantidade(
  clienteId: number,
  produtoId: number,
  quantidade: number,
): Resultado<Carrinho> {
  const erroQuantidade = validarQuantidade(quantidade);
  if (erroQuantidade !== null) {
    return falha<Carrinho>(erroQuantidade);
  }

  const produto = buscarProdutoPorId(produtoId);
  if (produto === undefined) {
    return falha<Carrinho>(`Produto com id ${produtoId} não encontrado.`);
  }

  const carrinho = obterCarrinho(clienteId);
  const item = carrinho.itens.find((i) => i.produtoId === produtoId);

  if (item === undefined) {
    return falha<Carrinho>(
      `O produto ${produto.nome} não está no carrinho deste cliente.`,
    );
  }

  if (quantidade > produto.estoque) {
    return falha<Carrinho>(
      `Estoque insuficiente para ${produto.nome}. Disponível: ${produto.estoque}.`,
    );
  }

  item.quantidade = quantidade;
  return ok(carrinho);
}

// ------------------------------------------------------------
// Remover um produto do carrinho
// ------------------------------------------------------------
export function removerDoCarrinho(
  clienteId: number,
  produtoId: number,
): Resultado<Carrinho> {
  const carrinho = obterCarrinho(clienteId);
  const indice = carrinho.itens.findIndex((i) => i.produtoId === produtoId);

  if (indice === -1) {
    return falha<Carrinho>(
      `O produto com id ${produtoId} não está no carrinho deste cliente.`,
    );
  }

  carrinho.itens.splice(indice, 1);
  return ok(carrinho);
}

// ------------------------------------------------------------
// Calcular o subtotal de um item
// ------------------------------------------------------------
export function calcularSubtotal(
  precoUnitario: number,
  quantidade: number,
): number {
  return precoUnitario * quantidade;
}

// ------------------------------------------------------------
// Listar os itens do carrinho com os dados do produto
// ------------------------------------------------------------
// Usamos for em vez de map para ficar mais fácil de ler.
export function listarItensCarrinho(
  clienteId: number,
): ItemCarrinhoDetalhado[] {
  const carrinho = obterCarrinho(clienteId);
  const detalhados: ItemCarrinhoDetalhado[] = [];

  for (const item of carrinho.itens) {
    const produto = buscarProdutoPorId(item.produtoId);

    // Se o produto foi removido do catálogo, o item é ignorado.
    if (produto !== undefined) {
      const subtotal = calcularSubtotal(produto.preco, item.quantidade);

      detalhados.push({
        produto: produto,
        quantidade: item.quantidade,
        subtotal: subtotal,
      });
    }
  }

  return detalhados;
}

// ------------------------------------------------------------
// Calcular o total do carrinho
// ------------------------------------------------------------
export function calcularTotalCarrinho(clienteId: number): number {
  const itens = listarItensCarrinho(clienteId);

  // O reduce percorre o array somando os subtotais.
  // "total" é a soma que vai crescendo, "item" é o item atual.
  return itens.reduce((total, item) => total + item.subtotal, 0);
}

// ------------------------------------------------------------
// Esvaziar o carrinho
// ------------------------------------------------------------
// Chamado depois que o pedido é criado, para o cliente
// não comprar o mesmo carrinho duas vezes.
export function limparCarrinho(clienteId: number): void {
  const indice = carrinhos.findIndex((c) => c.clienteId === clienteId);

  if (indice !== -1) {
    carrinhos.splice(indice, 1);
  }
}