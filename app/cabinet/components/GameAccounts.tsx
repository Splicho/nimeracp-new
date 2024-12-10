"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Example data type
type GameAccount = {
  id: number
  username: string
  createdAt: string
  hasCharacters: boolean
  banned?: boolean
}

// Example data
const accounts: GameAccount[] = [
  {
    id: 1,
    username: "splicho",
    createdAt: "2022-12-24 16:34:00",
    hasCharacters: false,
  },
  {
    id: 2,
    username: "splicho_alt",
    createdAt: "2022-12-03 12:18:06",
    hasCharacters: false,
  },
  // Add more example data as needed
]

export default function GameAccounts() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Game accounts <span className="ml-2 inline-flex h-5 items-center rounded-full border bg-muted px-2 text-xs">{accounts.length}</span></h2>
        <div className="flex items-center gap-4">
          <Button variant="default" size="sm">
            <Plus className="mr-2 size-4" />
            Create account
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">With characters</Button>
            <Button variant="outline" size="sm">No characters</Button>
            <Button variant="outline" size="sm">All</Button>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell className="text-muted-foreground">#{account.id}</TableCell>
              <TableCell className="font-medium">
                {account.username}
                {account.banned && (
                  <span className="ml-2 text-xs text-destructive">Banned</span>
                )}
              </TableCell>
              <TableCell>{account.createdAt}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                  account.hasCharacters 
                    ? "bg-success/10 text-success" 
                    : "bg-destructive/10 text-destructive"
                }`}>
                  {account.hasCharacters ? "Has characters" : "No characters"}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger className="h-8 w-8 p-0">
                    <MoreVertical className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete account</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}