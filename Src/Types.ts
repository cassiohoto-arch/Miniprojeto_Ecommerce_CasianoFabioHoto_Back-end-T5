// types.ts
// Aqui ficam os tipos do sistema, ou seja, o "formato" de cada dado.

// Categorias que o sistema aceita.
// Deixar a lista pronta evita salvar categoria com erro de digitação.
export type Categoria =
  | "informatica"
  | "perifericos"
  | "monitores"
  | "acessorios";

// Um produto do catálogo.
export type Produto = {
  id: number;
  nome: string;
  categoria: Categoria;
  preco: number;
  estoque: number;
};

// Um cliente da loja.
export type Cliente = {
  id: number;
  nome: string;
  email: string;
};

// Um item dentro do carrinho.
// Guarda só o id do produto e quantas unidades o cliente quer.
export type ItemCarrinho = {
  produtoId: number;
  quantidade: number;
};

// O carrinho de um cliente.
export type Carrinho = {
  clienteId: number;
  itens: ItemCarrinho[];
};

// Item do carrinho já com os dados do produto.
// Serve para mostrar na tela e para calcular o subtotal.
export type ItemCarrinhoDetalhado = {
  produto: Produto;
  quantidade: number;
  subtotal: number;
};

// Item dentro de um pedido.
// Guarda o nome e o preço do momento da compra.
// Assim, se o preço mudar depois, o pedido antigo não muda.
export type ItemPedido = {
  produtoId: number;
  nomeProduto: string;
  precoUnitario: number;
  quantidade: number;
  subtotal: number;
};

// Um pedido já finalizado.
export type Pedido = {
  id: number;
  clienteId: number;
  itens: ItemPedido[];
  total: number;
  data: Date;
};

// Resultado de uma operação.
// Ou deu certo e tem "dados", ou deu errado e tem "erro".
export type Resultado<T> =
  | { sucesso: true; dados: T }
  | { sucesso: false; erro: string };

// Funções ajudantes que montam o resultado.
export function ok<T>(dados: T): Resultado<T> {
  return { sucesso: true, dados };
}

export function falha<T>(erro: string): Resultado<T> {
  return { sucesso: false, erro };
}