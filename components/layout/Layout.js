import Header from '../Header'
import 'react-responsive-modal/styles.css'
import Sidebar from './Sidebar'
import { useState } from 'react'

const Layout = (props) => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar)
  }
  return (
    <div>
      <div className='flex'>
        <div className='md:w-[200px] xl:w-[300px]'>
          <Sidebar showMobileSidebar={showMobileSidebar} />
        </div>
        <div className='grow'>
          <Header toggleMobileSidebar={toggleMobileSidebar} />
          <main className='min-h-screen-minus-nav'>{props.children}</main>
        </div>
      </div>
    </div>
  )
}

export default Layout
