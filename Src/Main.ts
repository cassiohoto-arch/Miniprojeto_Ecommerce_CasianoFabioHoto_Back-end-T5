// main.ts
// Inicialização da aplicação e demonstração das funcionalidades.
//
// Compilar com: tsc
// Executar com: node Dist/main.js

import { Pedido, Resultado } from "./types";
import {
  cadastrarProduto,
  listarProdutos,
  buscarProdutoPorId,
  buscarProdutosPorNome,
  filtrarProdutosPorCategoria,
  atualizarProduto,
  removerProduto,
} from "./produtos";
import {
  cadastrarCliente,
  listarClientes,
  buscarClientePorId,
} from "./clientes";
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
  resumoVendas,
} from "./pedidos";

// ------------------------------------------------------------
// Funções de apoio para mostrar os resultados no console
// ------------------------------------------------------------

// Formata um número como dinheiro: 2500 vira "R$ 2.500,00".
function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Mostra o resultado de uma operação.
// Se deu certo, mostra os dados. Se deu errado, mostra o erro.
function mostrar<T>(resultado: Resultado<T>, texto: (dados: T) => string): void {
  if (resultado.sucesso) {
    console.log(`  [OK]   ${texto(resultado.dados)}`);
  } else {
    console.log(`  [ERRO] ${resultado.erro}`);
  }
}

// Mostra um pedido completo no console.
function mostrarPedido(pedido: Pedido): void {
  const cliente = buscarClientePorId(pedido.clienteId);

  let nomeCliente = "desconhecido";
  if (cliente !== undefined) {
    nomeCliente = cliente.nome;
  }

  console.log(`\n  Pedido #${pedido.id} - Cliente: ${nomeCliente}`);
  console.log(`  Data: ${pedido.data.toLocaleString("pt-BR")}`);

  for (const item of pedido.itens) {
    console.log(
      `    ${item.quantidade} x ${item.nomeProduto} = ${formatarMoeda(item.subtotal)}`,
    );
  }

  console.log(`    TOTAL: ${formatarMoeda(pedido.total)}`);
}

// ============================================================
// 1. CATÁLOGO INICIAL
// ============================================================
console.log("\n=== 1. Catálogo inicial ===");

for (const produto of listarProdutos()) {
  console.log(
    `  #${produto.id} ${produto.nome} - ${produto.categoria} - ${formatarMoeda(produto.preco)} - estoque: ${produto.estoque}`,
  );
}

// ============================================================
// 2. CADASTRO DE PRODUTOS
// ============================================================
console.log("\n=== 2. Cadastro de produtos ===");

// Cadastro válido, sem informar id.
// O sistema gera o próximo id livre.
mostrar(
  cadastrarProduto({
    nome: "SSD 1TB",
    categoria: "informatica",
    preco: 450,
    estoque: 6,
  }),
  (p) => `cadastrado: #${p.id} ${p.nome}`,
);

// Erro esperado: id já utilizado.
mostrar(
  cadastrarProduto({
    id: 1,
    nome: "Produto repetido",
    categoria: "informatica",
    preco: 10,
    estoque: 1,
  }),
  (p) => `cadastrado: #${p.id} ${p.nome}`,
);

// Erro esperado: preço igual a zero.
mostrar(
  cadastrarProduto({
    nome: "Produto sem preço",
    categoria: "informatica",
    preco: 0,
    estoque: 1,
  }),
  (p) => `cadastrado: #${p.id} ${p.nome}`,
);

// Erro esperado: nome vazio.
mostrar(
  cadastrarProduto({
    nome: "   ",
    categoria: "informatica",
    preco: 100,
    estoque: 1,
  }),
  (p) => `cadastrado: #${p.id} ${p.nome}`,
);

// ============================================================
// 3. BUSCA E FILTRO DE PRODUTOS
// ============================================================
console.log("\n=== 3. Busca e filtro ===");

const porId = buscarProdutoPorId(2);
if (porId !== undefined) {
  console.log(`  Busca por id 2: #${porId.id} ${porId.nome}`);
} else {
  console.log("  Busca por id 2: não encontrado");
}

