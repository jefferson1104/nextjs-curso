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