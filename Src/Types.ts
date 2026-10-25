 //Tipos utilizados pelo sistema
 
 export type Categoria = "informatica";

 export type Produto = {
    codigo: number;
    nome: string;
    preco: number;
    quantidade: number;
    categoria: Categoria;
 }

 export type clientes = {
   id: number;
   nome: string;
   email: string;
 }

 export type ItemCarrinho{
   produtoId: number;
   quantidade: number;
 }

 export type Carrinho {
   clienteId: number;
   itens : ItemCarrinho[];
 }
 //carrinho com dados do produto
 export type ItemCarrinhoDetalhado{
   produto: Produto;
   quantidade: number;
   subtotal: number;
 }

 //Retorno padronizado das operações
 export type Resultado<T> =
   | { sucesso: true; dados: T }
   | { sucesso: false; erro: string };

   export function ok<T>(dados: T): Resultado<T> {
      return { sucesso: true, dados };
}
 export function falha<T>(erro: string): Reusltado<T> {
   return { sucesso: false, erro };
 }