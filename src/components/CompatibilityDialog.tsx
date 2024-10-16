// src/components/CompatibilityExplanationDialog.tsx

import React from 'react';

interface CompatibilityExplanationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CompatibilityExplanationDialog: React.FC<CompatibilityExplanationDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">How is compatibility calculated?</h2>
          <p className="mb-4">
            The compatibility between a model and your hardware is determined based on several factors, including format compatibility, quantization compatibility, and memory requirements. Here's a detailed explanation:
          </p>

          <h3 className="text-xl font-semibold mb-2">1. Format Compatibility</h3>
          <p className="mb-4">
            The model's format (e.g., <code>safetensors</code>, <code>GGUF</code>) must be supported by your hardware. For example, certain formats may require specific libraries or hardware capabilities.
          </p>

          <h3 className="text-xl font-semibold mb-2">2. Quantization Compatibility</h3>
          <p className="mb-4">
            The model's quantization level (e.g., <code>FP16</code>, <code>Q4_K</code>) must be supported by your hardware. Quantization reduces the precision of the model's weights to decrease memory usage and computational requirements.
          </p>

          <h3 className="text-xl font-semibold mb-2">3. Memory Requirements</h3>
          <p className="mb-4">
            We estimate the model's memory requirements and compare them to your available GPU and system memory. The calculation involves several steps:
          </p>

          <h4 className="text-lg font-semibold mb-2">a. Estimating Bytes Per Parameter</h4>
          <p className="mb-4">
            The number of bytes required per model parameter depends on the quantization level:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li><code>FP32</code>: 4 bytes per parameter</li>
            <li><code>FP16</code>: 2 bytes per parameter</li>
            <li><code>INT8</code>, <code>Q8</code>: 1 byte per parameter</li>
            <li><code>Q4</code>, <code>Q4_K</code>, <code>Q5</code>, <code>Q5_K</code>, <code>Q6_K</code>, <code>Q2_K</code>, <code>Q3_K</code>: 0.5 bytes per parameter</li>
          </ul>
          <p className="mb-4">
            We determine <strong>bytesPerParam</strong> based on the model's quantization.
          </p>

          <h4 className="text-lg font-semibold mb-2">b. Estimating Number of Parameters</h4>
          <p className="mb-4">
            If the model provides the number of parameters, we use that value. Otherwise, we estimate it using the formula:
          </p>
          <p className="mb-4">
            <code>numParams = totalModelSize / bytesPerParam</code>
          </p>
          <p className="mb-4">
            where <strong>totalModelSize</strong> is the size of the model files, and <strong>bytesPerParam</strong> is as calculated above.
          </p>

          <h4 className="text-lg font-semibold mb-2">c. Estimating Model Memory</h4>
          <p className="mb-4">
            The estimated memory required to load the model is:
          </p>
          <p className="mb-4">
            <code>modelMemory = numParams × bytesPerParam</code>
          </p>

          <h4 className="text-lg font-semibold mb-2">d. Estimating Total Required Memory</h4>
          <p className="mb-4">
            We account for additional memory used during inference (activations, framework overhead) by applying an activation multiplier:
          </p>
          <p className="mb-4">
            <code>totalRequiredMemory = modelMemory × activationMultiplier</code>
          </p>
          <p className="mb-4">
            We use an <strong>activationMultiplier</strong> of 1.5 by default.
          </p>

          <h4 className="text-lg font-semibold mb-2">e. Comparing to Available Memory</h4>
          <p className="mb-4">
            We calculate your total available memory:
          </p>
          <p className="mb-4">
            <code>totalAvailableMemory = totalGPUmemory + availableSystemMemory</code>
          </p>
          <p className="mb-4">
            Where:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li><strong>totalGPUmemory</strong> = <code>gpuMemoryPerGPU × numberOfGPUs</code></li>
            <li><strong>availableSystemMemory</strong> = <code>totalSystemRAM - reservedSystemMemory</code></li>
            <li><strong>reservedSystemMemory</strong> = <code>totalSystemRAM × 0.2</code> (we reserve 20% of system RAM for the OS and other applications)</li>
          </ul>
          <p className="mb-4">
            If <code>totalRequiredMemory ≤ totalAvailableMemory</code>, the model is considered compatible in terms of memory requirements.
          </p>

          <h3 className="text-xl font-semibold mb-2">Assumptions Made</h3>
          <ul className="list-disc list-inside mb-4">
            <li>The model's quantization affects the bytes per parameter as outlined above.</li>
            <li>Activation memory is approximated using an activation multiplier of 1.5.</li>
            <li>20% of system RAM is reserved for the operating system and other applications.</li>
            <li>If the model's quantization information is unavailable, we assume it is an unquantized <code>FP32</code> model.</li>
            <li>We consider both GPU and system memory when assessing compatibility.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">Example Calculation</h3>
          <p className="mb-4">
            Suppose you have:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li><strong>GPU Memory per GPU</strong>: 4 GB</li>
            <li><strong>Number of GPUs</strong>: 1</li>
            <li><strong>Total System RAM</strong>: 16 GB</li>
          </ul>
          <p className="mb-4">
            And you're assessing a model with:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li><strong>Total Model Size</strong>: 2 GB</li>
            <li><strong>Quantization</strong>: <code>FP16</code></li>
          </ul>
          <p className="mb-4">
            Steps:
          </p>
          <ol className="list-decimal list-inside mb-4">
            <li>Determine <strong>bytesPerParam</strong>:
              <ul className="list-disc list-inside ml-6">
                <li><code>bytesPerParam = 2</code> (since quantization is <code>FP16</code>)</li>
              </ul>
            </li>
            <li>Estimate <strong>numParams</strong>:
              <ul className="list-disc list-inside ml-6">
                <li><code>numParams = totalModelSize / bytesPerParam</code></li>
                <li><code>numParams = (2 × 1024<sup>3</sup> bytes) / 2 bytes per param</code></li>
                <li><code>numParams ≈ 1,073,741,824</code> parameters</li>
              </ul>
            </li>
            <li>Calculate <strong>modelMemory</strong>:
              <ul className="list-disc list-inside ml-6">
                <li><code>modelMemory = numParams × bytesPerParam</code></li>
                <li><code>modelMemory = 1,073,741,824 × 2 bytes</code></li>
                <li><code>modelMemory ≈ 2 GB</code></li>
              </ul>
            </li>
            <li>Calculate <strong>totalRequiredMemory</strong>:
              <ul className="list-disc list-inside ml-6">
                <li><code>totalRequiredMemory = modelMemory × activationMultiplier</code></li>
                <li><code>totalRequiredMemory = 2 GB × 1.5</code></li>
                <li><code>totalRequiredMemory = 3 GB</code></li>
              </ul>
            </li>
            <li>Calculate <strong>totalAvailableMemory</strong>:
              <ul className="list-disc list-inside ml-6">
                <li><code>totalGPUmemory = gpuMemoryPerGPU × numberOfGPUs = 4 GB × 1 = 4 GB</code></li>
                <li><code>reservedSystemMemory = totalSystemRAM × 0.2 = 16 GB × 0.2 = 3.2 GB</code></li>
                <li><code>availableSystemMemory = totalSystemRAM - reservedSystemMemory = 16 GB - 3.2 GB = 12.8 GB</code></li>
                <li><code>totalAvailableMemory = totalGPUmemory + availableSystemMemory = 4 GB + 12.8 GB = 16.8 GB</code></li>
              </ul>
            </li>
            <li>Compare <strong>totalRequiredMemory</strong> and <strong>totalAvailableMemory</strong>:
              <ul className="list-disc list-inside ml-6">
                <li><code>3 GB ≤ 16.8 GB</code>, so the model is compatible in terms of memory.</li>
              </ul>
            </li>
          </ol>

          <p className="mb-4">
            Therefore, the model is considered compatible with your hardware.
          </p>

          <div className="p-4 border-t">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityExplanationDialog;
