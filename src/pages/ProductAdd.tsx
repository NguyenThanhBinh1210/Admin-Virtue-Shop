/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useMatch, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { addProduct, getProduct, updateProduct } from '~/apis/admin.api'
import { getCategories } from '~/apis/category.api'
import { Product } from '~/types/product.type'
import FileBase from 'react-file-base64'
export type FormStateType = Omit<Product, '_id' | 'createdAt' | 'updatedAt'>
const ProductAdd = () => {
  const addMatch = useMatch('/product/add')
  const isAddmode = Boolean(addMatch)
  const { id } = useParams()
  const queryClient = useQueryClient()
  const initialFromState: FormStateType = {
    name: '',
    price: 0,
    category: {
      _id: '',
      name: ''
    },
    countInStock: 0,
    description: '',
    discount: 0,
    image: [],
    price_after_discount: 0
  }
  const [formState, setFormState] = useState<FormStateType>(initialFromState)
  const { data: categoriesData } = useQuery({
    queryKey: ['category'],
    queryFn: () => {
      return getCategories()
    }
  })
  const { mutate } = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (body: any) => {
      return addProduct(body)
    }
  })
  useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    enabled: id !== undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any) => {
      setFormState(data.data.data)
    }
  })
  const updateProductMutation = useMutation({
    mutationFn: () => {
      return updateProduct(id, formState as Product)
      // Không thêm product được thì sửa cái dòng này
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['product', id], data)
    }
  })
  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormState((prev) => {
      return {
        ...prev,
        category: {
          _id: event.target.value,
          name: event.target.name
        }
      }
    })
  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isAddmode) {
      mutate(formState, {
        onSuccess: () => {
          setFormState({
            ...initialFromState,
            category: {
              _id: '',
              name: ''
            }
          })
          toast.success('Đã tạo danh mục!')
        }
      })
    } else {
      updateProductMutation.mutate(undefined, {
        onSuccess: () => {
          toast.success(' Đã sửa thành công!')
        }
      })
    }
  }
  return (
    <form className='p-5' onSubmit={handleSubmit}>
      <div className='grid gap-6 mb-6 md:grid-cols-2'>
        <div>
          <label htmlFor='name' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
            Tên sản phẩm
          </label>
          <input
            type='text'
            id='name'
            onChange={(event) =>
              setFormState((prev) => {
                return { ...prev, name: event.target.value }
              })
            }
            value={formState.name}
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            placeholder='Áo thun nam thể thao Essential logo Coolmate'
            required
          />
        </div>
        <div className='grid grid-cols-2 gap-10'>
          <div>
            <label htmlFor='countries' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Select an option
            </label>
            <select
              id='countries'
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              onChange={(e) => handleChangeSelect(e)}
              value={formState?.category?._id}
            >
              <option defaultValue={''}>Chọn danh mục</option>
              {categoriesData?.data.data &&
                categoriesData?.data.data.map((item) => (
                  <option value={item._id} key={item._id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor='discount' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Giảm giá
            </label>
            <input
              type='number'
              id='discount'
              onChange={(event) =>
                setFormState((prev) => {
                  return { ...prev, discount: Number(event.target.value) }
                })
              }
              value={formState.discount}
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='%'
              required
            />
          </div>
        </div>
        <div className='grid grid-cols-2 gap-x-10'>
          <div>
            <label htmlFor='price' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Giá
            </label>
            <input
              type='number'
              id='price'
              onChange={(event) =>
                setFormState((prev) => {
                  return { ...prev, price: Number(event.target.value) }
                })
              }
              value={formState.price}
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='vnđ'
              required
            />
          </div>
          <div>
            <label htmlFor='countInStock' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Số lượng
            </label>
            <input
              type='number'
              id='countInStock'
              onChange={(event) =>
                setFormState((prev) => {
                  return { ...prev, countInStock: Number(event.target.value) }
                })
              }
              value={formState.countInStock}
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='cái'
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor='description' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
            Mô tả sản phẩm
          </label>
          <textarea
            id='description'
            rows={4}
            onChange={(event) =>
              setFormState((prev) => {
                return { ...prev, description: event.target.value }
              })
            }
            value={formState.description}
            className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            placeholder='...'
          />
        </div>

        <div className=''>
          <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white' htmlFor='file_input'>
            Upload file
          </label>
          <div className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
            <FileBase
              type='file'
              name='picture'
              onDone={(base64: any) => {
                const listBase = base64.map((item: { base64: unknown }) => {
                  return item.base64
                })
                setFormState((prev) => {
                  return { ...prev, image: listBase }
                })
              }}
              multiple={true}
              accept='image/png, image/jpg, image/webp'
            />
          </div>
        </div>
      </div>
      <button
        type='submit'
        className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
      >
        {isAddmode ? 'Add' : 'Confirm'}
      </button>
    </form>
  )
}

export default ProductAdd
