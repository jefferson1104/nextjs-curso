# CURSO DE NEXTJS

<br>

## INTRODUCAO BASICA

<br>

### Criar a base do projeto em nextjs
```
$ yarn create next-app "PROJECT_NAME"
$ npx create-next-app "PROJECT_NAME"
```

<br>

### Integrar o projeto com TypeScript
`$ yarn add typescript @types/react @types/node -D`

<br>

### Limpando e organizando a estrutura do projeto iniciado com create next-app
 - deletar README.md
 - deletar /styles
 - deletar public/favicon.ico
 - deletar public/vercel.svg
 - deletar pages/api.js

<br>

### Caso esteja utilizando Typescript modifique as extencoes dos arquivos .js para .tsx:
 - Modificar pages/_app.js para pages/_app.tsx
 - Modificar pages/index.js para pages/index.tsx

<br>

### Limpar os arquivos pages/index e pages/_app removendo o conteudo do codigo como importacoes e etc..

<br>

## COMANDOS BASICOS
### Executar a aplicacao em ambiente de desenvolvimento
`$ yarn dev`
### Criar Build da aplicacao
`$ yarn build`

<br>

# PAGINAS E ROTAS
No nextjs a navegacao de paginas nao precisa de uma biblioteca externa para funcionar, basta voce criar o arquivo ou pastas e subpastas dentro do diretorio pages, lembrando que esse diretorio nao pode ser modificado, ou seja no maximo voce pode criar uma pasta chamada src/pages mas nao pode modificar o pages e nem colcar em nenhuma outro diretorio diferente de src que nao vai funcionar.

Para que um determinado arquivo nao seja encontrado na rota de navegacao das paginas, basta acrescentar o '_' na frente do arquivo por exemplo _contacts.tsx e essa pagina nao sera incluida nas rotas de navegacao do projeto.

<br>

## ROTAS DINAMICAS
No nextjs podemos criar uma rota dinamica utilizando o useRouter do proprio nextjs e no nome do arquivo .tsx usamos um **[]** por exemplo **_[produto].tsx_** , no exemplo abaixo mostramos como criamos uma estrutura para utilizar esse recurso de rotas dinamicas, Criamos um arquivo chamado **_[produto].tsx_**, criamos ele dentro do diretorio **_src/pages/[produto].tsx_**, dentro deste arquivo colocamos o seguinte conteudo:

```
import { useRouter } from 'next/router';

export default function Product() {
  const router = useRouter();

  return (
    <>
      <h1>{router.query.produto}</h1>
    </>
  )
}
```
Agora acessamos ele com a seguite url: http://localhost:3000/notebook-gamer

<br>

# STYLED COMPONENTS
### Instalacao da biblioteca styled-components
`$ yarn add styled-components`

### Instalacao do types para tipagem do TypeScript
`$ yarn add @types/styled-components -D`

No nextjs nao podemos criar os arquivos de estilizacao no mesmo diretorio onde ficam os componentes, devido a isto recomendo criar um diretorio a parte **src/sytles** e dentro deste diretorio criamos nosso arquivo de estilizacao global e tambem separamos por pastas os arquivos de estilizacao de cada componente.

Aprenda a configurar seu styled-components para executar com nextjs em server side rendering, para resumir crie na raiz do projeto um arquivo chamado **"babel.config.js"** e dentro desse arquivo coloque o seguinte conteudo:
```
module.exports = {
  presets: ["next/babel"],
  plugins: [["styled-components", { "ssr": true }]]
}
```

<br>

### Instalacao do plugin para que o nodejs interprete o styled-components no servidor, dessa maneira conseguimos utilizar styled-components em server side rendering.
`$ yarn add babel-plugin-styled-components -D`

<br>

