import { Category } from 'src/types/category.type'
import { Product } from 'src/types/product.type'
import http from '~/utils/http'

// Category
export const AddCategory = (category?: Omit<Category, '_id'>) => http.post<Category>('/category/create', category)
export const deleteCategory = (id: unknown) => http.delete(`/category/delete/${id}`)
export const getCategory = (id: unknown) => http.get<Category>(`/category/get-details/${id}`)
export const updateCategory = (id: unknown, body: { name: string; parent_id: string }) =>
  http.put<Category>(`/category/update/${id}`, body)

// Product
export const deleteProduct = (id: unknown) => http.delete(`/product/delete/${id}`)
export const addProduct = (product?: any) => http.post(`/product/create/`, product)
export const getProduct = (id: unknown) => http.get<Product>(`/product/get-details/${id}`)
export const updateProduct = (id: unknown, params: any) => http.put<Product>(`/product/update/${id}`, params)

// User
export const getUsers = () => http.get('/user/getAll')
export const deleteUser = (id: unknown) => http.delete(`/user/delete-user/${id}`)

// Purchase
export const getAllPurchases = () => http.get(`/purchase/get-all`)
