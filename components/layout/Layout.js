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
        <Sidebar showMobileSidebar={showMobileSidebar} toggleMobileSidebar={toggleMobileSidebar} />

        <div className='grow'>
          <Header toggleMobileSidebar={toggleMobileSidebar} />
          <main className='min-h-screen-minus-nav'>{props.children}</main>
        </div>
      </div>
    </div>
  )
}

export default Layout
