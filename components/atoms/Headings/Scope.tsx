import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/solid'
import { Scope as ScopeType } from '../../../types'

const scopeText = {
  public: '公開',
  login: 'ログインのみ',
  password: 'パスワード必須',
  list: 'リスト公開',
}

type Props = {
  scope: ScopeType
}

const Scope = ({ scope }: Props) => {
  return (
    <div className="mt-2 flex items-center text-xs text-gray-500">
      {scope === 'public' ? (
        <LockOpenIcon
          className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
          aria-hidden="true"
        />
      ) : (
        <LockClosedIcon
          className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
          aria-hidden="true"
        />
      )}
      公開範囲：
      {scopeText[scope]}
    </div>
  )
}

export default Scope