Dentro de **src/pages/** crie um arquivo chamado **"_document.tsx"** e dentro coloque o seguinte conteudo:

```
import Document, { DocumentContext } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }
}
```

### Caso tenha dificuldades siga a documentacao oficial nos links abaixo:
https://styled-components.com/docs/advanced#server-side-rendering

https://github.com/vercel/next.js/tree/master/examples/with-styled-components

<br>


# TRABALHANDO COM DADOS

## CRIANDO UMA API FAKE PARA TESTES
### Crie um arquivo chamado **"server.json"** na raiz do projeto com o seguinte conteudo:
```
{
  "categories": [
    { "id": "camisetas", "title": "Camisetas" },
    { "id": "calcas", "title": "Calças" }
  ],
  "products": [
    { "id": 1, "title": "Camiseta Front-end", "price": 79.9, "category_id": "camisetas", "slug": "camiseta-front-ends"},
    { "id": 2, "title": "Camiseta CSharpolin", "price": 69.9, "category_id": "camisetas", "slug": "camiseta-csharpolin"},
    { "id": 3, "title": "Calça preta back-end", "price": 129.9, "category_id": "calcas", "slug": "calca-preta-back-end"},
    { "id": 4, "title": "Calça azul do React", "price": 109.9, "category_id": "calcas", "slug": "calca-azul-react"}
  ],
  "recommended": [
    { "id": 1, "title": "Camiseta Front-end", "price": 79.9, "category_id": "camisetas", "slug": "camiseta-front-ends"},
    { "id": 4, "title": "Calça azul do React", "price": 109.9, "category_id": "calcas", "slug": "calca-azul-react"}
  ]
}
```
FONTE CONTEUDO: https://github.com/typicode/json-server

<br>

### Execute e instale a API no projeto, abra o terminal na raiz do projeto e execute o comando:
`$ npx json-server server.json -p 3333 -w`
* O parametro **"-p"** determina a porta que a API sera executada
* O parametro **"-w"** reinicia automaticamente a API toda vez que algum codigo do projeto for alterado.

<br>

### Rotas da API
 - http://localhost:3333/categories
 - http://localhost:3333/products
 - http://localhost:3333/recommended

<br>

## CONSUMINDO API
Existem 3 modelos de consumo de API que podemos utilizar em nossos projetos com NextJS, os modelos sao:
 - Client Side Fetching
 - Server Side Rendering
 - Static Site Generation

### <b>Modelo client side fetching</b>
Utilizamos este modelo de consumo de api, quando nao precisamos que as informacoes que estamos carregando da api sejam indexados pelos motores de busca.

### <b>Modelo server side rendering</b>
Utilizamos este modelo de consumo de API, quando em nosso projeto desejamos que todo os dados consumidos pela API tenha uma indexacao nos motores de busca, este modelo faz com que todo o conteudo seja carregado pelo servidor web e nao pelo seu client(browser). 

### <b>Modelo Static Site Generation</b>
Este tambem e um modelo que ajuda na indexacao dos conteudos pelos motores de buscas, ele um modelo que gera uma pagina estatica mais recomendados para o uso de blogs ou qualquer tipo de projeto que o modelo da pagina seja estatico porem o conteudo dinamico, este modelo de consumo de API e o modelo **mais performatico que existe no NextJS**.

<br>

### EXEMPLOS 
> OBS: Nos exemplos a seguir utilizamos o fetch para nao ficar instalando muitas bibliotecas externas como axios, SWR do proprio nextjs, dessa maneira conseguimos exemplificar o consumo da api de uma forma mais simples possivel, mas fique a vontade para fazer o consumo da maneira que desejar, segue abaixo os links oficiais das bibliotecas [AXIOS](https://github.com/axios/axios) e [SWR](https://swr.vercel.app/).

<br>

### Client Side Fetching
Exemplo de consumo com client side fetching, utilize o conteudo abaixo, copie e cole no seu index.tsx:<br>
**src/pages/index.tsx**
```
//importando css com stled-components
import { useEffect, useState } from 'react'
import { Title } from '../styles/pages/Home'

//tipando os dados
interface IProduct {
  id: string;
  title: string;
}

export default function Home() {
  //criando um estado
  const [recommendedProducts, setRecommendedProducts] = useState<IProduct[]>([]);

  //lifecycle consumindo as rotas da api
  useEffect(() =>{
    fetch('http://localhost:3333/recommended').then(response =>{
      response.json().then(data => {
        setRecommendedProducts(data);
      })
    });
  },[]);

  return (
    <div>
      <section>
        <Title>Products</Title>

        <ul>
          {recommendedProducts.map(recommendedProduct => {
            return (
              <li key={recommendedProduct.id}>
                {recommendedProduct.title}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  )
}
```

<br>

### Server Side Rendering
>OBS: somente utilizamos este recurso quando queremos que os dados da API seja carregada junto com a pagina e esteja disponivel para os motores de buscas.

Exemplo de consumo com server side rendering, utilize o conteudo abaixo, copie e cole no seu index.tsx:<br>
**src/pages/index.tsx**
```
//importando css com stled-components
import { GetServerSideProps } from 'next';
import { Title } from '../styles/pages/Home'

//tipando os dados
interface IProduct {
  id: string;
  title: string;
}

interface HomeProps {
  recommendedProducts: IProduct[];
}

export default function Home({ recommendedProducts }: HomeProps) {

  return (
    <div>
      <section>
        <Title>Products</Title>

        <ul>
          {recommendedProducts.map(recommendedProduct => {
            return (
              <li key={recommendedProduct.id}>
                {recommendedProduct.title}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  )
}

//consumindo api com server side rendering
export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const response = await fetch('http://localhost:3333/recommended');
  const recommendedProducts = await response.json();

  return {
    props: {
      recommendedProducts
    }
  }  
}

```

<br>

### Static Site Generation
Exemplo de consumo com Static Site Generation, incluimos neste exemplo um recurso que toda vez que e alterado algum conteudo na sua pagina ele gera uma nova pagina estatica, este conteudo e verificado a cada 5 segundos, utilize o conteudo abaixo, copie e cole no seu index.tsx:<br>
**src/pages/index.tsx**
```
import { GetStaticProps } from 'next';

//tipando os dados
interface IProduct {
  id: string;
  title: string;
}

interface Top10Props {
  products: IProduct[];
}

export default function Top10( {products }: Top10Props) {
  return (
    <div>
      <h1>Top 10</h1>

      <ul>
        {products.map(recommendedProduct => {
          return (
            <li key={recommendedProduct.id}>
              {recommendedProduct.title}
            </li>
          );
        })}
      </ul>
    </div>
  )
}

//consumindo a api utilizando o modelo static site generation
export const getStaticProps: GetStaticProps<Top10Props> = async (context) => {
  const response = await fetch('http://localhost:3333/products');
  const products = await response.json();

  return {
    props: {
      products,
    },
    revalidate: 5,
  }
}

```

## Gerando uma pagina estatica com conteudo dinamico
exmemplo de codigo, utilizando recursos como revalidate (recurso para atualizar o conteudo de acordo com o tempo setado) e tambem com o recurso de fallback (para quando determinada pagina ainda nao ter sido gerada ela gerar quando tiver seu primeiro acesso) no exemplo vamos mostrar algo como um catalogo de produtos, com query params e slugs, este exemplo serve para e-commerce por exemplo, ou aqueles blogs que voce vai ter inumeras postagens como em sites de noticias e etc<br>

**src/pages/catalog/categories/[slug].tsx***
```
import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';

//tipando os dados
interface IProduct {
  id: string;
  title: string;
}

interface CategoryProps {
  products: IProduct[];
}

export default function Category({ products }: CategoryProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Loading</p>
  }

  return (
    <>
      <h1>{router.query.slug}</h1>

      <ul>
        {products.map(recommendedProduct => {
          return (
            <li key={recommendedProduct.id}>
              {recommendedProduct.title}
            </li>
          );
        })}
      </ul>
    </>
  )
}

//utilizamos quando geramos uma pagina estatica com conteudo dinamico
export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(`http://localhost:3333/categories`);
  const categories = await response.json();

  const paths = categories.map(category => {
    return {
      params: { slug: category.id }
    }
  })

  return {
    paths,
    fallback: true,
  }
};

//consumindo a api utilizando o modelo static site generation
export const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {
  const { slug } = context.params;

  const response = await fetch(`http://localhost:3333/products?category_id=${slug}`);
  const products = await response.json();

  return {
    props: {
      products,
    },
    revalidate: 60,
  }
}
```

<br>

# 404 NO FOUND
no nextjs e muito simples voce criar uma pagina 404 not found estilizada como voce quiser, basta apenas voce criar um arquivo chamado **"404.tsx"** dentro de **"src/pages/"** ficando assim **"src/pages/404.tsx"**, pronto qualquer rota que nao for encontrada vai para esse arquivo automaticamente.

<br>

# DYNAMIC IMPORT
Podemos fazer importacoes de componentes, bibliotecas ou servicos dinamicamente, ou seja so importamos algo quando for necessario quando aquele usuario precisar.

criando um caso hipotetico para demonstrar:

- Dentro do diretorio **"src"** criar uma pasta chamada **"lib"** com um arquivo chamado **"math.ts"** que vai ser um arquivo simulando uma biblioteca, no caso este arquivo contem um codigo que faz um calculo.

> OBS: Importante saber que para utilizar o import dinamico e necessario que sempre tenha em mente que somente utilizamos quando o recurso que estamos deixando dinamico e algo que o usuario da aplicacao poucas vezes utiliza e que este recurso e super pesado o que impacta no desempenho caso nao deixamos dinamico e ele fique sempre carregando mesmo sem o usuario da aplicacao utilizar.

<br>

### EXEMPLO:

**lib/math.ts**
```
export default {
  sum: (a: number, b: number) => {
    return a + b;
  }
};

```
<br>

**src/pages/index.tsx**
```
import { GetServerSideProps } from 'next';
import { Title } from '../styles/pages/Home'

//tipando os dados
interface IProduct {
  id: string;
  title: string;
}

interface HomeProps {
  recommendedProducts: IProduct[];
}

export default function Home({ recommendedProducts }: HomeProps) {

  async function handleSum() {
    const math = (await import('../lib/math')).default;

    alert(math.sum(3, 5));
  }

  return (
    <div>
      <section>
        <Title>Products</Title>

        <ul>
          {recommendedProducts.map(recommendedProduct => {
            return (
              <li key={recommendedProduct.id}>
                {recommendedProduct.title}
              </li>
            );
          })}
        </ul>
      </section>

      <button onClick={handleSum}>SUM!</button>
    </div>
  )
}

//consumindo api com server side rendering
export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const response = await fetch('http://localhost:3333/recommended');
  const recommendedProducts = await response.json();

  return {
    props: {
      recommendedProducts
    }
  }  
}
```

<br>

# LAZY LOAD COMPONENT
Para exemplificar este recurso, vamos simular hipoteticamente um modal, no caso do exemplo a seguir criamos dentro do diretorio **"src"** um diretorio com nome **"components"** e dentro dela um componente com nome **"AddToCart.tsx"** para que possamos simular um botao que adiciona um produto ao carrinho igual em um e-commerce.

> OBS: Incluimos neste exemplo, um recurso para que o componente nao seja carregado caso o cliente nao clicar no botao que chama este componente, aumentando assim o desempenho da aplicacao.

<br>

**src/components/AddToCartModal.tsx**
```
export default function AddToCartModal() {
  return (
    <div>
      Do you really want to add this product to the cart?
    </div>
  )
}
```

<br>

Incluindo componente na pagina de produtos:<br>
**src/pages/catalog/products/[slug].tsx**
```
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useState } from 'react';

//criando um loading antes de chamar o componente.
/*apenas utilizamos o parametro "ssr: false" quando precisamos que algo seja 
renderizado pelo client e nao pelo nodejs, devido ao browser ter seus recursos 
proprio que nao e possivel utilizar via server side rendering
*/
const AddToCartModal = dynamic(
  () => import('../../../components/AddToCartModal'),
  { loading: () => <p>Loading...</p>, ssr: false}
);

export default function Product() {
  const router = useRouter();
  const [isAddToCartModalVisible, setIsAddToCartModalVisible] = useState(false);

  function addToCart() {
    setIsAddToCartModalVisible(true);
  }

  return (
    <>
      <h1>{router.query.slug}</h1>
      <p>http://localhost:3000/catalog/products/camiseta-listrada</p>


      <button onClick={addToCart}>Add to cart</button>


      { isAddToCartModalVisible && <AddToCartModal />}
    </>
  )
}

//slug e so um exemplo, poderiamos criar com qualquer outro nome
//Teste: http://localhost:3000/catalog/products/camiseta-listrada

```

<br>

# VARIAVEIS DE AMBIENTE
Sobre o uso de variavel de ambiente no nextjs.

para criar variaveis de ambiente que nao venham a ser feito o upload para o github crie na raiz do projeto com a seguinte nomemclatura: **".env.local"** e seu **.gitignore** automaticamente nao vai deixar este arquivo subir para seu repositorio em nuvem.

porem existem outros tipos de arquivos que cria a variavel de ambiente para voce utilzar em testes, ambiente de producao e desenvolvimento, elas caso voce utilizar um repositorio remoto ela ira subir para seu github

- **.env.teste**: Utilize para testes
- **.env.developmente**: Utilize em ambientes de desenvolvimento
- **.env.production**: Utilize em ambientes de producao

<br>

# PATHS IMPORT DO TYPESCRIPT COM NEXTJS
Quando utilizamos na importacao muitos saltos de pastas para importar determinado componente ou servico, utilizamos os paths de importacao.

Fica mais pratico do que colocar **"../../../../caminho/arquivo.tsx"** e entao pensando nisso com o nextJS fica muito mais facil de voce criar estes paths no seu arquivo **"tsconfig.json"** veja um exemplo abaixo.<br>

**tsconfig.json**

```
  "baseUrl": "./src",
  "paths": {
     "@/*": ["./*"]
  },
