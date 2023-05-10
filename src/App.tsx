import { ToastContainer } from 'react-toastify'
import useRouteElements from './useRouteElement'
import 'react-toastify/dist/ReactToastify.css'
const App = () => {
  const routeElements = useRouteElements()

  return (
    <div className='dark:bg-[#13131A] mobile:h-screen'>
      {routeElements}
      <ToastContainer />
    </div>
  )
}

export default App
