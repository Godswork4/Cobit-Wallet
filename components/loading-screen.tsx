import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-400 to-orange-600">
      <div className="w-24 h-24 mb-4">
        <div className="relative w-24 h-24 animate-spin rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full"></div>
        </div>
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">Cobit</h1>
      <p className="text-white text-opacity-80">Bitcoin on Solana</p>
    </div>
  );
}