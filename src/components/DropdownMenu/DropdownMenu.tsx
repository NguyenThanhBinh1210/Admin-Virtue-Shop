/* eslint-disable @typescript-eslint/no-explicit-any */
import Popover from '../Popover/Popover'

interface Props {
  node: any
  setParentCategory: any
}
const DropdownMenu = ({ node, setParentCategory }: Props) => {
  //   const [isOpen, setIsOpen] = useState(false)
  const hasChildren = node.children.length > 0

  const handleToggle = () => {
    setParentCategory({ name: node.name, _id: node.id })
    // setIsOpen(!isOpen)
  }

  return (
    <div className='relative text-center'>
      <Popover
        renderPopover={
          <div className=' relative max-w-[400px] rounded-md  text-sm'>
            {hasChildren && (
              <div className='mt-2 flex gap-x-2'>
                {node.children.map((childNode: any) => (
                  <DropdownMenu key={childNode.id} node={childNode} setParentCategory={setParentCategory} />
                ))}
              </div>
            )}
          </div>
        }
        placement='bottom'
      >
        <div className='relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800'>
          <span className='relative w-[100px] py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0'>
            <button type='button' onClick={handleToggle}>
              {hasChildren && '[+] '}
              {node.name}
            </button>
          </span>
        </div>
      </Popover>
    </div>
  )
}

export default DropdownMenu
