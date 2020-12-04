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