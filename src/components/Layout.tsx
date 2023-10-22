import cn from 'classnames'
import { ReactNode } from 'react'
import styles from './Layout.module.css'
import { Roboto } from 'next/font/google'

const nextFont = Roboto({ weight: ['400', '500'], subsets: ['latin'] })

interface Props {
  children: ReactNode
}

export function Layout(props: Props) {
  return <main className={cn(styles.container, nextFont.className)}>{props.children}</main>
}
