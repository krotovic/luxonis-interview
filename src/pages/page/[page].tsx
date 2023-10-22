import { loadApartmentsFromDb, getTotalApartmentsFromDb } from '@/services/ApartmentService'
import { Apartment } from '@/model/Apartment'
import { Layout } from '@/components/Layout'
import { ApartmentList } from '@/components/ApartmentList'

interface PageParams {
  page: number
}

interface Props {
  params: PageParams
  apartments: Apartment[]
  nextPage: number | null
  previousPage: number | null
  totalPages: number
}

export default function Page(props: Props) {
  return (
    <Layout>
      <h1>Page {props.params.page}</h1>
      <ApartmentList
        apartments={props.apartments}
        page={props.params.page}
        totalPages={props.totalPages}
        nextPage={props.nextPage}
        previousPage={props.previousPage}
      />
    </Layout>
  )
}

export async function getStaticPaths() {
  const [, totalPages] = await getTotalApartmentsFromDb()
  const paths = Array.from({ length: totalPages }, (_, i) => ({ params: { page: String(i + 1) } }))
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params: PageParams }) {
  const page = Number(params.page)
  const result = await loadApartmentsFromDb(page)
  return {
    props: {
      params: { page },
      apartments: result.items,
      nextPage: result.nextPage,
      previousPage: result.previousPage,
      totalPages: result.totalPages,
      total: result.total,
    },
  }
}
