import { Apartment } from '@/model/Apartment'
import { ApartmentList } from '@/components/ApartmentList'
import { Layout } from '@/components/Layout'
import { loadApartmentsFromDb } from '@/services/ApartmentService'

interface Props {
  apartments: Apartment[]
  nextPage: number | null
  totalPages: number
}

export default function IndexPage(props: Props) {
  return (
    <Layout>
      <h1>Homepage</h1>
      <ApartmentList apartments={props.apartments} nextPage={props.nextPage} page={1} totalPages={props.totalPages} />
    </Layout>
  )
}

export async function getStaticProps() {
  const result = await loadApartmentsFromDb()
  return {
    props: {
      apartments: result.items,
      nextPage: result.nextPage ? result.nextPage + 1 : null,
      totalPages: result.totalPages,
    },
  }
}
