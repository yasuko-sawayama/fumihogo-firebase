import { DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore'

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const getTimestampString = (
  doc: QueryDocumentSnapshot | DocumentSnapshot
): string => doc.data()?.timestamp?.toDate()?.toLocaleString('ja-JP') || ''
