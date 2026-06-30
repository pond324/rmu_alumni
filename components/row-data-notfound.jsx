import { FolderOpen } from "lucide-react"

const RowDataNotFound = ({numCol = 5}) => {
  return (
    <tr>
        <td colSpan={numCol}>
            <div className="flex w-full justify-center py-36 flex-col items-center gap-2 text-gray-600">
                <FolderOpen size={50}/>
                <p className="text-sm">ไม่พบข้อมูล</p>
            </div>
        </td>
    </tr>
  )
}
export default RowDataNotFound