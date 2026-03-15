export default function Dashboard() {
  const user = {
    name: "Satoshi Nakamoto",
    email: "satoshi@bitcoin.org",
    wallet: "0xA34f...9B21",
    avatar: "https://i.pravatar.cc/150?img=12",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-10">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-4">
          <img
            src={user.avatar}
            className="w-24 h-24 rounded-full border-2 border-purple-500 shadow-lg"
          />

          <h1 className="text-2xl font-bold tracking-wide">{user.name}</h1>

          <p className="text-gray-400 text-sm">{user.email}</p>

          <div className="w-full mt-4 bg-black/40 border border-white/10 rounded-lg p-3">
            <p className="text-xs text-gray-400">Wallet</p>
            <p className="font-mono text-sm text-purple-400">{user.wallet}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-xs">NFTs</p>
            <p className="text-xl font-bold">12</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-xs">Tokens</p>
            <p className="text-xl font-bold">3.45 ETH</p>
          </div>
        </div>
      </div>
    </div>
  );
}
