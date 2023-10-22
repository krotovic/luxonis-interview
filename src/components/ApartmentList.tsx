import { Apartment } from '@/model/Apartment'
import styles from './ApartmentList.module.css'

interface Props {
  apartments: Apartment[]
  nextPage?: number | null
  previousPage?: number | null
  page: number
  totalPages: number
}

export function ApartmentList(props: Props) {
  return (
    <div className={styles.container}>
      {(typeof props.previousPage === 'number' || typeof props.nextPage === 'number') && (
        <div className={styles.pagination}>
          {props.previousPage ? <a href={`/page/${props.previousPage}`}>Previous page</a> : <div />}
          <span>
            {props.page} / {props.totalPages}
          </span>
          {typeof props.nextPage === 'number' ? <a href={`/page/${props.nextPage}`}>Next page</a> : <div />}
        </div>
      )}
      <ul className={styles.apartmentList}>
        {props.apartments.map((apartment) => (
          <li key={apartment.id} className={styles.apartment}>
            <img src={apartment.image} alt={apartment.title} loading="lazy" />
            <h2>{apartment.title}</h2>
          </li>
        ))}
      </ul>
    </div>
  )
}
