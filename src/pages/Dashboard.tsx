/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from 'react-query'
import { getAllPurchases, getUsers } from '~/apis/admin.api'
import { getUserSupend } from '~/apis/purchase.api'
import { Chart } from '~/components/Chart/Chart'
import { FormatNumber } from '~/hooks/useFormatNumber'

const Dashboard = () => {
  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: () => {
      return getUsers()
    }
  })
  const { data: purchaseData } = useQuery({
    queryKey: ['purchase-admin'],
    queryFn: getAllPurchases
  })
  const { data: userSupendData } = useQuery({
    queryKey: ['user-supend'],
    queryFn: getUserSupend
  })
  const purchasesForAllUser = purchaseData?.data.data
    .filter((item: any) => item.isPaid === true)
    .map((item: any) => {
      return {
        price_before_discount: item.price_before_discount,
        buy_count: item.buy_count
      }
    })
  const orderList = purchaseData?.data.data.filter((item: any) => item.status !== -1 && item.status !== 5).reverse()
  const orderLength = purchaseData?.data.data.filter((item: any) => item.status !== -1).length

  const totalPrice = purchasesForAllUser?.reduce((result: any, current: any) => {
    return result + current.price_before_discount * current.buy_count
  }, 0)
  const totalSelled = purchasesForAllUser?.reduce((result: any, current: any) => {
    return result + current.buy_count
  }, 0)
  const dataType = [
    {
      id: 1,
      name: 'Tổng thu nhập',
      data: FormatNumber(totalPrice) + ' đ',
      img: (
        <svg width='70' height='70' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M15 16.3794C15 16.8153 14.8949 17.2259 14.6848 17.6114C14.4825 17.9886 14.179 18.3029 13.7744 18.5543C13.3775 18.7973 12.9066 18.9398 12.3619 18.9817V20H11.6148V18.9691C10.8366 18.8937 10.2101 18.6423 9.73537 18.2149C9.2607 17.779 9.0156 17.1924 9 16.4549H10.751C10.7977 17.0583 11.0856 17.4229 11.6148 17.5486V15.1474C11.0545 14.9966 10.6031 14.8457 10.2607 14.6949C9.9183 14.544 9.62258 14.301 9.37358 13.9657C9.1245 13.6304 9 13.1737 9 12.5954C9 11.8663 9.24128 11.2713 9.72375 10.8103C10.214 10.3493 10.8443 10.0853 11.6148 10.0183V9H12.3619V10.0183C13.109 10.0853 13.7043 10.3284 14.1479 10.7474C14.5992 11.1665 14.8522 11.7447 14.9066 12.4823H13.144C13.1206 12.2393 13.0389 12.0297 12.8988 11.8537C12.7665 11.6693 12.5876 11.5394 12.3619 11.464V13.84C12.9455 13.9993 13.4047 14.1543 13.7393 14.3051C14.0817 14.4476 14.3774 14.6864 14.6264 15.0217C14.8755 15.3486 15 15.8011 15 16.3794ZM10.7043 12.5074C10.7043 12.784 10.7821 13.0103 10.9378 13.1863C11.0934 13.3539 11.3191 13.4922 11.6148 13.6011V11.4263C11.3346 11.4682 11.1128 11.5813 10.9494 11.7657C10.786 11.9501 10.7043 12.1973 10.7043 12.5074ZM12.3619 17.5737C12.6576 17.515 12.8872 17.3851 13.0506 17.184C13.2218 16.9829 13.3074 16.7398 13.3074 16.4549C13.3074 16.1783 13.2256 15.9562 13.0622 15.7886C12.8988 15.621 12.6654 15.4827 12.3619 15.3737V17.5737Z'
            className='fill-gray-500'
          />
        </svg>
      )
    },
    {
      id: 2,
      name: 'Người dùng',
      data: userData?.data.data.length - 1,
      img: (
        <svg
          aria-hidden='true'
          className='flex-shrink-0 w-12 h-12 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd' />
        </svg>
      )
    },
    {
      id: 3,
      name: 'Số lượng bán',
      data: totalSelled,
      img: (
        <svg width={40} height={40} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <g clipPath='url(#clip0_291_1667)'>
            <path
              d='M4.46098 11H2.1C1.49249 11 1 10.5026 1 9.88889V2.11111C1 1.49746 1.49249 1 2.1 1H21.9C22.5075 1 23 1.49746 23 2.11111V9.88889C23 10.5026 22.5075 11 21.9 11H19.8207'
              className='stroke-gray-500'
              strokeWidth={2}
            />
            <path
              d='M19.4286 6H4.57143C4.25583 6 4 6.24551 4 6.54839V22.4516C4 22.7545 4.25583 23 4.57143 23H19.4286C19.7442 23 20 22.7545 20 22.4516V6.54839C20 6.24551 19.7442 6 19.4286 6Z'
              className='stroke-gray-500'
              strokeWidth={2}
            />
            <path
              d='M15 16.3794C15 16.8153 14.8949 17.2259 14.6848 17.6114C14.4825 17.9886 14.179 18.3029 13.7744 18.5543C13.3775 18.7973 12.9066 18.9398 12.3619 18.9817V20H11.6148V18.9691C10.8366 18.8937 10.2101 18.6423 9.73537 18.2149C9.2607 17.779 9.0156 17.1924 9 16.4549H10.751C10.7977 17.0583 11.0856 17.4229 11.6148 17.5486V15.1474C11.0545 14.9966 10.6031 14.8457 10.2607 14.6949C9.9183 14.544 9.62258 14.301 9.37358 13.9657C9.1245 13.6304 9 13.1737 9 12.5954C9 11.8663 9.24128 11.2713 9.72375 10.8103C10.214 10.3493 10.8443 10.0853 11.6148 10.0183V9H12.3619V10.0183C13.109 10.0853 13.7043 10.3284 14.1479 10.7474C14.5992 11.1665 14.8522 11.7447 14.9066 12.4823H13.144C13.1206 12.2393 13.0389 12.0297 12.8988 11.8537C12.7665 11.6693 12.5876 11.5394 12.3619 11.464V13.84C12.9455 13.9993 13.4047 14.1543 13.7393 14.3051C14.0817 14.4476 14.3774 14.6864 14.6264 15.0217C14.8755 15.3486 15 15.8011 15 16.3794ZM10.7043 12.5074C10.7043 12.784 10.7821 13.0103 10.9378 13.1863C11.0934 13.3539 11.3191 13.4922 11.6148 13.6011V11.4263C11.3346 11.4682 11.1128 11.5813 10.9494 11.7657C10.786 11.9501 10.7043 12.1973 10.7043 12.5074ZM12.3619 17.5737C12.6576 17.515 12.8872 17.3851 13.0506 17.184C13.2218 16.9829 13.3074 16.7398 13.3074 16.4549C13.3074 16.1783 13.2256 15.9562 13.0622 15.7886C12.8988 15.621 12.6654 15.4827 12.3619 15.3737V17.5737Z'
              className='fill-gray-500'
            />
          </g>
          <defs>
            <clipPath id='clip0_291_1667'>
              <rect width={24} height={24} fill='white' />
            </clipPath>
          </defs>
        </svg>
      )
    },
    {
      id: 4,
      name: 'Lượt đặt hàng',
      data: orderLength,
      img: (
        <svg
          aria-hidden='true'
          className='flex-shrink-0 w-12 h-12 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            d='M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z'
            clipRule='evenodd'
          />
        </svg>
      )
    }
  ]
  return (
    <div className='p-5 '>
      <h1 className='mb-3  text-2xl font-bold dark:text-white '>Dashboard</h1>
      <div className='grid grid-cols-2 tablet:grid-cols-1 mobile:grid-cols-1 gap-x-10'>
        <div className='grid grid-cols-2 grid-rows-2 gap-10 tablet:gap-5 mobile:gap-5 tablet:mb-10 mobile:mb-5'>
          {dataType.map((item) => (
            <div
              key={item.id}
              className='dark:bg-gray-900 border-pink-400 dark:border-none border rounded-md shadow-md grid grid-cols-3 gap-x-1'
            >
              <div className='flex items-center justify-center'>{item.img}</div>
              <div className='col-span-2 flex gap-y-2 flex-col justify-center items-center'>
                <div className='text-text-color'>{item.name}</div>
                <div className='text-[16px] font-[600] dark:text-white'> {item.data}</div>
              </div>
            </div>
          ))}
        </div>
        <div className='shadow-md border-pink-400 border dark:border-none rounded-md dark:bg-gray-900'>
          <Chart></Chart>
        </div>
      </div>
      <div className='tablet:hidden mobile:hidden grid grid-cols-5 gap-x-10 mt-5 dark:text-white font-bold text-[16px]'>
        <div className='col-span-2'>Top người mua hàng</div>
        <div className='col-span-3'>Danh sách đơn hàng mới nhất</div>
      </div>
      <div className='grid grid-cols-5 tablet:gap-y-5 mobile:gap-y-5 tablet:grid-cols-1 mobile:grid-cols-1 tablet:gap-x-0 mobile:gap-x-0 gap-x-10 mt-3 h-[251px]'>
        <div className='tablet:h-[200px] mobile:h-[200px] border-pink-400 border dark:border-none col-span-2 custom-scrollbar rounded-md relative overflow-x-auto shadow-md sm:rounded-lg'>
          <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th scope='col' className='px-6 py-3'>
                  Tên người dùng
                </th>
                <th scope='col' className='px-6 py-3'>
                  Lượng đặt
                </th>
                <th scope='col' className='px-6 py-3'>
                  Đóng góp
                </th>
              </tr>
            </thead>
            <tbody>
              {userSupendData?.data.map((user: any) => (
                <tr
                  key={user.name}
                  className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                >
                  <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                    {user.name}
                  </th>
                  <td className='px-6 py-4'>{user.buy_count}</td>
                  <td className='px-6 py-4'>{FormatNumber(user.price)} đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='tablet:h-[300px] mobile:h-[300px] border-pink-400 border dark:border-none col-span-3 custom-scrollbar rounded-md relative overflow-x-auto shadow-md sm:rounded-lg'>
          <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th scope='col' className='px-6 py-3'>
                  Order Id
                </th>
                <th scope='col' className='px-6 py-3'>
                  Tên người đặt
                </th>
                <th scope='col' className='px-6 py-3'>
                  Tổng thanh toán
                </th>
                <th scope='col' className='px-6 py-3'>
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {orderList?.map((order: any, index: number) => (
                <tr
                  key={order._id}
                  className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                >
                  <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                    #{Math.ceil(index + Math.random() * 1000)}
                  </th>
                  <td className='px-6 py-4'>{order?.user?.name}</td>
                  <td className='px-6 py-4'>{FormatNumber(order.product.price_after_discount * order.buy_count)}đ</td>
                  <td className='px-6 py-4 tablet:p-0 mobile:p-0'>
                    {order?.status === 1 && (
                      <span className='bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300'>
                        Chờ xác nhận
                      </span>
                    )}
                    {order?.status === 3 && (
                      <span className='bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300'>
                        Chờ lấy hàng
                      </span>
                    )}
                    {order?.status === 2 && (
                      <span className='bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300'>
                        Đang gửi
                      </span>
                    )}
                    {order?.status === 4 && (
                      <span className='bg-purple-100 text-purple-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300'>
                        Đã nhận hàng
                      </span>
                    )}
                    {order?.status === 5 && (
                      <span className='bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300'>
                        Đã huỷ
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
