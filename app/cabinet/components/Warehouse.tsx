import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Eye, Ellipsis } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Icon } from '@iconify/react'
function Warehouse() {
  return (
    <div className="p-6 flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">Warehouse</div>
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 p-0">
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href="#" className="flex items-center gap-2">
                <Eye size={16} />
                View items
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex gap-2 items-center">
        <div className="text-lg font-semibold flex items-center gap-2">
            <Icon icon="game-icons:pocket-bow" className="size-6 text-primary" />
            32
            </div>
      </div>
    </div>
  )
}

export default Warehouse