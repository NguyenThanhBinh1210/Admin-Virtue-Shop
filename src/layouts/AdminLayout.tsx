import React from 'react'
import Header from '~/components/Header/Header'
interface Props {
  children?: React.ReactNode
}
const AdminLayout = ({ children }: Props) => {
  return (
    <div>
      <div className='flex dark:bg-gray-800'>
        <Header></Header>
        <div className={`w-[100%]`}>{children}</div>
      </div>
    </div>
  )
}

export default AdminLayout
