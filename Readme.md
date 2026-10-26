# Sistema de Gerenciamento de E-commerce

Casiano Fabio Hoto
Projeto desenvolvido em TypeScript e Node.js para a turma Back-End 5.

## Funcionalidades

- Cadastro, consulta, atualização e remoção de produtos
- Cadastro e consulta de clientes
- Carrinho de compras com cálculo de subtotal e total
- Finalização de pedidos com baixa de estoque
- Relatório simples de vendas

## Estrutura

- `src/types.ts` — tipos do sistema
- `src/produtos.ts` — catálogo e regras de produto
- `src/clientes.ts` — cadastro de clientes
- `src/carrinho.ts` — operações do carrinho
- `src/pedidos.ts` — finalização e consulta de pedidos
- `src/main.ts` — demonstração das funcionalidades

## Como executar

Instale o TypeScript, se ainda não tiver:

    npm install -g typescript

Compile o projeto:

    tsc

Execute a demonstração:

    node dist/main.js

## Regras de negócio implementadas

- Id único para produtos, clientes e pedidos
- Nome de produto não vazio, preço maior que zero, estoque não negativo
- E-mail de cliente único e obrigatório
- Quantidade no carrinho maior que zero e dentro do estoque
- Produto repetido no carrinho soma a quantidade
- Pedido não é criado sem itens nem para cliente inexistente
- Estoque reduzido após a compra
- Preço praticado é gravado no pedido e não muda com o catálogo