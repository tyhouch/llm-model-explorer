// src/types/ModelInfo.ts

export interface ModelInfo {
  id: string;
  author?: string;
  downloads: number;
  tags: string[];
  pipeline_tag?: string;
  lastModified?: string;
  siblings: ModelFile[];
  totalSize: number;
  quantizations: string[];
  formats: string[];
  modelParameters: number; // Number of model parameters
}

export interface ModelFile {
  rfilename: string;
  size: number;
  blobId: string;
  lfs?: {
    sha256: string;
    size: number;
    pointerSize: number;
  };
}

export function analyzeModelFiles(files: ModelFile[]): {
  totalSize: number;
  quantizations: string[];
  formats: string[];
  modelParameters: number;
} {
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const quantizations = new Set<string>();
  const formats = new Set<string>();
  let modelParameters = 0;

  files.forEach(file => {
    const filename = file.rfilename.toLowerCase();

    // Check for quantizations
    const quantMatch = filename.match(/(q[0-9]+[a-z]?)/);
    if (quantMatch) {
      quantizations.add(quantMatch[1].toUpperCase());
    } else if (filename.includes('fp16')) {
      quantizations.add('FP16');
    }

    // Check for formats
    if (filename.endsWith('.safetensors')) {
      formats.add('safetensors');
    } else if (filename.endsWith('.gguf')) {
      formats.add('GGUF');
    }

    // Estimate model parameters if possible
    if (filename.includes('params') && filename.endsWith('.txt')) {
      // Example: parse a file like 'params_6B.txt' to get 6 billion parameters
      const paramsMatch = filename.match(/params_([\d\.]+)([MK]?)\.txt/);
      if (paramsMatch) {
        let params = parseFloat(paramsMatch[1]);
        const multiplier = paramsMatch[2] === 'M' ? 1e6 : paramsMatch[2] === 'K' ? 1e3 : 1e9;
        modelParameters = params * multiplier;
      }
    }
  });

  return {
    totalSize,
    quantizations: Array.from(quantizations),
    formats: Array.from(formats),
    modelParameters,
  };
}
