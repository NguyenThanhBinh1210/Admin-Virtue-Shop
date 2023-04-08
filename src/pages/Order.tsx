/* eslint-disable @typescript-eslint/no-explicit-any */

import { divide } from 'lodash'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { getAllPurchases } from '~/apis/admin.api'
import { changeStatusPurchase } from '~/apis/purchase.api'
import { purchasesStatus } from '~/constants/perchase'
import { FormatNumber } from '~/hooks/useFormatNumber'
import { getProfileFromLS } from '~/utils/auth'

const Order = () => {
  const queryClient = useQueryClient()
  const profileAccessToken = getProfileFromLS()
  const { data: purchaseData, isLoading } = useQuery({
    queryKey: ['purchase-admin'],
    queryFn: getAllPurchases
  })
  const purchasesForAllUser = purchaseData?.data.data.filter((item: any) => item.status !== -1)
  const updatePurchaseMutation = useMutation({
    mutationFn: (body: any) => {
      return changeStatusPurchase(profileAccessToken?._id, body)
    },
    onSuccess: () => {
      toast.success('Xác nhận gửi hàng thành công!')
    }
  })
  const handleConfirm = (productId: string, purchaseId: string, status: number) => {
    const body: any = { product_id: productId, purchase_id: purchaseId, status: status }
    updatePurchaseMutation.mutate(body, {
      onSuccess: () => {
        queryClient.invalidateQueries(['purchase-admin'])
      }
    })
  }
  console.log(purchasesForAllUser)
  return (
    <>
      <div className='flex flex-col gap-[30px]'>
        <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
          <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th scope='col' className='px-6 py-3'>
                  Tên sản phẩm
                </th>
                <th scope='col' className='px-6 py-3'>
                  Người mua
                </th>
                <th scope='col' className='px-6 py-3'>
                  Tổng giá
                </th>
                <th scope='col' className='px-6 py-3'>
                  Trạng thái
                </th>
                <th scope='col' className='px-6 py-3'>
                  Thanh toán
                </th>
                <th scope='col' className='px-6 py-3'>
                  Hành động
                </th>
              </tr>
            </thead>
            {purchasesForAllUser?.length === 0 && <div>Khoong co san don hang nao</div>}
            {purchasesForAllUser && (
              <tbody>
                {purchasesForAllUser.map((item: any) => (
                  <tr
                    key={item._id}
                    className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                  >
                    <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                      {item.product.name}
                    </th>
                    <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                      {item.user.name}
                    </th>
                    <td className='px-6 py-4'>{FormatNumber(item.product.price_after_discount * item.buy_count)}đ</td>
                    <td className='px-6 py-4'>
                      {item?.status === 1 && <button>Chờ xác nhận</button>}
                      {item?.status === 3 && <button>Chờ lấy hàng</button>}
                      {item?.status === 2 && <button>Đang gửi</button>}
                      {item?.status === 4 && <button>Đã nhận</button>}
                    </td>
                    <td className='px-6 py-4'>{item?.isPaid === true ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
                    <td className='px-6 py-4 flex gap-x-[10px]'>
                      {item?.status === 1 && (
                        <button
                          onClick={() => handleConfirm(item?.product._id, item._id, purchasesStatus.inProgress)}
                          className='text-red-300 hover:shadow-md'
                        >
                          Nhận đơn
                        </button>
                      )}
                      {item?.status === 3 && (
                        <button
                          onClick={() => handleConfirm(item?.product._id, item._id, purchasesStatus.waitForGetting)}
                          className='text-red-300 hover:shadow-md'
                        >
                          Gửi đi
                        </button>
                      )}
                      {item?.status === 2 && <button className=''>Chờ nhận hàng</button>}
                      {item?.status === 4 && <button className=''>Ẩn đi</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
        {isLoading && (
          <div role='status' className='mx-auto'>
            <svg
              aria-hidden='true'
              className='w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentFill'
              />
            </svg>
            <span className='sr-only'>Loading...</span>
          </div>
        )}
      </div>
    </>
  )
}

export default Order
