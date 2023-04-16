import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from 'react-query'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import Input from '../components/Input/Input'
import { loginAccount } from '~/apis/auth.api'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { AppContext } from '~/contexts/app.context'
import omit from 'lodash/omit'

const schema = yup
  .object({
    email: yup.string().email('Không đúng định dạng email!').required('Chưa nhập email'),
    password: yup
      .string()
      .required('Chưa nhập mật khẩu')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, 'Mật khẩu ít nhất 8 ký tự, 1 số và 1 ký tự đặc biệt!')
  })
  .required()
type FormData = yup.InferType<typeof schema>
const Login = () => {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })
  const navigate = useNavigate()

  const mutation = useMutation((body: Omit<FormData, 'cmd'>) => {
    return loginAccount(body)
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(data, {
      onSuccess: (dataUser) => {
        if (dataUser.data.status === 'ERR') {
          const formError = dataUser.data.message
          setError('email', {
            message: formError,
            type: 'Server'
          })
          setError('password', {
            message: formError,
            type: 'Server'
          })
        }
        if (dataUser.data.status === 'OK') {
          const newUser = omit(dataUser.data.data, ['password', 'isAdmin'])
          setProfile(newUser)
          toast.success('Đăng nhập thành công!')
          setIsAuthenticated(true)
          navigate('/')
        }
      }
    })
  }

  return (
    <div className='h-screen flex items-center justify-center'>
      <div
        className={`dark:bg-[#1C1C24] dark:border-none bg-white border
        z-10  mx-auto w-[556px] mobile:w-[327px] rounded-lg flex flex-col px-[60px] py-[50px] mobile:px-[38px]`}
      >
        <h1 className='text-2xl font-bold mx-auto dark:text-white'>Admin login</h1>
        <form autoComplete='false' onSubmit={handleSubmit(onSubmit)} className='mt-[20px] '>
          <Input
            inputPassword={false}
            register={register}
            errrorMessage={errors.email?.message}
            placeholder={'example@gmail.com'}
            name='email'
          />
          <div className='text-red-300 pt-2 pb-2'>{errors.email?.message ? errors.email?.message : ''}</div>

          <Input
            inputPassword={true}
            register={register}
            errrorMessage={errors.password?.message}
            placeholder={'Password'}
            name='password'
          />
          <div className='text-red-300 pt-2'>{errors.password?.message ? errors.password?.message : ''}</div>

          <button
            type='submit'
            className={`bg-primary text-4 font-[600]  text-white h-[52px] rounded-[10px]  w-full hover:opacity-90`}
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
