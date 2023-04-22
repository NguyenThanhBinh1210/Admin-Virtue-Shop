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
  const { mutate } = useMutation({
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
        className='relative w-full inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"'
      >
        <span className='relative w-full px-5 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0'>
          {isAddmode ? 'Thêm' : 'Xác nhận'}
        </span>
      </button>
    </form>
  )
}

export default ProductAdd
