# 📦 API - Leitor de Código de Barras para Carrinho Online

Esta API é desenvolvida em **Node.js com Express** e é responsável por alimentar um aplicativo de leitura de código de barras, permitindo a adição de produtos em um carrinho de compras online. Além disso, armazena os produtos em um banco de dados, possibilitando consultas, atualizações e controle de variações de preços.

## 🚀 Funcionalidades

- Leitura de códigos de barras
- Adição de produtos ao carrinho
- Cadastro e atualização de produtos
- Histórico de variações de preços
- Consulta de produtos por código ou nome

## 🛠️ Tecnologias

- Node.js
- Express
- MongoDB ou PostgreSQL
- JWT para autenticação (opcional)
- RabbitMQ (opcional para eventos)

## 🔌 Endpoints principais

| Método | Rota                        | Descrição                         |
| ------ | --------------------------- | --------------------------------- |
| POST   | `/api/cart/add`             | Adiciona produto ao carrinho      |
| GET    | `/api/products/:code`       | Consulta produto pelo código      |
| POST   | `/api/products`             | Cadastra novo produto             |
| PUT    | `/api/products/:id`         | Atualiza dados e preço do produto |
| GET    | `/api/products/history/:id` | Lista variações de preço          |

## ⚙️ Como rodar o projeto

1. Clone o repositório.
2. Acesse a pasta do projeto:
   ```
   cd api-products
   ```
3. Instale as dependências:
   ```
   npm install
   ```
4. Crie o arquivo .env a partir do .env.example:
   ```
   cp .env.example .env
   ```
5. Execute a api:
   ```
   npm run dev
   ```

## 📄 Contato

Desenvolvido por Guilherme Viana.