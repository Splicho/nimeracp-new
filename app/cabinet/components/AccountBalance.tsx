import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Coins, Ellipsis, Plus } from 'lucide-react'
import Link from 'next/link'

import React from 'react'

function AccountBalance() {
  return (
    <div className="p-6 flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">Account Balance</div>
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 p-0">
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href="/cabinet/account-balance/deposit" className="flex items-center gap-2">
                <Plus size={16} />
                Top up
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex gap-2 items-center">
        <Coins size={24} className="text-primary" />
        <div className="text-lg font-semibold">1000</div>
      </div>
    </div>
  )
}

export default AccountBalance