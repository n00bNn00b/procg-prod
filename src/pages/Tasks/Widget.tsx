import { Trash2, Minimize } from "lucide-react"


const Widget = () => {
  return (
    <div className="flex flex-col w-[600px] h-[200px] border rounded-t-lg shadow-sm">
      <div className="flex gap-2 items-center bg-winter-100 h-10 w-full rounded-t-md px-6 justify-end border-b">
        <div className="hover:bg-winter-200 p-1 rounded-md cursor-pointer">
          <Minimize/>
        </div>
        <div className="hover:bg-winter-200 p-1 rounded-md cursor-pointer">
          <Trash2/>
        </div>
      </div>
    </div>
  )
}

export default Widget
