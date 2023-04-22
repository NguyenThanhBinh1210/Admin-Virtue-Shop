import axios from 'axios'
import { useState } from 'react'
import { useMutation } from 'react-query'
import { getProfileFromLS } from '~/utils/auth'
import FormData from 'form-data'

const TempPage = () => {
  const initial = {
    name: '',
    image: File
  }

  const [state, setState] = useState(initial)
  const mutation = useMutation({
    mutationFn: (formData: any) => {
      return axios.put(`http://localhost:5000/api/user/update-user/${getUser._id}`, formData)
    }
  })
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData()
    formData.append('name', state.name)
    formData.append('avatar', state.image)
    e.preventDefault()
    mutation.mutate(formData)
  }
  const getUser = getProfileFromLS()

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        value={state.name}
        onChange={(event) =>
          setState((prev) => {
            return { ...prev, name: event.target.value }
          })
        }
      />
      <input
        type='file'
        multiple={false}
        onChange={(event) =>
          setState((prev: any) => {
            return { ...prev, image: event.target.files[0] }
          })
        }
      />
      <button type='submit'>Submit</button>
    </form>
  )
}

export default TempPage