```

<br>

# SEO COMPONENT
Uma das grandes motivos do uso do nextJS e pela questao do SEO.

no exemplo abaixo vamos criar componente global de SEO, crie na pasta "components" um arquivo chamado "SEO.tsx" com o seguinte conteudo:<br>

**src/componens/SEO.tsx**
```
import Head from 'next/head';

//interface para tipagem
interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  shouldExcludeTitleSuffix?: boolean;
  shouldIndexPage?: boolean;
}

export default function SEO({
  title,
  description,
  image,
  shouldExcludeTitleSuffix = false,
  shouldIndexPage = true
}: SEOProps) {
  const pageTitle = `${title} ${!shouldExcludeTitleSuffix ? '| DevCommerce': ''}`;
  const pageImage =  image ? `http://localhost:3333/${image}` : null;


  return (
    <Head>
      <title>{pageTitle}</title>

      { description && <meta name="description" content={description} /> } 
      { pageImage && <meta name="image" content={pageImage} /> }
            
      { !shouldIndexPage && <meta name="robots" content="noindex, nofollow" /> }
    </Head>
  );
}

//OUTRAS META TAGS IMPORTANTES
/*
<meta httpEquiv="x-ua-compatible" content="IE=edge,chrome=1" />
<meta name="MobileOptimized" content="320" />
<meta name="HandheldFriendly" content="True" />
<meta name="theme-color" content="#121214" />
<meta name="msapplication-TileColor" content="#121214" />
<meta name="referrer" content="no-referrer-when-downgrade" />
<meta name="google" content="notranslate" />

<meta property="og:title" content={pageTitle} />
<meta property="og:description" content={description} />
<meta property="og:locale" content="pt_BR" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content={pageTitle} />
<meta property="og:image" content={pageImage} />
<meta property="og:image:secure_url" content={pageImage} />
<meta property="og:image:alt" content="Thumbnail" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<meta name="twitter:title" content={pageTitle} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@rocketseat" />
<meta name="twitter:creator" content="@rocketseat" />
<meta name="twitter:image" content={pageImage} />
<meta name="twitter:image:src" content={pageImage} />
<meta name="twitter:image:alt" content="Thumbnail" />
<meta name="twitter:image:width" content="1200" />
<meta name="twitter:image:height" content="620" />
*/
```

Agora podemos incluir o component de SEO em nosso index.tsx<br>
**src/pages/index.tsx**
```
import SEO from '@/components/SEO';
import { GetServerSideProps } from 'next';
import { Title } from '../styles/pages/Home'

//tipando os dados
interface IProduct {
  id: string;
  title: string;
}

interface HomeProps {
  recommendedProducts: IProduct[];
}

export default function Home({ recommendedProducts }: HomeProps) {

  async function handleSum() {
    const math = (await import('../lib/math')).default;

    alert(math.sum(3, 5));
  }

  return (
    <div>
      <SEO 
        title="DevCommerce, your best e-commerce!" 
        image="boost.png"
        shouldExcludeTitleSuffix
      />  

      <section>
        <Title>Products</Title>

        <ul>
          {recommendedProducts.map(recommendedProduct => {
            return (
              <li key={recommendedProduct.id}>
                {recommendedProduct.title}
              </li>
            );
          })}
        </ul>
      </section>

      <button onClick={handleSum}>SUM!</button>
    </div>
  )
}

//consumindo api com server side rendering
export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const response = await fetch('http://localhost:3333/recommended');
  const recommendedProducts = await response.json();

  return {
    props: {
      recommendedProducts
    }
  }  
}
```
<br>

## CRIANDO DOCUMENTO CUSTOMIZADO
Digamos que voce quer utulizar um mesmo tipo de fonte para todas as paginas da sua aplicacao, o mesmo favicon entre outros. Entao utilizamos este recurso, vamos criar um exemplo a seguir onde determinamos a fonte roboto que pegamos do google exportando via Link, no diretorio **"src/pages/"** crie um arquivo com o seguinte nome **"_document.tsx"** com o seguinte conteudo:<br>

**src/pages/_document.tsx**
```
import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html lang="pt">
        <Head>
          <meta charSet="utf-8" />

          <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    ); 
  }
}

