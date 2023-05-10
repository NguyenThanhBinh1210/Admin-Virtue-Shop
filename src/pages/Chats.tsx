/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { createChatResult, getChatResults } from '~/apis/chat.api'
import ChatItem from '~/components/ChatItem/ChatItem'
import { ChatType } from '~/types/chat.type'

const Chats = () => {
  const [chatHasResult, setChatHasResult] = useState([])
  const [chatNotResult, setChatNotResult] = useState([])
  const [resultState, setResultState] = useState('')
  const [questions, setQuestions] = useState<string[]>([])
  const [chipState, setChipState] = useState('')
  const queryClient = useQueryClient()

  useQuery({
    queryKey: ['chats'],
    queryFn: () => {
      return getChatResults()
    },
    onSuccess: (data) => {
      const chatHasResult = data.data.data.filter((item: ChatType) => item.result)
      const chatNotResult = data.data.data.filter((item: ChatType) => !item.result)
      setChatNotResult(chatNotResult)
      setChatHasResult(chatHasResult)
    }
  })

  const handleClickDelete = (index: number) => {
    const newData = questions.filter((item, i) => i !== index)
    setQuestions(newData)
  }
  const createChatResultMutation = useMutation({
    mutationFn: (data: any) => {
      return createChatResult(data)
    },
    onSuccess: () => {
      toast.success('Đã thêm mẫu câu!')
      queryClient.invalidateQueries({ queryKey: ['chats'] })
      setQuestions([])
      setResultState('')
    },
    onError: (error: any) => {
      toast.warn(error?.response.data.message)
    }
  })
  const handleCreateChat = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = {
      question: questions,
      result: resultState
    }
    createChatResultMutation.mutate(data)
  }
  return (
    <div className='p-5 h-screen'>
      <h1 className='mb-5  text-2xl font-bold dark:text-white '>Quản lý chatbox tự động</h1>
      <div className='grid grid-cols-3 mobile:grid-cols-1 tablet:grid-cols-1 mobile:gap-y-3 tablet:gap-y-3 gap-x-5'>
        <div>
          <h2 className='mb-3  text-xl font-bold dark:text-white'>Thêm mẫu câu</h2>
          <form
            onSubmit={handleCreateChat}
            className='border-pink-400 dark:bg-gray-700 dark:text-white dark:border-none overflow-y-auto border rounded-md shadow-md p-3'
          >
            <div className={`flex gap-x-2 items-center my-2`}>
              <label
                htmlFor='text'
                className='flex flex-col w-full
              '
              >
                <span className='font-[500] '>Câu trả lời</span>
                <input
                  type='text'
                  id='text'
                  className='border rounded p-2 w-full dark:text-black'
                  value={resultState}
                  onChange={(e) => setResultState(e.target.value)}
                />
              </label>
            </div>
            <div>
              <h2>Câu hỏi</h2>
              {questions.map((item: string, index: number) => (
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
              <div className='flex gap-x-2 items-center justify-between'>
                <input
                  type='text'
                  className='border rounded p-2 w-[300px] flex-1 dark:text-black'
                  value={chipState}
                  onChange={(e) => setChipState(e.target.value)}
                />
                <button
                  onClick={() => {
                    if (chipState !== '') {
                      setQuestions((prev) => [...prev, chipState])
                      setChipState('')
                    }
                  }}
                  type='button'
                  className='focus:outline-none text-white bg-purple-700 hover:bg-purple-800  font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900'
                >
                  Thêm
                </button>
              </div>
            </div>
            <button className='relative w-full inline-flex mt-2 items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"'>
              <span className='w-full py-2 relative px-5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0'>
                Thêm
              </span>
            </button>
          </form>
        </div>

        <div>
          <h2 className='mb-3  text-xl font-bold dark:text-white'>Danh sách mẫu câu</h2>
          <div className='max-h-[80vh] dark:bg-gray-700 custom-scrollbar border-pink-400 dark:border-none overflow-y-auto border rounded-md shadow-md p-3'>
            {chatHasResult?.map((item: ChatType, index: number) => (
              <ChatItem
                key={item._id}
                setChatHasResult={setChatHasResult}
                item={item}
                index={index}
                chatHasResult={chatHasResult}
              ></ChatItem>
            ))}
          </div>
        </div>
        <div>
          <h2 className='mb-3  text-xl font-bold dark:text-white'>Danh sách câu hỏi</h2>
          <div className=' border-pink-400 dark:bg-gray-700 dark:border-none overflow-y-auto border rounded-md shadow-md p-3'>
            {chatNotResult.length === 0 && <span className='dark:text-text-color'>Chưa có câu hỏi mới nào!</span>}
            {chatNotResult?.map((item: ChatType, index: number) => (
              <ChatItem
                key={item._id}
                setChatHasResult={setChatNotResult}
                item={item}
                index={index}
                chatHasResult={chatNotResult}
              ></ChatItem>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chats
