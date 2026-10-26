
//Demonstração das funcionalidades.
import { pedido, Resultado } from "./types";

import { cadastrarProduto, listarProdutos, buscarProdutoPorId, buscarProdutoPorNome, atualizarProduto, removerProduto,
 } from "./produtos";
 import { cadastrarCliente, listarCliente, buscarClientePorId } from "./clientes";
 import {
    adicionarAoCarrinho,
    alterarQuantidade,
    removerDoCarrinho,
    listarItensCarrinho,
    calcularTotalCarrinho,
 } from "./carrinho";
 import {
    finalizarPedido,
    listarPedidos,
    listarPedidosPorCliente,
    gerarResumoVendas,
 } from "./pedidos";

 function imprimirPedido(pedido: Pedido): void {
    const cliente = buscarClientePorId(pedido.clienteId);
    console.log(
        '\n Pedido #${pedido.id} | Cliente: ${cliente ? clinete.nome : "desconhecido"} | ${pedido.data.toLocaleString("pt-BR")}',
    );
}

//PRUDUTOS
cadastrarProduto({ id: 1, nome: "Notebook ", categoria: "informatica", preco: 2.500, estoque: 15 }),
cadastrarProduto({ id: 3, nome: "Mouse", categoria: "informatica", preco:100.00 , estoque: 20 }),
cadastrarProduto({ id: 4, nome: "teclado", categoria: "informatica", preco: 150.00, estoque: 10 }),
cadastrarProduto({ id: 5, nome: "monitor", categoria: "informatica", preco: 800.00, estoque: 4 }),
cadastrarProduto({ id: 6, nome: "impressora", categoria: "informatica", preco: 300.00, estoque: 5 }),
cadastrarProduto({ id: 7, nome: "webcan", categoria: "informatica", preco: 250.00, estoque: 12 }),


//Produto com id repetido
cadastrarProduto({ id: 1, nome: "Produto com id repetido", categoria: "Acessórios", preco: 50, estoque: 2 }),
  (p) => `cadastrado: ${p.nome}`,
);

//Listar produtos
listarProdutos().forEach((p) => {
  console.log(
    `  #${p.id} ${p.nome} | ${p.categoria} | ${formatarMoeda(p.preco)} | estoque: ${p.estoque}`,
  );
});

//Buscar produto por Id
const produto2 = buscarProdutoPorId(2);
console.log(produto2 ? `  Encontrado: #${produto2.id} ${produto2.nome}` : "  Produto não encontrado.");

//cadastro cliente valido
logResultado(
  cadastrarCliente({ id: 1, nome: "Ana Souza", email: "ana.souza@email.com" }),
  (c) => `#${c.id} ${c.nome} — ${c.email}`,
);
logResultado(
  cadastrarCliente({ id: 2, nome: "Bruno Lima", email: "bruno.lima@email.com" }),
  (c) => `#${c.id} ${c.nome} — ${c.email}`,
);

//cadastro cliente invalido
logResultado(
  cadastrarCliente({ id: 1, nome: "Outra Pessoa", email: "outra@email.com" }),
  (c) => `cadastrado: ${c.nome}`,
);

//listar cliente
listarClientes().forEach((c)) => console.log(' #${c.id} ${c.nome} - ${c.email}'));

//Buscar cliente por id
const cliente1 = buscarClientePorId(1);
console.log(cliente1 ? ' Encontrado: ${cliente1.nome}' : "Cliente não encontrado.");

//Carrinho
//Adicionar item
logResultado(adicionarAoCarrinho(1, 1, 1), () => "Notebook adicionado (1 un.)");
logResultado(adicionarAoCarrinho(1, 2, 2), () => "Mouse adicionado (2 un.)");
logResultado(adicionarAoCarrinho(1, 3, 1), () => "Teclado adicionado (1 un.)");
logResultado(adicionarAoCarrinho(1, 2, 1), () => "Mouse adicionado novamente (soma, não duplica)");


//Itens do carrinho
listarItensCarrinho(1).forEach((item) => {
  console.log(
    `  #${item.produto.id} ${item.produto.nome} | ${item.quantidade} x ${formatarMoeda(item.produto.preco)} = ${formatarMoeda(item.subtotal)}`,
  );
});
console.log(`  TOTAL DO CARRINHO: ${formatarMoeda(calcularTotalCarrinho(1))}`);

//Alterar item
logResultado(alterarQuantidade(1, 3, 2), () => "quantidade alterada");
console.log(`  TOTAL DO CARRINHO: ${formatarMoeda(calcularTotalCarrinho(1))}`);

//Remover item
logResultado(removerDoCarrinho(1, 3), () => "teclado removido");
console.log(`  TOTAL DO CARRINHO: ${formatarMoeda(calcularTotalCarrinho(1))}`);

//Pedidos
//Finalizar pedidos
const pedido1 = finalizarPedido(1);
if (pedido1.sucesso) {
  imprimirPedido(pedido1.dados);
} else {
  console.log(`  [ERRO] ${pedido1.erro}`);
}

//Baixar estoque
[1, 2, 3, 4].forEach((id) => {
  const p = buscarProdutoPorId(id);
  if (p) console.log(`  #${p.id} ${p.nome}: ${p.estoque} un.`);
});

//Carrinho vazio
logResultado(finalizarPedido(1), (p) => `pedido #${p.id} criado`);

//Listar pedidos
listarPedidos().forEach((p) => {
  const cliente = buscarClientePorId(p.clienteId);
  console.log(
    `  Pedido #${p.id} | ${cliente ? cliente.nome : "?"} | ${p.itens.length} item(ns) | ${formatarMoeda(p.total)}`,
  );
});

//Resumo vendas
const resumo = gerarResumoVendas();
console.log(`  Pedidos: ${resumo.totalPedidos}`);
console.log(`  Total vendido: ${formatarMoeda(resumo.totalVendido)}`);
console.log(`  Ticket médio: ${formatarMoeda(resumo.ticketMedio)}`);
console.log("  Produtos mais vendidos:");
resumo.produtosMaisVendidos.forEach((p) => {
  console.log(`    #${p.produtoId} ${p.nome} — ${p.quantidade} un.`);
});

//Alterar preço
logResultado(atualizarProduto(1, { preco: 4299.9 }), (p) => `novo preço: ${formatarMoeda(p.preco)}`);

