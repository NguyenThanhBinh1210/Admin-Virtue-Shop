/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategoryList } from '~/types/category.type'
import http from '~/utils/http'

export const getCategories = () => http.get<CategoryList>('/category/get-all')
export const getAllCategory = (body: any) => http.get('/category/get-all-category', body)
