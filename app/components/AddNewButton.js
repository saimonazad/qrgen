import { Plus } from 'lucide-react'

export function AddNewButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center mb-4"
    >
      <Plus className="w-4 h-4 mr-2" />
      Add New
    </button>
  )
}