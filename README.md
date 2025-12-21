# Delivery App

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Frontend](https://img.shields.io/badge/Frontend-Next.js-black)
![Framework](https://img.shields.io/badge/Framework-React-blue)

---

## Sobre o Projeto

Este projeto é o **frontend de um aplicativo de delivery**, desenvolvido em **Next.js**.
Ele consome uma **API REST desenvolvida em ASP.NET Web API**, sendo responsável pela interface do usuário, fluxo de pedidos e interação com o backend.

---

## Funcionalidades

- Interface web responsiva
- Listagem de estabelecimentos
- Visualização de produtos
- Carrinho de compras
- Criação de pedidos
- Acompanhamento de status
- Integração com API backend (.NET Web API)
- Gerenciamento de estado do carrinho
- Fluxo de checkout

---

## Tecnologias Utilizadas

- Next.js
- React
- TypeScript / JavaScript
- Axios / Fetch API
- CSS / Tailwind / Styled Components (conforme configuração)
- Integração com API REST

---

## Como Executar o Projeto

### Requisitos

- Node.js
- NPM ou Yarn
- API backend em execução

---

### Executar Localmente

1. Clone o repositório:
git clone https://github.com/JoaoIgorPaulinoPinto/delivery_app.git

csharp
Copy code

2. Instale as dependências:
npm install

ou
yarn install

markdown
Copy code

3. Crie o arquivo de ambiente:
.env.local

makefile
Copy code

Exemplo:
NEXT_PUBLIC_API_URL=http://localhost:5001

markdown
Copy code

4. Execute o projeto:
npm run dev

ou
yarn dev

markdown
Copy code

5. Acesse no navegador:
http://localhost:3000

yaml
Copy code

---

## Estrutura do Projeto

delivery_app/
├── app/
├── components/
├── services/
├── store/
├── public/
├── styles/
└── README.md

yaml
Copy code

---

## Backend

Este frontend consome a API desenvolvida em ASP.NET Web API.

Repositório do backend:
https://github.com/JoaoIgorPaulinoPinto/delivery_app-api

---

## Autor

João Igor Paulino Pinto  
GitHub: https://github.com/JoaoIgorPaulinoPinto

---

## Licença

Copyright © 2025 João Igor Paulino Pinto

Este projeto possui **licença privada**.

O código-fonte está disponível apenas para **visualização**.
É proibido copiar, modificar, distribuir ou utilizar este projeto, total ou parcialmente, sem autorização prévia do autor.

Todos os direitos reservados.
