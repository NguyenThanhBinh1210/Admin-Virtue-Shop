/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useMatch, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getProduct } from '~/apis/admin.api'
import { getCategories } from '~/apis/category.api'
import { Product } from '~/types/product.type'
import FormData from 'form-data'
import axios from 'axios'
import InputNumber from '~/components/InputNumber/InputNumber'

export type FormStateType = Omit<Product, '_id' | 'createdAt' | 'updatedAt'>
const ProductAdd = () => {
  const addMatch = useMatch('/product/add')

  const isAddmode = Boolean(addMatch)
  const { id } = useParams()
  const queryClient = useQueryClient()
  const initialFromState: FormStateType = {
    name: '',
    price: '',
    category: {
      _id: '',
      name: ''
    },
    countInStock: '',
    description: '',
    discount: '',
    image: [],
    images: [],
    price_after_discount: 0
  }
  const [formState, setFormState] = useState<FormStateType>(initialFromState)
  const { data: categoriesData } = useQuery({
    queryKey: ['category'],
    queryFn: () => {
      return getCategories()
    }
  })
  const { mutate, isLoading } = useMutation({
    mutationFn: (body: any) => {
      return axios.post(`http://localhost:5000/api/product/create/`, body)
    }
  })
  useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    enabled: id !== undefined,
    onSuccess: (data: any) => {
      setFormState(data.data.data)
    }
  })
  const updateProductMutation = useMutation({
    mutationFn: (formData: any) => {
      return axios.put(`http://localhost:5000/api/product/update/${id}`, formData)
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
    const formData = new FormData()
    formData.append('name', formState.name)
    formData.append('price', formState.price)
    formData.append('category', formState.category._id)
    formData.append('countInStock', formState.countInStock)
    formData.append('description', formState.description)
    formData.append('discount', formState.discount)
    if (isAddmode) {
      for (let i = 0; i < formState.image.length; i++) {
        formData.append('images', formState.image[i])
      }
      mutate(formData, {
        onSuccess: () => {
          setFormState({
            ...initialFromState,
            category: {
              _id: '',
              name: ''
            }
          })
          toast.success('Đã tạo sản phẩm!')
        }
      })
    } else {
      if (typeof formState.image[0] === 'string') {
        formData.append('image', formState.image)
        updateProductMutation.mutate(formData, {
          onSuccess: () => {
            toast.success(' Đã sửa thành công!')
          }
        })
      } else {
        for (let i = 0; i < formState.image.length; i++) {
          formData.append('images', formState.image[i])
        }
        updateProductMutation.mutate(formData, {
          onSuccess: () => {
            toast.success(' Đã sửa thành công!')
          }
        })
      }
    }
  }

  const handleDeleteImage = (index: number) => {
    const newImages = formState.image.filter((_, indexx) => indexx !== index)
    setFormState((prev) => {
      return {
        ...prev,
        image: newImages
      }
    })
  }
  const [images, setImages] = useState([])

  function handleFilesChange(event: any) {
    const files = event.target.files
    const newImages: any = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const reader = new FileReader()

      reader.onload = function (e: any) {
        const imageData = e.target.result
        newImages.push(imageData)
        // kiểm tra xem đã đọc xong tất cả các tệp chưa
        if (newImages.length === files.length) {
          setImages(newImages)
        }
      }

      reader.readAsDataURL(file)
    }
  }
  const data = categoriesData?.data.data?.filter((item: any) => item.parentId)
  return (
    <form className='p-5' onSubmit={handleSubmit}>
      <h1 className='mb-3  text-2xl font-bold dark:text-white'>{isAddmode ? 'Thêm sản phẩm mới' : 'Sửa sản phẩm'}</h1>
      <div className={`grid gap-6 md:grid-cols-2 ${formState.image.length === 0 ? 'mb-6' : ''}`}>
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
              {data &&
                data.map((item) => (
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
            <InputNumber
              placeholder='vnđ'
              classNameInput='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              onChange={(event) =>
                setFormState((prev) => {
                  return { ...prev, price: Number(event.target.value) }
                })
              }
              value={formState.price}
              required={true}
            ></InputNumber>
          </div>
          <div>
            <label htmlFor='countInStock' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Số lượng
            </label>
            <InputNumber
              placeholder='cái/ chiếc'
              classNameInput='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              onChange={(event) =>
                setFormState((prev) => {
                  return { ...prev, countInStock: Number(event.target.value) }
                })
              }
              value={formState.countInStock}
              required={true}
            ></InputNumber>
            {/* <input
              type='number'
              id='countInStock'
              onChange={(event) =>
                setFormState((prev) => {
                  return { ...prev, countInStock: Number(event.target.value) }
                })
              }
              value={formState.countInStock}
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='cái/ chiếc'
              required
            /> */}
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
        <div className='grid grid-cols-2 gap-x-10'>
          <div className=''>
            <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white' htmlFor='file_input'>
              Upload file
            </label>
            <div className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
              <input
                type='file'
                multiple={true}
                onChange={(e) => {
                  setFormState((prev: any) => {
                    return { ...prev, image: e.target.files }
                  })
                  handleFilesChange(e)
                }}
              />
            </div>
          </div>
          <div className='flex gap-x-5 mb-2'>
            {typeof formState.image[0] === 'string' &&
              formState.image.map((item, index) => {
                return (
                  <div key={index} className='group/item'>
                    <div className='w-[70px] '>
                      <img src={item} alt='' />
                    </div>

                    <button
                      type='button'
                      onClick={() => handleDeleteImage(index)}
                      className='group/edit mb-2 invisible group-hover/item:visible relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800'
                    >
                      <span className='relative px-5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0'>
                        Xoá
                      </span>
                    </button>
                  </div>
                )
              })}
            {typeof formState.image[0] !== 'string' &&
              images.map((image, index) => (
                <div key={index} className='group/item'>
                  <div className='w-[70px] '>
                    <img src={image} alt='' />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <button
        type='submit'
        disabled={updateProductMutation.isLoading || isLoading}
        className='relative disabled:bg-opacity-70 w-full inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"'
      >
        {updateProductMutation.isLoading || isLoading ? (
          <div className='relative w-full px-5 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0'>
            <svg
              aria-hidden='true'
              role='status'
              className='inline w-4 h-4 mr-3 text-white animate-spin'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='#E5E7EB'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentColor'
              />
            </svg>
            Loading...
          </div>
        ) : (
          <span className='relative w-full px-5 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0'>
            {isAddmode ? 'Thêm' : 'Xác nhận'}
          </span>
        )}
      </button>
    </form>
  )
}

export default ProductAdd
