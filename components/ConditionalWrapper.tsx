import { FC } from 'react'

const ConditionalWrapper: FC = ({ wrapper, condition, children }: any) => {
  if (wrapper && !!condition) {
    return wrapper(children)
  }
  return children
}

export default ConditionalWrapper
