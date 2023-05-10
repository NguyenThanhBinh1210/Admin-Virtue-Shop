/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { deleteChatResult, updateChatResult } from '~/apis/chat.api'
import { ChatType } from '~/types/chat.type'

interface Props {
  item: ChatType
  chatHasResult: any
  index: number
  setChatHasResult: any
}
const ChatItem = ({ item }: Props) => {
  const [dataResult, setDataResult] = useState(item)
  const [show, setShow] = useState(false)
  const [height, setHeight] = useState('0')
  const ref = useRef<any>(null)
  useEffect(() => {
    if (show) {
      setHeight(`${ref.current.scrollHeight}px`)
    } else {
      setHeight('0')
    }
  }, [show])
  const queryClient = useQueryClient()
  const [chipState, setChip] = useState('')
  const updateResultMutation = useMutation({
    mutationFn: (data: any) => {
      return updateChatResult(data.id, data.body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] })
      setChip('')
    }
  })
  const deleteMutation = useMutation({
    mutationFn: (id?: string) => {
      return deleteChatResult(id)
    },
    onSuccess: (data) => {
      toast.success(data.data.message)
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    }
  })
  const handleSubmit = (id?: string) => {
    const resultIndex = item.includes
    const newData = [...resultIndex, chipState]
    const data = {
      id: id,
      body: { ...item, includes: newData, result: item.result }
    }
    updateResultMutation.mutate(data)
  }
  const handleSubmitResult = () => {
    const data = {
      id: item._id,
      body: dataResult
    }
    updateResultMutation.mutate(data)
  }
  const handleChange = (e: any) => {
    const newResultIndex = {
      ...item,
      includes: item.includes,
      result: e.target.value
    }
    setDataResult(newResultIndex)
  }
  const handleClickDelete = (index: any) => {
    const newIncludes = item.includes.filter((_: any, i: number) => i !== index)
    const data = {
      id: item._id,
      body: { ...dataResult, includes: newIncludes }
    }
    updateResultMutation.mutate(data)
  }
  const handleRemove = () => {
    deleteMutation.mutate(item?._id)
  }
  return (
    <div key={item._id} className='shadow-md p-3 dark:text-white cursor-pointer mb-2 overflow-hidden'>
      <div>Id: {item._id?.slice(0, 8)}...</div>
      <button onClick={() => setShow(!show)} className='w-full'>
        <div className='flex justify-between items-start'>
          <div className='w-[300px] text-left'>
            {item.result !== '' && <span>Trả lời: {item.result}</span>}
            {item.result === '' && <span>Câu hỏi: {item.includes[0]}</span>}
          </div>
          <svg
            className={`w-6 transition-all h-6 ${!show ? '' : '-rotate-180'}`}
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </div>
      </button>

      <div style={{ height }} ref={ref} className={`transition-height duration-300 ease-in-out  `}>
        <div className={`flex gap-x-2 items-center justify-between my-2 ${show ? 'visible' : 'invisible'}`}>
          <input
            type='text'
            placeholder='Nhập câu trả lời!'
            className='border rounded p-2 flex-1 w-[300px] dark:text-black'
            value={dataResult.result}
            onChange={handleChange}
          />
          <button
            onClick={handleSubmitResult}
            className='focus:outline-none text-white bg-purple-700 hover:bg-purple-800  font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900'
          >
            Sửa
          </button>
        </div>
        {item.includes.map((item: any, index: number) => (
          <span
            key={index}
            id='badge-dismiss-indigo'
            className='inline-flex mb-2 items-center px-2 py-1 mr-2 text-sm font-medium text-indigo-800 bg-indigo-100 rounded dark:bg-indigo-900 dark:text-indigo-300'
          >
            {item}
            <button
              onClick={() => handleClickDelete(index)}
              type='button'
              className='inline-flex items-center p-0.5 ml-2 text-sm text-indigo-400 bg-transparent rounded-sm hover:bg-indigo-200 hover:text-indigo-900 dark:hover:bg-indigo-800 dark:hover:text-indigo-300'
              data-dismiss-target='#badge-dismiss-indigo'
              aria-label='Remove'
            >
              <svg
                aria-hidden='true'
                className='w-3.5 h-3.5'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='sr-only'>Remove badge</span>
            </button>
          </span>
        ))}
        <div className='flex gap-x-2 items-center my-2 justify-between'>
          <input
            type='text'
            placeholder='Thêm câu hỏi!'
            className='border rounded p-2 flex-1 w-[300px]'
            value={chipState}
            onChange={(e) => setChip(e.target.value)}
          />
          <button
            onClick={() => handleSubmit(item._id)}
            className='focus:outline-none text-white bg-purple-700 hover:bg-purple-800  font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900'
          >
            Thêm
          </button>
        </div>
        <div className='flex justify-between'>
          <div></div>
          <button
            onClick={handleRemove}
            className='focus:outline-none ml-auto text-white bg-pink-700 hover:bg-pink-800  font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-900'
          >
            Xoá
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatItem
