import Link from "next/link";
import { Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function RecoverySection() {
  return (
    <div className="mt-6">
      <Separator />
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-3">
          Forgot your root account password?
        </p>
        <Link href="/recovery">
          <Button variant="outline" className="w-full bg-transparent hover:cursor-pointer">
            <Key className="w-4 h-4 mr-2" />
            Recover with PEM Key
          </Button>
        </Link>
      </div>
    </div>
  );
}