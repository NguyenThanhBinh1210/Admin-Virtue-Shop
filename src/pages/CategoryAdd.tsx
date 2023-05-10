/* eslint-disable @typescript-eslint/no-explicit-any */
import { AddCategory, getCategory, updateCategory } from '~/apis/admin.api'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useMatch, useParams } from 'react-router-dom'
import { Category } from '~/types/category.type'
import { useState } from 'react'
import { getAllCategory } from '~/apis/category.api'
import DropdownMenu from '~/components/DropdownMenu/DropdownMenu'

type FormStateType = Omit<Category, '_id'>
const CategoryAdd = () => {
  const initialFromState: FormStateType = {
    name: ''
  }
  const [formState, setFormState] = useState<FormStateType>(initialFromState)
  const initial = { name: '', _id: '' }
  const [parentCategory, setParentCategory] = useState(initial)
  const addMatch = useMatch('/category/add')
  const isAddmode = Boolean(addMatch)
  const { id } = useParams()
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: (body: any) => {
      return AddCategory(body)
    }
  })

  useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategory(id),
    enabled: id !== undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any) => {
      // console.log(data.data.data.parentId)
      setParentCategory(data.data.data.parentId)
      setFormState(data.data.data)
    }
  })
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      const body = {}
      return getAllCategory(body)
    }
  })
  const updateCategoryMutation = useMutation({
    mutationFn: (body: any) => {
      return updateCategory(id, body)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['category', id], data)
    }
  })
  const handleChange = (name: keyof FormStateType) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [name]: event.target.value }))
  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body: {
      name?: string
      parent_id?: string
    } = {
      name: formState.name
    }
    if (parentCategory !== undefined) {
      body.parent_id = parentCategory._id
    }
    if (isAddmode) {
      mutate(body, {
        onSuccess: () => {
          setFormState(initialFromState)
          queryClient.invalidateQueries({ queryKey: ['categories'] })
          toast.success('Đã tạo danh mục!')
        }
      })
    } else {
      updateCategoryMutation.mutate(body, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['categories'] })
          toast.success(' Đã sửa thành công!')
        }
      })
    }
  }

  return (
    <div className='w-[80%] mx-auto pt-[40px]'>
      <form onSubmit={handleSubmit}>
        <h1 className='mb-3  text-2xl font-bold dark:text-white'>{isAddmode ? 'Thêm danh mục mới' : 'Sửa danh mục'}</h1>
        <div className='grid gap-6 mb-6 md:grid-cols-2 grid-cols-2'>
          <div>
            <label htmlFor='first_name' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Tên danh mục sản phẩm
            </label>
            <input
              type='text'
              id='first_name'
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder=''
              required
              value={formState.name}
              onChange={handleChange('name')}
            ></input>
          </div>
          <div>
            <label htmlFor='first_name' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Tên danh mục cha
            </label>
            <div className='bg-gray-50 border h-[41px] border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
              {parentCategory?.name}
            </div>
          </div>
        </div>
        <div>
          <h2 className='mb-2'>Danh sách danh mục cha</h2>
          <div className='grid grid-cols-4 gap-y-3 gap-x-40 tablet:gap-x-10 mb-10 tablet:grid-cols-3'>
            {categories?.data.data
              .filter((item: any) => item.id !== id)
              .map((node: any) => (
                <DropdownMenu key={node.id} node={node} setParentCategory={setParentCategory} />
              ))}
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
    </div>
  )
}

export default CategoryAdd
