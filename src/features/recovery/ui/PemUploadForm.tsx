// src/features/recovery/ui/PemUploadForm.tsx
"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileKey, Loader2, CheckCircle, XCircle } from "lucide-react";

interface PemUploadFormProps {
  pemContent: string;
  onPemContentChange: (content: string) => void;
  onValidate: () => void;
  isValidating: boolean;
  error: string | null;
}

const PemUploadForm = ({
  pemContent,
  onPemContentChange,
  onValidate,
  isValidating,
  error,
}: PemUploadFormProps) => {
  const [uploadMethod, setUploadMethod] = useState<"file" | "paste">("file");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onPemContentChange(content);
        };
        reader.readAsText(file);
      }
    },
    [onPemContentChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/x-pem-file": [".pem"],
      "application/pkcs8": [".key"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
  });

  return (
    <div className="space-y-6">
      {/* Method Selection */}
      <div className="flex gap-2">
        <Button
          variant={uploadMethod === "file" ? "default" : "outline"}
          onClick={() => setUploadMethod("file")}
          className="flex-1"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload File
        </Button>
        <Button
          variant={uploadMethod === "paste" ? "default" : "outline"}
          onClick={() => setUploadMethod("paste")}
          className="flex-1"
        >
          <FileKey className="w-4 h-4 mr-2" />
          Paste Key
        </Button>
      </div>

      {/* File Upload */}
      {uploadMethod === "file" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upload PEM Key File</CardTitle>
            <CardDescription>
              Upload your private PEM key file to verify your identity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input {...getInputProps()} />
              <FileKey className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              {isDragActive ? (
                <p className="text-blue-600">Drop the PEM file here...</p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">
                    Drag & drop your PEM key file here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports .pem, .key, and .txt files
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paste Key */}
      {uploadMethod === "paste" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Paste PEM Key</CardTitle>
            <CardDescription>
              Paste your private PEM key content directly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
-----END RSA PRIVATE KEY-----"
              value={pemContent}
              onChange={(e) => onPemContentChange(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Validate Button */}
      <Button
        onClick={onValidate}
        disabled={!pemContent.trim() || isValidating}
        className="w-full"
        size="lg"
      >
        {isValidating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Validating PEM Key...
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Validate & Recover Account
          </>
        )}
      </Button>

      {/* Security Notice */}
      <Alert>
        <FileKey className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Notice:</strong> Your PEM key is validated securely.
          The private key content is never stored permanently.
        </AlertDescription>
      </Alert>
    </div>
  );
}

export default PemUploadForm;