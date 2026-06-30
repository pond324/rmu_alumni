import { FolderOpen } from "lucide-react"

const NoDataFound = () => {
  return (
    <div className="w-full flex flex-col py-36 items-center text-gray-600">
        <FolderOpen size={50}/>
        <p className="text-sm">ไม่พบข้อมูล</p>
    </div>
  )
}
export default NoDataFound