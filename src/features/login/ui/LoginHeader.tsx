import Image from "next/image";

export function AuthHeader() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <Image
          src="/sentinel-logo1.webp"
          alt="Sentinel"
          width={80}
          height={80}
          className="rounded-full"
        />
      </div>
      <h1 className="text-3xl font-bold text-gray-900">Sentinel</h1>
      <p className="text-gray-600 mt-2">System Monitoring Platform</p>
    </div>
  );
}