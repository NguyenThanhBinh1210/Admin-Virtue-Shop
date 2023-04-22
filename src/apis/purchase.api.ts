import { Purchase } from 'src/types/purchase.type'
import http from '~/utils/http'

export const changeStatusPurchase = (id: string, body: { product_id: string; purchase_id: string; status: number }) => {
  return http.put<Purchase>(`/purchase/confirm-purchase/${id}`, body)
}
export const getUserSupend = () => {
  return http.get(`/purchase/get-user-supend`)
}

export const deletePurchase = (id: string, purchaseIds: string[]) => {
  return http.delete<{ deleted_count: number }>(`/purchase/delete-purchase/${id}`, {
    data: purchaseIds
  })
}
