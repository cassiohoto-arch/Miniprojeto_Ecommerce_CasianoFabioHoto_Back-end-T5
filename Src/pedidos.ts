// pedidos.ts
// Finalização e consulta de pedidos.

import { ItemPedido, Pedido, Resultado, ok, falha } from "./types";
import { buscarClientePorId } from "./clientes";
import { buscarProdutoPorId, baixarEstoque } from "./produtos";
import { obterCarrinho, limparCarrinho } from "./carrinho";

// Lista de pedidos já finalizados.
const pedidos: Pedido[] = [];

// Próximo id de pedido. Começa em 1.
let proximoId = 1;

// ------------------------------------------------------------
// Finalizar um pedido
// ------------------------------------------------------------
export function finalizarPedido(clienteId: number): Resultado<Pedido> {
  // Regra: o cliente precisa existir.
  const cliente = buscarClientePorId(clienteId);
  if (cliente === undefined) {
    return falha<Pedido>(`Cliente com id ${clienteId} não encontrado.`);
  }

  const carrinho = obterCarrinho(clienteId);

  // Regra: não finalizar pedido sem itens.
  if (carrinho.itens.length === 0) {
    return falha<Pedido>("Não é possível finalizar um pedido sem itens.");
  }

  // Passo 1: conferir todos os itens ANTES de mudar qualquer coisa.
  // Se um item estiver errado, nenhum estoque é alterado.
  const itensPedido: ItemPedido[] = [];
  let total = 0;

  for (const item of carrinho.itens) {
    const produto = buscarProdutoPorId(item.produtoId);

    if (produto === undefined) {
      return falha<Pedido>(`Produto com id ${item.produtoId} não encontrado.`);
    }

    if (item.quantidade <= 0) {
      return falha<Pedido>(
        `Quantidade inválida para o produto ${produto.nome}.`,
      );
    }

    // Regra: não registrar o pedido se faltar estoque.
    if (item.quantidade > produto.estoque) {
      return falha<Pedido>(
        `Estoque insuficiente para ${produto.nome}. Disponível: ${produto.estoque}.`,
      );
    }

    const subtotal = produto.preco * item.quantidade;

    // Guarda o nome e o preço do momento da compra.
    // Se o preço mudar no catálogo depois, este pedido não muda.
    const itemPedido: ItemPedido = {
      produtoId: produto.id,
      nomeProduto: produto.nome,
      precoUnitario: produto.preco,
      quantidade: item.quantidade,
      subtotal: subtotal,
    };

    itensPedido.push(itemPedido);
    total = total + subtotal;
  }

  // Passo 2: baixar o estoque.
  // Aqui já sabemos que todos os itens têm estoque suficiente.
  for (const item of itensPedido) {
    const baixa = baixarEstoque(item.produtoId, item.quantidade);

    if (baixa.sucesso === false) {
      return falha<Pedido>(baixa.erro);
    }
  }

  // Passo 3: registrar o pedido.
  const pedido: Pedido = {
    id: proximoId,
    clienteId: cliente.id,
    itens: itensPedido,
    total: total,
    data: new Date(),
  };

  proximoId = proximoId + 1;
  pedidos.push(pedido);

  // O carrinho virou pedido: esvazia para não comprar duas vezes.
  limparCarrinho(clienteId);

  return ok(pedido);
}

// ------------------------------------------------------------
// Listar todos os pedidos
// ------------------------------------------------------------
export function listarPedidos(): Pedido[] {
  const lista: Pedido[] = [];

  for (const pedido of pedidos) {
    // Copia o pedido e também a lista de itens.
    lista.push({
      id: pedido.id,
      clienteId: pedido.clienteId,
      itens: pedido.itens.map((i) => ({ ...i })),
      total: pedido.total,
      data: pedido.data,
    });
  }

  return lista;
}

// ------------------------------------------------------------
// Buscar um pedido pelo id
// ------------------------------------------------------------
export function buscarPedidoPorId(id: number): Pedido | undefined {
  return pedidos.find((p) => p.id === id);
}

// ------------------------------------------------------------
// Listar os pedidos de um cliente
// ------------------------------------------------------------
export function listarPedidosPorCliente(clienteId: number): Pedido[] {
  const lista: Pedido[] = [];

  for (const pedido of pedidos) {
    if (pedido.clienteId === clienteId) {
      lista.push(pedido);
    }
  }

  return lista;
}

// ------------------------------------------------------------
// Resumo de vendas
// ------------------------------------------------------------
export function resumoVendas(): {
  quantidadePedidos: number;
  totalVendido: number;
} {
  let totalVendido = 0;

  for (const pedido of pedidos) {
    totalVendido = totalVendido + pedido.total;
  }

  return {
    quantidadePedidos: pedidos.length,
    totalVendido: totalVendido,
  };
}