const porNome = buscarProdutosPorNome("mouse");
console.log(`  Busca por nome "mouse": ${porNome.length} resultado(s)`);
for (const p of porNome) {
  console.log(`    #${p.id} ${p.nome}`);
}

const porCategoria = filtrarProdutosPorCategoria("acessorios");
console.log(`  Filtro "acessorios": ${porCategoria.length} produto(s)`);
for (const p of porCategoria) {
  console.log(`    #${p.id} ${p.nome}`);
}

// ============================================================
// 4. ATUALIZAÇÃO E REMOÇÃO DE PRODUTOS
// ============================================================
console.log("\n=== 4. Atualização e remoção ===");

mostrar(
  atualizarProduto(2, { preco: 120 }),
  (p) => `#${p.id} ${p.nome} agora custa ${formatarMoeda(p.preco)}`,
);

// Erro esperado: produto que não existe.
mostrar(
  atualizarProduto(999, { preco: 10 }),
  (p) => `#${p.id} atualizado`,
);

mostrar(removerProduto(10), (p) => `removido: #${p.id} ${p.nome}`);

// Erro esperado: remover o mesmo produto de novo.
mostrar(removerProduto(10), (p) => `removido: #${p.id} ${p.nome}`);

// ============================================================
// 5. CLIENTES
// ============================================================
console.log("\n=== 5. Clientes ===");

for (const cliente of listarClientes()) {
  console.log(`  #${cliente.id} ${cliente.nome} - ${cliente.email}`);
}

// Novo cliente, sem informar id.
mostrar(
  cadastrarCliente({ nome: "Marina Alves", email: "marina@email.com" }),
  (c) => `cadastrado: #${c.id} ${c.nome}`,
);

// Erro esperado: e-mail já cadastrado.
mostrar(
  cadastrarCliente({ nome: "Outra Pessoa", email: "anacosta@icloud.com" }),
  (c) => `cadastrado: #${c.id} ${c.nome}`,
);

// Erro esperado: nome com menos de 3 letras.
mostrar(
  cadastrarCliente({ nome: "Jo", email: "jo@email.com" }),
  (c) => `cadastrado: #${c.id} ${c.nome}`,
);

// ============================================================
// 6. CARRINHO DO CLIENTE 1
// ============================================================
console.log("\n=== 6. Carrinho do cliente 1 ===");

mostrar(adicionarAoCarrinho(1, 1, 1), () => "Notebook adicionado (1 un.)");
mostrar(adicionarAoCarrinho(1, 2, 2), () => "Mouse adicionado (2 un.)");

// Mesmo produto de novo: soma em vez de duplicar a linha.
mostrar(
  adicionarAoCarrinho(1, 2, 1),
  () => "Mouse adicionado de novo (agora 3 un.)",
);

// Erro esperado: Monitor tem apenas 5 em estoque.
mostrar(adicionarAoCarrinho(1, 4, 100), () => "Monitor adicionado");

// Erro esperado: produto que não existe.
mostrar(adicionarAoCarrinho(1, 999, 1), () => "Produto fantasma adicionado");

// Erro esperado: quantidade zero.
mostrar(adicionarAoCarrinho(1, 1, 0), () => "Adicionado com 0 un.");

console.log("\n  Itens do carrinho:");
for (const item of listarItensCarrinho(1)) {
  console.log(
    `    #${item.produto.id} ${item.produto.nome}: ${item.quantidade} x ${formatarMoeda(item.produto.preco)} = ${formatarMoeda(item.subtotal)}`,
  );
}
console.log(`    TOTAL: ${formatarMoeda(calcularTotalCarrinho(1))}`);

// ============================================================
// 7. ALTERAR E REMOVER ITENS
// ============================================================
console.log("\n=== 7. Alterar e remover itens ===");

mostrar(alterarQuantidade(1, 2, 5), () => "Mouse agora com 5 un.");
console.log(`  Total: ${formatarMoeda(calcularTotalCarrinho(1))}`);

