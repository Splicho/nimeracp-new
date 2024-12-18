import GameAccounts from "./components/GameAccounts";
import AccountBalance from "./components/AccountBalance";
import Warehouse from "./components/Warehouse";
import AccountCharacters from "./components/AccountCharacters";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-muted/50">
          <AccountBalance />
        </div>
        <div className="rounded-xl bg-muted/50">
          <Warehouse />
        </div>
        <div className="rounded-xl bg-muted/50">
          <AccountCharacters />
        </div>
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <GameAccounts />
      </div>
    </div>
  )
}
