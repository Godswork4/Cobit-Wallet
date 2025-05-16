"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  generateMnemonic,
  createWalletFromMnemonic,
  storeWallet,
} from "@/lib/wallet";
import { useWallet } from "@/contexts/WalletContext";
import { Shield, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import React from "react";

export default function CreateWalletPage() {
  const router = useRouter();
  const { refreshWallet } = useWallet();
  const [step, setStep] = useState(1);
  const [mnemonic, setMnemonic] = useState(generateMnemonic());
  const [confirmed, setConfirmed] = useState(false);
  const [verificationWords, setVerificationWords] = useState<string[]>([]);
  const [selectedIndices] = useState(() => {
    const indices = [];
    while (indices.length < 3) {
      const index = Math.floor(Math.random() * 24);
      if (!indices.includes(index)) indices.push(index);
    }
    return indices.sort((a, b) => a - b);
  });

  const words = mnemonic.split(" ");

  const handleCopyMnemonic = () => {
    navigator.clipboard.writeText(mnemonic);
    toast.success("Mnemonic phrase copied to clipboard");
  };

  const handleRegenerateMnemonic = () => {
    setMnemonic(generateMnemonic());
    setConfirmed(false);
  };

  const handleVerificationWordChange = (index: number, value: string) => {
    const newWords = [...verificationWords];
    newWords[index] = value;
    setVerificationWords(newWords);
  };

  const handleCreateWallet = async () => {
    const isValid = selectedIndices.every(
      (index, i) =>
        verificationWords[i]?.toLowerCase() === words[index]?.toLowerCase()
    );

    if (!isValid) {
      toast.error("Incorrect verification words. Please try again.");
      return;
    }

    try {
      const keypair = await createWalletFromMnemonic(mnemonic);
      storeWallet({
        publicKey: keypair.publicKey.toBase58(),
        mnemonic: mnemonic,
      });
      await refreshWallet();
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to create wallet. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-500 to-orange-600 p-4">
      <div className="max-w-md mx-auto pt-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Create New Wallet
        </h1>
        <p className="text-white text-opacity-80 mb-6">
          Follow these steps to create your secure wallet
        </p>

        {step === 1 && (
          <Card className="p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mx-auto mb-6">
              <Shield className="w-8 h-8 text-orange-500" />
            </div>

            <h2 className="text-xl font-semibold text-center mb-4">
              Secret Recovery Phrase
            </h2>

            <Alert className="mb-4 bg-orange-50 border-orange-200">
              <AlertDescription>
                Write down these 24 words in order and keep them safe. Never
                share them with anyone.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {words.map((word, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-2 rounded text-sm font-mono flex items-center"
                >
                  <span className="text-gray-500 mr-2">{index + 1}.</span>
                  {word}
                </div>
              ))}
            </div>

            <div className="flex gap-2 mb-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCopyMnemonic}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleRegenerateMnemonic}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate New
              </Button>
            </div>

            <div className="flex items-center space-x-2 mb-6">
              <Checkbox
                id="confirmed"
                checked={confirmed}
                onCheckedChange={(checked) => setConfirmed(checked as boolean)}
              />
              <label
                htmlFor="confirmed"
                className="text-sm text-gray-600 leading-none"
              >
                I have written down my recovery phrase and stored it securely
              </label>
            </div>

            <Button
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={!confirmed}
              onClick={() => setStep(2)}
            >
              Continue
            </Button>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-center mb-4">
              Verify Recovery Phrase
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Please enter the following words from your recovery phrase to
              verify you have saved it correctly.
            </p>

            <div className="space-y-4 mb-6">
              {selectedIndices.map((wordIndex, index) => (
                <div key={wordIndex} className="flex items-center">
                  <span className="text-sm text-gray-500 w-20">
                    Word #{wordIndex + 1}:
                  </span>
                  <Input
                    value={verificationWords[index] || ""}
                    onChange={(e) =>
                      handleVerificationWordChange(index, e.target.value)
                    }
                    placeholder={`Enter word #${wordIndex + 1}`}
                  />
                </div>
              ))}
            </div>

            <Button
              className="w-full bg-orange-500 hover:bg-orange-600"
              onClick={handleCreateWallet}
              disabled={
                verificationWords.length !== 3 ||
                verificationWords.some((w) => !w)
              }
            >
              Create Wallet
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
