export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const getTimestampString = (
  doc: QueryDocumentSnapshot | DocumentSnapshot
) => doc.data()?.timestamp?.toDate()?.toLocaleString('ja-JP') || ''