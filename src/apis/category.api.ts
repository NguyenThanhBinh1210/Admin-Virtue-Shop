import { CategoryList } from '~/types/category.type'
import http from '~/utils/http'

export const getCategories = () => http.get<CategoryList>('/category/get-all')
