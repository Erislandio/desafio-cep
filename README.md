# CEP API

-   [Primeiros passos](#primeiros-passos)
-   [Descrição](#descrição)
-   [Via CEP Micro-serviços](https://viacep.com.br/)
-   [Estratégia](#estratégia)
-   [Arquitetura](#arquitetura)
-   [NestJs Framework](#nestjs)
-   [Autenticação](#autenticação)
-   [ Endpoint](#endpoint)
-   [CEP](#cep)
-   [Health check](#health)
-   [ Dependencias e Livrarias externas](#Dependências)
-   [Heroku Deploy](#deploy)
-   [Swager documetação da API](#swagger)
-   [Testes](#testes)

## Primeiros passos

-   Certifique-se que o node e o NPM / Yarn esteja instalado na sua maquina com o comando:

`node --version && npm --version`

-   Instale as dependencias necessárias com o comando:

`yarn` ou `npm install`

Rode a aplicação em modo desenvolvedor com o comando:

`yarn start:dev`

Acessando a aplicação em http://localhost:3000/api/

## Descrição

Essa API possibilita que o usuário faça consultas de CEP por todo território Brasileiro, retornando o endereço respectivo.
Caso o CEP informado não seja encontrado uma regra de negocio entra-rá em ação fazendo outra busca com o CEP informado trocando os últimos números por `0`, até que o CEP seja encontrado.

-   exemplo: 12999999, 12999990 ...

Essa API está construída com base nos princípios SOLID.
Construída com [`typescript`](https://www.typescriptlang.org/) para uma melhor definição dos tipos e para evitar possível erros de tipagem.

## VIA CEP API

É um web-service gratuito para busca de CEP no território Brasileiro.
Mais informações no [link](https://viacep.com.br/).

## Estratégia

A estratégia utilizada foi consultar uma API externa de endereços por CEP.
Um diferencial é a regra de negocio citada anteriormente na [Descrição](descrição).

-   Dados cacheados: Quando a requisição para a consulta deCEP de uma vez, os dados da requisição ficarão cacheados
-   Autenticação: é necessário estar autenticado para fazer as consultas na API
-   Health check api: Para validar se a aplicação está sendo executada corretamente
-   Clean code: Melhores praticas para desenvolvimento
-   Swager/ Documetação da API: Documentação da API uma maneira mais simples.

## Arquitetura

A arquitetura do projeto está baseada no framework [Nestjs](#nestjs)

#### MIddleware:

![MIddleware](https://docs.nestjs.com/assets/Middlewares_1.png)

-   Básicamente temos uma API Rest que irá servir os serviços de consulta de endereços. Primeira parte da requisição irá acionar um `Middleware`, seria a porta de entrada da requisição, mas antes disso a requisição é enviada para o `controller`;

-   ZipMiddleware: que fara a validação do CEP (verificar se está dentro dos padrões), e em seguida enviada para o próximo middleware com pela função `next()`
-   AuthMiddleware: Temos aqui a validação da apikey para verificar se ela existe e se está valida

#### Controllers:

![Arquitetura](https://docs.nestjs.com/assets/Controllers_1.png)

-   Quando a requisição acionar o controller `ZipController` as validações já vão estar finalizadas e o fluxo poderá seguir normalmente.

#### Serviços / Provedores

![enter image description here](https://docs.nestjs.com/assets/Components_1.png)

Na parte de serviços temos um modulo capaz de fazer requisições externas chamado [HTTPModule](https://docs.nestjs.com/techniques/http-module) com ele é possível fazer a busca no micro-servico da [via cep api](https://viacep.com.br/).

## Nestjs

Nestjs é um Framework que facilita a construção de API's robustas e de alta escalabilidade com javascript/typescript. Elá possui um sistema de módulos que facilita a construção e o compartilhamento de classes/métodos.

-   Controllers: Responsável pela manipulação da Rota (Porta de entrada da aplicação/requisição)
-   Services: Camada acesso ao dados, exemplo uma camada de acesso ao banco de dados, no caso da API de CEP apenas é feita uma busca pelo CEP em uma aplicação externa usando o `HTTPModule`.
-   Modules: Onde se concentra os metadados, seria o arquivo principal de cada recurso da nossa API, onde podemos declarar outros módulos como dependência, importar e exportar módulos.

É fortemente orientada a objetos, e segue os princípios de desenvolvimento S.O.L.I.D.

Facilita a construção de endpoints com os [`Decorators`](https://www.typescriptlang.org/docs/handbook/decorators.html) do `typescript`.

Mais informações sobre o Nestjs nesse [link](https://nestjs.com/)

## Autenticação

-   Na autenticação utizamos apenas alguns dados 'mockados' para fazer a validação do header da requisição para consulta de CEP, nesse caso a chave da nossa API É:

| Api Key | eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MDEwMDE5NzgsImV4cCI6MTYzMjUzNzk3OCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.QTXBYNVpEth0Vn3kkICu2JBBnJ6_XtrawrPPxJ2Oxz8 |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |


## Endpoint

-   CEP: Busca o endereço pelo CEP

| Propriedades | nome   | tipo   | exemplo                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------ | ------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Query        | cep    | string | 12927012                                                                                                                                                                                                                                                                                                                                                                                         |
| apiKey       | apiKey | string | eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MDEwMDE5NzgsImV4cCI6MTYzMjUzNzk3OCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.QTXBYNVpEth0Vn3kkICu2JBBnJ6_XtrawrPPxJ2Oxz8 |

-   GET /api/v1/pvt/cep
-   Status: 200 - Resposta da api :

```JSON
{
  "cep": "12927-012",
  "logradouro": "Rua Herculano Augusto de Toledo",
  "complemento": "",
  "bairro": "Núcleo Residencial Henedina Rodrigues Cortez",
  "localidade": "Bragança Paulista",
  "uf": "SP",
  "ibge": "3507605",
  "gia": "2252",
  "ddd": "11",
  "siafi": "6251"
}

```

-   Status 400 - com o CEP: 12927-012 (Lembre-se que são apenas os números sem traço)

```JSON
{
  "statusCode": 400,
  "message": "Please enter a valid zip code",
  "error": "Bad Request"
}
```

-   Status 403 - Erro de autenticação

```JSON
{
  "statusCode": 401,
  "message": "Unauthorized"
}

```

## Health check

A Rota health ajuda a verificar a 'saúde' da aplicação, verificando a execução da API

```bash
curl -X GET "https://desafio-cep.herokuapp.com/health/check/cep" -H  "accept: application/json"
```

-   /GET - `/health/check/cep`

Resposta da API:

```JSON
{
  "status": "ok",
  "info": {
    "/ GET cep": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "/ GET cep": {
      "status": "up"
    }
  }
}
```

## Dependências

-   [JWT](https://jwt.io/introduction/) : JSON web token
-   [Winston](https://www.npmjs.com/package/winston): Para logs estruturados.
-   [Swegger](https://swagger.io/) Para documentação das rotas.

## Heroku

-   Definição do Heroku: "A heroku é uma plataforma nuvem que faz deploy de várias aplicações back-end seja para hospedagem, testes em produção ou escalar as suas aplicações."

-   Porque o Heroku? Heroku oferece vários tipos de serviços, como por exemplo: métricas da API, deploy automatizado, logs entre outros...

-   A API foi colocada online na rota: `https://desafio-cep.herokuapp.com/api`

Mais informações sobre o Heroku [aqui](https://www.heroku.com/about)

## swagger

Para acessar a documetação compreta dos endpoints API de busca, acesse: [Documentação](https://desafio-cep.herokuapp.com/api)

## Testes

Para rodar os teste da API basta rodar o comando: `yarn test` na raiz do projeto.
