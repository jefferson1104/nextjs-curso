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