```
<br>

Agora e so importar nos estilos globais da sua aplicacao, por exemplo:<br>
**src/styles/GlobalStyles.ts**
```
import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }

  body {
    background-color: #33312d;
    color: #FFF;
    font-family: Roboto, Arial, Helvetica, sans-serif;
  }

  a {
    text-decoration: none;    
    color: #FFF;
  }
  a:hover {
    color: #8527e5;
    transition: 0.8s;
  }
`;
```

<br>

# TRABALHANDO COM CMS E FINALIZANDO APP
Com o nextJS e possivel integrar com qualquer CMS mas segue alguns exemplos na documentacao oficial: https://nextjs.org/docs/basic-features/data-fetching

<br>

## ALGUNS CMS`s
 - A melhor opcao para blog e o Ghost: https://ghost.org/docs/api/v3/nextjs/
 - A melhor opcao para paginas estaticas e o prismic: https://prismic.io

 - outra opcao e o contentful para projetos muito robustos utilize a versao paga: https://contentful.com
 - outra opcao e o strapi para projetos simples: https://strapi.io/integrations/nextjs-cms

<br>

## TESTANDO O PRISMIC
Faca um cadastro no https://prismic.io<br>

Acesse o seu prismic e vamos comecar a criar um novo projeto.<br>

- Em **Custom Types** crie _"category"_ com os seguites campos
  - UUI
  - TITLE

- Ainda em **Custom Types** crie _"products"_  com os seguintes campos
  - UUID
  - TITLE
  - CONTENT RELATIONSHIP
  - IMAGE
  - RICH TEXT
  - NUMBER

- Agora em **"Documents"** crie  as categorias para o _"category"_ 
E crie tambem os produtos para _"products"_  nao se esqueca dos campos de relacionamentos com a categoria **(content relationship)**.<br>


- instale no projeto as libs abaixo:<br>
  - `$ yarn add prismic-javascript prismic-dom`
  - `$ yarn add @types/prismic-dom -D`

<br>

Crie um arquivo no diretorio **src/lib/prismic.ts** dentro dele utilize o conteudo a seguir, este conteudo e a configuracao da conexao com a API do prismic.<br>

> OBS: informacoes sobre como configurar este arquivo voce encontra no prismic na dashboard do seu projeto, no canto inferior esquerdo o icone de uma engrenagem **"settings"** e em seguida na opcao **"API & Security"** neste local voce encontra tambem a informacao sobre o endpoit da sua api.
<br>

na variavel "apiEndpoint" substitua o link pelo link do endpoint da sua api:<br>
**src/lib/prismic.ts**
```
import Prismic from 'prismic-javascript';

export const apiEndpoint = 'https://NOMEDOSEUPROJETO.cdn.prismic.io/api/v2';

export const client = (req = null) => {
  const options = req ? { req } : null;

  return Prismic.client(apiEndpoint, options)
};
```

## FINALIZANDO A APLICACAO!
> Muito bem agora vamos finalizar nosso primeiro app em NEXTJS e para isso vamos criar uma estilizacao bacana das paginas e atualizar o codigo delas para implementar o Prismic e os componentes estilizados.

<br>

Vamos primeiro criar nossos styles no diretorio *src/styles/" criando um arquivo chamado **"Home.ts"** e **"Products.ts"** vamos deixar cada um desses arquivos com seus respectivos conteudos:<br>

**/src/styles/Home.ts**
```
import styled from 'styled-components';

export const HomePage = styled.div`
  margin: 30px;
  padding: 10px;
`;

export const Title = styled.h1`  
  color: #8527e5;
  margin-bottom: 20px;
  text-transform: uppercase;
`;

export const ParagraphClass = styled.p`
  margin-bottom: 10px;
`;
```

<br>

**src/styles/Products.ts**
```
import styled from 'styled-components';

export const Title = styled.h1`  
  color: #8527e5;
  margin-bottom: 20px;
  text-transform: uppercase;
`;

export const ImageClass = styled.img`
  border-radius: 50%;
  margin-bottom: 20px;
`;

export const DescriptionClass = styled.div`
  max-width: 650px;
  text-align: justify;
  margin-bottom: 20px;
`;

export const ContentClass = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

export const ContentPriceClass = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: row;
`;

export const PriceClass = styled.p`
  color: #8527e5;
  font-weight: bold;
  text-transform: uppercase;
  margin-right: 5px;
`;
```

<br><br>

Agora vamos construir ou atualizar nosso index.tsx e outras paginas como a de categorias e produtos, ligando eles ao nosso prismic consumindo a API, e chamando os arquivos de estilizacao do style-component,  deixe-os iguais aos exemplos a seguir:

<br>

**src/pages/index.tsx**
```
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { Title, HomePage, ParagraphClass} from '@/styles/pages/Home'
import SEO from '@/components/SEO';
import { client } from '@/lib/prismic';
import Prismic from 'prismic-javascript';
import PrismicDOM from 'prismic-dom'
import { Document } from 'prismic-javascript/types/documents';

interface HomeProps {
  recommendedProducts: Document[];
}

export default function Home({ recommendedProducts }: HomeProps) {

  return (
    <HomePage>
      <SEO 
        title="DevCommerce, your best e-commerce!" 
        image="boost.png"
        shouldExcludeTitleSuffix
      />

      <section>
        <Title>Products</Title>

        <p>
          {recommendedProducts.map(recommendedProduct => {
            return (
              <ParagraphClass key={recommendedProduct.id}>
                <Link href={`/catalog/products/${recommendedProduct.uid}`} >
                  <a>
                    {PrismicDOM.RichText.asText(recommendedProduct.data.title)}                    
                  </a>                  
                </Link>
              </ParagraphClass>
            );
          })}
        </p>
      </section>
    </HomePage>
  )
}

//consumindo api com server side rendering
export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const recommendedProducts = await client().query([
    Prismic.Predicates.at('document.type', 'product')
  ]);

  return {
    props: {
      recommendedProducts: recommendedProducts.results,
    }
  }  
}
```
<br>

Pagina de categoria (category)<br>
**src/pages/catalog/categories/[slug].tsx**
```
import { client } from '@/lib/prismic';
import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PrismicDOM from 'prismic-dom';
import Prismic from 'prismic-javascript';
import { Document } from 'prismic-javascript/types/documents';


//tipagem dos dados
interface CategoryProps {
  category: Document;
  products: Document[];
}

export default function Category({ category, products }: CategoryProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Loading</p>
  }

  return (
    <>
      <h1>{PrismicDOM.RichText.asText(category.data.title)}</h1>

      <ul>
        {products.map(product => {
          return (
            <li key={product.id}>
              <Link href={`/catalog/products/${product.uid}`} >
                <a>
                  {PrismicDOM.RichText.asText(product.data.title)}                    
                </a>                  
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  )
}

//utilizamos quando geramos uma pagina estatica com conteudo dinamico
export const getStaticPaths: GetStaticPaths = async () => {
  //fazendo a requisicao de todas as categorias no prismic
  const categories =  await client().query([
    Prismic.Predicates.at('document.type', 'category'),
  ])

  const paths = categories.results.map(category => {
    return {
      params: { slug: category.uid }
    }
  })

  return {
    paths,
    fallback: true,
  }
};

//consumindo a api utilizando o modelo static site generation
export const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {
  const { slug } = context.params;

  //fazendo a requisicao da categoria no prismic
  const category = await client().getByUID('category', String(slug), {});

  //fazendo a requisicao de produtos no prismic
  const products =  await client().query([
    Prismic.Predicates.at('document.type', 'product'),
    Prismic.Predicates.at('my.product.category', category.id),
  ])

  return {
    props: {
      category,
      products: products.results,
    },
    revalidate: 60,
  }
}
```

<br>
Pagina de produtos (product)<br>

**src/pages/catalog/products/[slug].tsx**
```
import { client } from '@/lib/prismic';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import PrismicDOM from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';
import { Title, ImageClass, DescriptionClass, ContentClass, PriceClass, ContentPriceClass} from '@/styles/pages/Products';

//interface para tipagem
interface ProductProps {
  product: Document;
}

export default function Product({ product }: ProductProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Carregando...</p>
  }

  return (
    <>
    <ContentClass>
      <Title>{PrismicDOM.RichText.asText(product.data.title)}</Title>
      <ImageClass src={product.data.thumbnail.url} width="400" alt="Javascript Fundamentos"/>
      <DescriptionClass dangerouslySetInnerHTML={{ __html: PrismicDOM.RichText.asHtml(product.data.description) }}></DescriptionClass>
      
      <ContentPriceClass>
        <PriceClass>Valor: </PriceClass>
        <p>${product.data.price}</p>
      </ContentPriceClass>      
    </ContentClass>
    </>
  );
}

//utilizamos quando geramos uma pagina estatica com conteudo dinamico
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  }
};

