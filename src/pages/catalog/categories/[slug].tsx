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