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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { realms } from "@/config/realms"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createGameAccount, getGameAccounts } from "@/actions/gameaccount"
import { useEffect } from "react"

type GameAccount = {
  id: number
  username: string
  realmId: number
  realmName: string
  createdAt: string
  hasCharacters: boolean
  banned?: boolean
}

export default function GameAccounts() {
  const [open, setOpen] = React.useState(false)
  const [selectedRealm, setSelectedRealm] = React.useState("")
  const [accounts, setAccounts] = React.useState<GameAccount[]>([])
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(true)
  const [noAccounts, setNoAccounts] = React.useState(false)

  useEffect(() => {
    async function loadAccounts() {
      try {
        const accounts = await getGameAccounts(1)
        setAccounts(accounts)
        setNoAccounts(accounts.length === 0)
      } catch (error) {
        console.error('Failed to load accounts:', error)
      } finally {
        setLoading(false)
      }
    }
    loadAccounts()
  }, [])

  // Log whenever accounts state changes
  useEffect(() => {
  }, [accounts])

  async function handleCreateAccount(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    
    const formData = new FormData(e.currentTarget)
    const username = formData.get("username") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    
    try {
      const result = await createGameAccount(1, username, password, selectedRealm) // Replace 1 with actual masterAccountId
      if (result.success) {
        setOpen(false)
        // Refresh accounts list
        const updatedAccounts = await getGameAccounts(1) // Replace 1 with actual masterAccountId
        setAccounts(updatedAccounts)
      }
    } catch (error) {
      console.error('Failed to create account:', error)
      setError(error instanceof Error ? error.message : 'Failed to create account')
    }
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Game accounts <span className="ml-2 inline-flex h-5 items-center rounded-full border bg-muted px-2 text-xs">{accounts.length}</span></h2>
        <div className="flex items-center gap-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm">
                <Plus className="mr-2 size-4" />
                Create account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Game Account</DialogTitle>
                <DialogDescription>
                  Create a new game account for your selected realm.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="realm">Realm</Label>
                  <Select value={selectedRealm} onValueChange={setSelectedRealm}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select realm" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(realms).map(([id, realm]) => (
                        <SelectItem key={id} value={id}>
                          {realm.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" required />
                </div>
                <Button type="submit" className="w-full">Create Account</Button>
              </form>
            </DialogContent>
          </Dialog>
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
            <TableHead>Realm</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="text-muted-foreground">#{account.id}</TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                      {`${account.username.charAt(0).toUpperCase()}${account.username.slice(1).toLowerCase()}`}
                    {Boolean(account.banned) && (
                      <span className="text-xs text-destructive">Banned</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{account.realmName}</TableCell>
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
                  <MoreVertical className="size-4" />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No accounts found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}