//consumindo a api utilizando o modelo static site generation
export const getStaticProps: GetStaticProps<ProductProps> = async (context) => {
  const { slug } = context.params;

  const product = await client().getByUID('product', String(slug), {});


  return {
    props: {
      product,
    },
    revalidate: 10,
  }
}
```
<br>

Pagina de pesquisa (search)<br>
**src/pages/search.tsx**
```
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react"
import Prismic from 'prismic-javascript';
import PrismicDOM from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';
import { client } from "@/lib/prismic";
import Link from "next/link";

//interface de tipagem
interface SearchProps {
  searchResults: Document[];
}

export default function Search({ searchResults }: SearchProps) {
  const router = useRouter();

  //estado do search
  const [search, setSearch] = useState('');

  //funcao para o formulario
  function handleSearch(e: FormEvent) {
    e.preventDefault(); //evita o reload da tela quando faz a pesquisa

    //rota de pesquisa com query params
    router.push(
      `/search?q=${encodeURIComponent(search)}`
    )

    setSearch(''); //limpar o campo de pesquisa
  }

  return (
    <>
      <form onSubmit={handleSearch}>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} />
        <button type="submit">Pesquisar</button>
      </form>

      <ul>
        {searchResults.map(product => {
          return (
            <li key={product.id}>
              <Link href={`/catalog/products/${product.uid}`} >
                <a>
                  {PrismicDOM.RichText.asText(product.data.title)}                    
                </a>                  
              </Link>
            </li>
          );
        })}
      </ul>
    </>    
  )
}

/*
OBS: 
  Se voce fizer a pesquisa ser renderizada via client side, nao vai ter suas 
  pesquisas indexadas nos motores de buscas por ex: google.com

  Se voce fizer a pesquisa ser renderizada via server side entao as pesquisas
  serao indexadas nos motores de buscas.

  Faca sua escolha!!!
*/

//Funcao de pesquisa (utilizando modelo de server side rendering)
export const getServerSideProps: GetServerSideProps<SearchProps> = async (context) => {  
  const { q } = context.query;  //query params

  //definindo searchresults vazio quando nao houver uma busca
  if (!q) {
    return { props: {searchResults: []}};
  }

  const searchResults = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
    Prismic.Predicates.fulltext('my.product.title', String(q))
  ])

  return {
    props: { searchResults: searchResults.results, }
  }
}
```
<br>

# DEPLOY DA APLICACAO UTILIZANDO A VERCEL
Faca um build da aplicacao
`$ yarn build`


Utilizamos a Vercel para fazer o deploy desse projeto, siga as instrucoes abaixo:
 - Crie uma conta no site de vercel: https://vercel.com/
 - Instale a vercel CLI: `$ yarn global add vercel` ou `$ npm i -g vercel`
 - faca login: `$ vercel login`
 - no diretorio raiz da aplicacao execute: `$ vercel`

**antes de comecar a fazer o upload para o vercel, responda algumas questoes na CLI.**
<blockquote>

? Set up and deploy “~/project/curso-nextjs”? [Y/n]
`Y`

? Link to existing project? [y/N]
`N` or `y`

? What’s your project’s name? 
`"your_project_name"`

? In which directory is your code located? 
`./`

? Want to override the settings? [y/N] 
`y`
</blockquote>













