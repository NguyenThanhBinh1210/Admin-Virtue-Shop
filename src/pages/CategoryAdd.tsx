import { AddCategory, getCategory, updateCategory } from '~/apis/admin.api'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useMatch, useParams } from 'react-router-dom'
import { Category } from '~/types/category.type'
import { useState } from 'react'

type FormStateType = Omit<Category, '_id'>
const CategoryAdd = () => {
  const initialFromState: FormStateType = {
    name: ''
  }
  const [formState, setFormState] = useState<FormStateType>(initialFromState)
  const addMatch = useMatch('/admin/category/add')
  const isAddmode = Boolean(addMatch)
  const { id } = useParams()
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: (body: FormStateType) => {
      return AddCategory(body)
    }
  })

  useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategory(id),
    enabled: id !== undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any) => {
      setFormState(data.data.data)
    }
  })
  const updateCategoryMutation = useMutation({
    mutationFn: () => {
      return updateCategory(id, formState)
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
    if (isAddmode) {
      mutate(formState, {
        onSuccess: () => {
          setFormState(initialFromState)
          toast.success('Đã tạo danh mục!')
        }
      })
    } else {
      updateCategoryMutation.mutate(undefined, {
        onSuccess: () => {
          toast.success(' Đã sửa thành công!')
        }
      })
    }
  }
  return (
    <div className='w-[80%] mx-auto pt-[40px]'>
      <form onSubmit={handleSubmit}>
        <div className='grid gap-6 mb-6 md:grid-cols-2'>
          <div>
            <label htmlFor='first_name' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              {isAddmode ? 'Thêm' : 'Sửa'} danh mục sản phẩm
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
        </div>
        <button
          type='submit'
          className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        >
          {isAddmode ? 'Add' : 'Confirm'}
        </button>
      </form>
    </div>
  )
}

export default CategoryAdd
