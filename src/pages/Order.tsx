/* eslint-disable @typescript-eslint/no-explicit-any */

import Popover from '~/components/Popover/Popover'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getAllPurchases } from '~/apis/admin.api'
import { changeStatusPurchase } from '~/apis/purchase.api'
import { purchasesStatus } from '~/constants/perchase'
import { FormatNumber } from '~/hooks/useFormatNumber'
import { getProfileFromLS } from '~/utils/auth'
import { getShortString } from '~/utils/utils'

const Order = () => {
  const queryClient = useQueryClient()
  const [toogle, setToogle] = useState(false)
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
  const handleConfirm = (productId: string, purchaseId: string, status: number, on_done = false) => {
    const body: any = { product_id: productId, purchase_id: purchaseId, status: status, on_done }
    updatePurchaseMutation.mutate(body, {
      onSuccess: () => {
        queryClient.invalidateQueries(['purchase-admin'])
      }
    })
  }

  return (
    <div className='p-5'>
      <h1 className='mb-3  text-2xl font-bold dark:text-white'>Danh sách đơn hàng</h1>
      <div className='flex flex-col gap-[30px] rounded-md'>
        <div className='relative overflow-x-auto rounded-md shadow-md sm:rounded-lg'>
          <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th scope='col' className='px-6 py-3 w-[300px]'>
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
            {purchasesForAllUser?.length === 0 && <div>Không có đơn hàng nào!</div>}
            {purchasesForAllUser && (
              <tbody className='overflow-hidden'>
                {purchasesForAllUser.map((item: any) => (
                  <tr
                    key={item._id}
                    className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                  >
                    <th scope='row' className=' px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                      <Popover
                        renderPopover={
                          <div className='border-pink-400 relative p-4 max-w-[400px] rounded-md border  bg-white text-sm shadow-md'>
                            <div>{item.product.name}</div>
                            <div className='flex gap-x-10 mt-5'>
                              {item.product.image.map((item: string, index: number) => (
                                <div key={index}>
                                  <img src={item} alt='' />
                                </div>
                              ))}
                            </div>
                          </div>
                        }
                        placement='bottom-start'
                      >
                        <Link to={`/product/${item.product._id}`}>{getShortString(item.product.name)}</Link>
                      </Popover>
                    </th>
                    <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                      <Popover
                        renderPopover={
                          <div className='border-pink-400 relative p-4 max-w-[400px] rounded-md border  bg-white text-sm shadow-md'>
                            <div className='flex gap-x-2 items-center mb-2'>
                              <img
                                className='w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500'
                                src={item.user?.avatar}
                                alt='Bordered avatar'
                              />
                              <h2 className='font-[600] text-[16px]'>{item.user?.name}</h2>
                            </div>
                            <div
                              className='flex flex-col
                            '
                            >
                              <span>Email: {item.shippingAddress.fullName}</span>
                              <span>Số điện thoại: {item.shippingAddress.phone}</span>
                              <span>Thành phố: {item.shippingAddress.city}</span>
                              <span>Địa chỉ: {item.shippingAddress.address}</span>
                            </div>
                          </div>
                        }
                        placement='bottom-start'
                      >
                        <Link to={`/user-detail/${item.user?._id}`}>{item.user?.name}</Link>
                      </Popover>
                    </th>
                    <td className='px-6 py-4'>{FormatNumber(item.product.price_after_discount * item.buy_count)}đ</td>
                    <td className='px-6 py-4'>
                      {item?.status === 1 && (
                        <span className='bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300'>
                          Chờ xác nhận
                        </span>
                      )}
                      {item?.status === 3 && (
                        <span className='bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300'>
                          Chờ lấy hàng
                        </span>
                      )}
                      {item?.status === 2 && (
                        <span className='bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300'>
                          Đang gửi hàng
                        </span>
                      )}
                      {item?.status === 4 && (
                        <span className='bg-purple-100 text-purple-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300'>
                          Đã nhận hàng
                        </span>
                      )}
                      {item?.status === 5 && (
                        <span className='bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300'>
                          Đã huỷ
                        </span>
                      )}
                    </td>
                    <td className={`px-6 py-4 ${item?.isPaid ? 'text-primary' : 'text-red-300'}`}>
                      {item?.isPaid === true ? (
                        <span className='bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-indigo-400 border border-indigo-400'>
                          Rồi
                        </span>
                      ) : (
                        <span className='bg-pink-100 text-pink-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-pink-400 border border-pink-400'>
                          Chưa
                        </span>
                      )}
                    </td>
                    <td className='px-6 py-4 flex gap-x-[10px]'>
                      {item?.status === 1 && (
                        <button
                          onClick={() => handleConfirm(item?.product._id, item._id, purchasesStatus.inProgress)}
                          className='relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"'
                        >
                          <span className='relative px-5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0'>
                            Nhận đơn
                          </span>
                        </button>
                      )}
                      {item?.status === 3 && (
                        <button
                          onClick={() => handleConfirm(item?.product._id, item._id, purchasesStatus.waitForGetting)}
                          className='relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800'
                        >
                          <span className='relative px-5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0'>
                            Gửi đi
                          </span>
                        </button>
                      )}
                      {/* {item?.status === 2 && <button className=''>Chờ nhận hàng</button>} */}
                      {item?.status === 4 && item?.isPaid === false && (
                        <button
                          onClick={() => handleConfirm(item?.product._id, item._id, purchasesStatus.delivered, true)}
                          className='relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800'
                        >
                          <span className='relative px-5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0'>
                            Đã thanh toán
                          </span>
                        </button>
                      )}
                      {/* {item?.status === 4 && item?.isPaid === true && (
                        <span className='bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300'>
                          Xong
                        </span>
                      )} */}
                      {item?.status === 5 && (
                        <Popover
                          renderPopover={
                            <div className='relative border-pink-400 p-4 max-w-[400px] rounded-md border  bg-white text-sm shadow-md'>
                              {item?.reasonCancel}
                            </div>
                          }
                          placement='bottom'
                        >
                          <div>
                            <button
                              onClick={() => setToogle(!toogle)}
                              className='relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800'
                            >
                              <span className='relative px-5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0'>
                                Lý do huỷ
                              </span>
                            </button>
                          </div>
                        </Popover>
                      )}
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
    </div>
  )
}

export default Order