mostrar(removerDoCarrinho(1, 2), () => "Mouse removido");
console.log(`  Total: ${formatarMoeda(calcularTotalCarrinho(1))}`);

// ============================================================
// 8. FINALIZAR PEDIDO
// ============================================================
console.log("\n=== 8. Finalizar pedido ===");

// Erro esperado: cliente que não existe.
mostrar(finalizarPedido(99), (p) => `pedido #${p.id} criado`);

const resultado1 = finalizarPedido(1);
if (resultado1.sucesso) {
  mostrarPedido(resultado1.dados);
} else {
  console.log(`  [ERRO] ${resultado1.erro}`);
}

// Erro esperado: o carrinho já foi esvaziado no pedido anterior.
mostrar(finalizarPedido(1), (p) => `pedido #${p.id} criado`);

// ============================================================
// 9. ESTOQUE DEPOIS DA COMPRA
// ============================================================
console.log("\n=== 9. Estoque depois da compra ===");

for (const id of [1, 2, 3, 4]) {
  const produto = buscarProdutoPorId(id);
  if (produto !== undefined) {
    console.log(`  #${produto.id} ${produto.nome}: ${produto.estoque} un.`);
  }
}

// ============================================================
// 10. SEGUNDO PEDIDO (OUTRO CLIENTE)
// ============================================================
console.log("\n=== 10. Segundo pedido (cliente 2) ===");

mostrar(adicionarAoCarrinho(2, 3, 2), () => "Teclado adicionado (2 un.)");

const resultado2 = finalizarPedido(2);
if (resultado2.sucesso) {
  mostrarPedido(resultado2.dados);
} else {
  console.log(`  [ERRO] ${resultado2.erro}`);
}

// ============================================================
// 11. CONSULTA DE PEDIDOS
// ============================================================
console.log("\n=== 11. Pedidos registrados ===");

for (const pedido of listarPedidos()) {
  const cliente = buscarClientePorId(pedido.clienteId);

  let nomeCliente = "desconhecido";
  if (cliente !== undefined) {
    nomeCliente = cliente.nome;
  }

  console.log(
    `  Pedido #${pedido.id} | ${nomeCliente} | ${pedido.itens.length} item(ns) | ${formatarMoeda(pedido.total)}`,
  );
}

const pedidosDoCliente1 = listarPedidosPorCliente(1);
console.log(`  Pedidos do cliente 1: ${pedidosDoCliente1.length}`);

// ============================================================
// 12. RESUMO DE VENDAS
// ============================================================
console.log("\n=== 12. Resumo de vendas ===");

const resumo = resumoVendas();
console.log(`  Pedidos: ${resumo.quantidadePedidos}`);
console.log(`  Total vendido: ${formatarMoeda(resumo.totalVendido)}`);

let ticketMedio = 0;
if (resumo.quantidadePedidos > 0) {
  ticketMedio = resumo.totalVendido / resumo.quantidadePedidos;
}
console.log(`  Ticket médio: ${formatarMoeda(ticketMedio)}`);

// ============================================================
// 13. PREÇO ANTIGO NÃO MUDA
// ============================================================
console.log("\n=== 13. Preço do pedido não muda ===");

const pedidosAntes = listarPedidos();
const pedidoAntigo = pedidosAntes[0];

if (pedidoAntigo !== undefined) {
  const totalAntes = pedidoAntigo.total;

  mostrar(
    atualizarProduto(1, { preco: 9999 }),
    (p) => `novo preço do catálogo: ${formatarMoeda(p.preco)}`,
  );

  const totalDepois = pedidoAntigo.total;

  console.log(`  Pedido #${pedidoAntigo.id} antes: ${formatarMoeda(totalAntes)}`);
  console.log(`  Pedido #${pedidoAntigo.id} depois: ${formatarMoeda(totalDepois)}`);

  if (totalAntes === totalDepois) {
    console.log("  [OK] O pedido manteve o preço da compra.");
  } else {
    console.log("  [ERRO] O pedido mudou de valor.");
  }
}

console.log("\n=== Fim da demonstração ===");