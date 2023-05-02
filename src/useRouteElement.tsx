import * as React from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import AdminLayout from './layouts/AdminLayout'
import Order from './pages/Order'
import Products from './pages/Products'
import ProductAdd from './pages/ProductAdd'
import { AppContext } from './contexts/app.context'
import RegisterLayout from './layouts/RegisterLayout'
import Login from './pages/Login'
import CategoryAdd from './pages/CategoryAdd'
import Categories from './pages/Categories'
import Users from './pages/Users'
import UserDetail from './pages/UserDetail'
import TempPage from './pages/TempPage'
import Chats from './pages/Chats'

function ProtecedRoute() {
  const { isAuthenticated } = React.useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='login' />
}
function RejectedRoute() {
  const { isAuthenticated } = React.useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}
const useRouteElements = () => {
  const routeElements = useRoutes([
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: 'login',
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <ProtecedRoute />,
      children: [
        {
          path: '/',
          index: true,
          element: (
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          )
        },
        {
          path: '/temp',
          element: (
            <AdminLayout>
              <TempPage />
            </AdminLayout>
          )
        },
        {
          path: '/order',
          element: (
            <AdminLayout>
              <Order />
            </AdminLayout>
          )
        },
        {
          path: '/product/list',
          element: (
            <AdminLayout>
              <Products />
            </AdminLayout>
          )
        },
        {
          path: '/product/add',
          element: (
            <AdminLayout>
              <ProductAdd />
            </AdminLayout>
          )
        },
        {
          path: '/product/:id',
          element: (
            <AdminLayout>
              <ProductAdd />
            </AdminLayout>
          )
        },
        {
          path: '/category/add',
          element: (
            <AdminLayout>
              <CategoryAdd />
            </AdminLayout>
          )
        },
        {
          path: '/category/list',
          element: (
            <AdminLayout>
              <Categories />
            </AdminLayout>
          )
        },
        {
          path: '/category/:id',
          element: (
            <AdminLayout>
              <CategoryAdd />
            </AdminLayout>
          )
        },
        {
          path: '/list-user',
          element: (
            <AdminLayout>
              <Users />
            </AdminLayout>
          )
        },
        {
          path: '/user-detail/:id',
          element: (
            <AdminLayout>
              <UserDetail />
            </AdminLayout>
          )
        },
        {
          path: '/chats',
          element: (
            <AdminLayout>
              <Chats />
            </AdminLayout>
          )
        }
      ]
    }
  ])

  return routeElements
}
export default useRouteElements
