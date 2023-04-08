/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getUser, updateUser } from '~/apis/auth.api'
import { User } from '~/types/user.type'

type FormStateType = Omit<User, '_id'>
const UserDetail = () => {
  const initialFromState: FormStateType = {
    name: '',
    email: '',
    phone: 0,
    address: ''
  }
  const [formState, setFormState] = useState<FormStateType>(initialFromState)

  const { id } = useParams()
  const queryClient = useQueryClient()

  useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
    enabled: id !== undefined,
    onSuccess: (data: any) => {
      setFormState(data.data.data)
    }
  })
  const updateCategoryMutation = useMutation({
    mutationFn: () => {
      return updateUser(id, formState)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user', id], data)
    }
  })
  const handleChange = (name: keyof FormStateType) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [name]: event.target.value }))
  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateCategoryMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(' Đã sửa thành công!')
      }
    })
  }
  return (
    <form className='p-6' onSubmit={handleSubmit}>
      <div className='relative z-0 w-full mb-6 group'>
        <input
          type='text'
          name='name'
          id='name'
          className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
          placeholder=' '
          required
          value={formState.name}
          onChange={handleChange('name')}
        />
        <label
          htmlFor='name'
          className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
        >
          Tên đầy đủ
        </label>
      </div>

      <div className='relative z-0 w-full mb-6 group'>
        <input
          type='email'
          name='floating_email'
          id='floating_email'
          className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
          placeholder=' '
          required
          value={formState.email}
          onChange={handleChange('email')}
        />
        <label
          htmlFor='floating_email'
          className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
        >
          Địa chỉ email
        </label>
      </div>
      <div className='grid md:grid-cols-2 md:gap-6'>
        <div className='relative z-0 w-full mb-6 group'>
          <input
            type='number'
            pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
            name='floating_phone'
            id='floating_phone'
            className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
            placeholder=' '
            required
            value={formState.phone}
            onChange={handleChange('phone')}
          />
          <label
            htmlFor='floating_phone'
            className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
          >
            Số điện thoại
          </label>
        </div>
        <div className='relative z-0 w-full mb-6 group'>
          <input
            type='text'
            name='address'
            id='address'
            className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
            placeholder=' '
            required
            value={formState.address}
            onChange={handleChange('address')}
          />
          <label
            htmlFor='address'
            className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
          >
            Địa chỉ
          </label>
        </div>
      </div>
      <button
        type='submit'
        className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
      >
        Confirm
      </button>
    </form>
  )
}

export default UserDetail
