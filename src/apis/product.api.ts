import { ProductList } from 'src/types/product.type'
import http from '~/utils/http'

export const getProduct = (params?: unknown) => http.get<ProductList>('/product/get-all', { params })
