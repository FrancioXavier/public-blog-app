//GRUPO DE ROTAS

/* Ao definir rotas em um arquivo na pasta routes e importar esse arquivo no seu app,
você deve definir uma rota de 'prefixo', como no exemplo de admin.*/


//VIEWS

//TAMBÉM É POSSÍVEL PASSAR ROTAS PARA AS VIEWS NO HANDLEBARS

//COOKIES

//Arquivo de texto que salva informações diretamente do navegador do usuário

//Sessões 

//São arquivos de texto que ficam durante um determinado período de tempo no servidor, como funciona:


/*

1- Assim que um usuário loga no site, a sessão é iniciada no servidor, que envia um cookie ao browser com id
da própria sessão

2- qualquer dado associado a sessão é salvado no servidor

3- em toda requisição o browser envia de volta o cookie com o ID da sessão, permitindo o servidor acessar os 
dados daquele cookie

*/

//MIDDLEWARE

//é um intermediario cliente e servidor, ele serve para tratar requisições antes que cheguem no servidor
// e vice versa


/// O POPULATE VOCE PASSA {PATH: NOME DO CAMPO, MODEL: MODEL DE REFERENCIA , STRICTPOPULATE: FALSE PELOAMORDEDEUS}