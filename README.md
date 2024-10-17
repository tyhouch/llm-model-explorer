# LLM Lens: Model Explorer

**LLM Lens: Model Explorer** is a web-based application designed to help users discover, analyze, and determine the compatibility of large language models (LLMs) from Hugging Face with their hardware configurations. It simplifies the process of selecting models that can run efficiently on your system by providing detailed compatibility assessments.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [How It Works](#how-it-works)
  - [Compatibility Calculation](#compatibility-calculation)
    - [1. Format Compatibility](#1-format-compatibility)
    - [2. Quantization Compatibility](#2-quantization-compatibility)
    - [3. Memory Requirements](#3-memory-requirements)
      - [a. Estimating Bytes Per Parameter](#a-estimating-bytes-per-parameter)
      - [b. Estimating Number of Parameters](#b-estimating-number-of-parameters)
      - [c. Estimating Model Memory](#c-estimating-model-memory)
      - [d. Estimating Total Required Memory](#d-estimating-total-required-memory)
      - [e. Comparing to Available Memory](#e-comparing-to-available-memory)
    - [Assumptions Made](#assumptions-made)
    - [Example Calculation](#example-calculation)
- [Installation](#installation)
- [Usage](#usage)
---

## Features

- **Model Search**: Search for models hosted on Hugging Face based on keywords.
- **Detailed Model Information**: View comprehensive details about each model, including size, formats, quantizations, and more.
- **Hardware Configuration**:
  - Select from predefined hardware profiles or input a custom configuration.
  - Specify total system RAM, GPU memory per GPU, number of GPUs, supported formats, and quantizations.
- **Compatibility Assessment**: Determine if a model is compatible with your hardware configuration.
- **Interactive UI**: User-friendly interface with tooltips and explanations to guide you through technical concepts.
- **Compatibility Explanation**: Understand how compatibility is calculated with detailed explanations and example calculations.

---

## How It Works

### Compatibility Calculation

The application determines compatibility between a model and your hardware based on several factors:

#### 1. Format Compatibility

The model's format (e.g., `safetensors`, `GGUF`) must be supported by your hardware. Certain formats may require specific libraries or hardware capabilities.

#### 2. Quantization Compatibility

The model's quantization level (e.g., `FP16`, `Q4_K`) must be supported by your hardware. Quantization reduces the precision of the model's weights to decrease memory usage and computational requirements.

#### 3. Memory Requirements

We estimate the model's memory requirements and compare them to your available GPU and system memory. The calculation involves several steps:

##### a. Estimating Bytes Per Parameter

The number of bytes required per model parameter depends on the quantization level:

- `FP32`: 4 bytes per parameter
- `FP16`: 2 bytes per parameter
- `INT8`, `Q8`: 1 byte per parameter
- `Q4`, `Q4_K`, `Q5`, `Q5_K`, `Q6_K`, `Q2_K`, `Q3_K`: 0.5 bytes per parameter

We determine **bytesPerParam** based on the model's quantization.

##### b. Estimating Number of Parameters

If the model provides the number of parameters, we use that value. Otherwise, we estimate it using the formula:

```
numParams = totalModelSize / bytesPerParam
```

Where:

- **totalModelSize**: The size of the model files (in bytes).
- **bytesPerParam**: As calculated above.

##### c. Estimating Model Memory

The estimated memory required to load the model is:

```
modelMemory = numParams × bytesPerParam
```

##### d. Estimating Total Required Memory

We account for additional memory used during inference (activations, framework overhead) by applying an activation multiplier:

```
totalRequiredMemory = modelMemory × activationMultiplier
```

We use an **activationMultiplier** of 1.5 by default.

##### e. Comparing to Available Memory

We calculate your total available memory:

```
totalAvailableMemory = totalGPUmemory + availableSystemMemory
```

Where:

- **totalGPUmemory**:

  ```
  totalGPUmemory = gpuMemoryPerGPU × numberOfGPUs
  ```

- **availableSystemMemory**:

  ```
  reservedSystemMemory = totalSystemRAM × 0.2
  availableSystemMemory = totalSystemRAM - reservedSystemMemory
  ```

  We reserve 20% of system RAM for the OS and other applications.

If:

```
totalRequiredMemory ≤ totalAvailableMemory
```

The model is considered compatible in terms of memory requirements.

#### Assumptions Made

- **Quantization Impact**: The model's quantization affects the bytes per parameter as outlined above.
- **Activation Memory**: Approximated using an activation multiplier of 1.5.
- **System Memory Reservation**: 20% of system RAM is reserved for the operating system and other applications.
- **Default Quantization**: If the model's quantization information is unavailable, we assume it is an unquantized `FP32` model.
- **Memory Sources**: We consider both GPU and system memory when assessing compatibility.

#### Example Calculation

Suppose you have:

- **GPU Memory per GPU**: 4 GB
- **Number of GPUs**: 1
- **Total System RAM**: 16 GB

And you're assessing a model with:

- **Total Model Size**: 2 GB
- **Quantization**: `FP16`

**Steps:**

1. **Determine bytesPerParam**:

   ```
   bytesPerParam = 2 (since quantization is FP16)
   ```

2. **Estimate numParams**:

   ```
   numParams = totalModelSize / bytesPerParam
   numParams = (2 × 2^30 bytes) / 2 bytes per param
   numParams ≈ 1,073,741,824 parameters
   ```

3. **Calculate modelMemory**:

   ```
   modelMemory = numParams × bytesPerParam
   modelMemory = 1,073,741,824 × 2 bytes
   modelMemory ≈ 2 GB
   ```

4. **Calculate totalRequiredMemory**:

   ```
   totalRequiredMemory = modelMemory × activationMultiplier
   totalRequiredMemory = 2 GB × 1.5
   totalRequiredMemory = 3 GB
   ```

5. **Calculate totalAvailableMemory**:

   ```
   totalGPUmemory = gpuMemoryPerGPU × numberOfGPUs = 4 GB × 1 = 4 GB
   reservedSystemMemory = totalSystemRAM × 0.2 = 16 GB × 0.2 = 3.2 GB
   availableSystemMemory = totalSystemRAM - reservedSystemMemory = 16 GB - 3.2 GB = 12.8 GB
   totalAvailableMemory = totalGPUmemory + availableSystemMemory = 4 GB + 12.8 GB = 16.8 GB
   ```

6. **Compare totalRequiredMemory and totalAvailableMemory**:

   ```
   3 GB ≤ 16.8 GB (True)
   ```

Therefore, the model is considered compatible with your hardware.

---

## Installation

### Prerequisites

- **Node.js** (version 14 or later)
- **npm** or **yarn**

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/llm-lens-model-explorer.git
   cd llm-lens-model-explorer
   ```

2. **Install Dependencies**

   Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

3. **Start the Development Server**

   Using npm:

   ```bash
   npm start
   ```

   Or using yarn:

   ```bash
   yarn start
   ```

4. **Open the Application**

   Navigate to `http://localhost:3000` in your web browser.

---

## Usage

1. **Search for Models**

   - Use the search bar to find models on Hugging Face by keywords.

2. **View Model Details**

   - Click on a model to view detailed information, including size, formats, quantizations, and compatibility status.

3. **Configure Your Hardware**

   - Use the hardware configuration sidebar to select a predefined hardware profile or input your custom hardware specifications.

4. **Assess Compatibility**

   - The application will indicate whether each model is compatible with your hardware configuration.

5. **Understand Compatibility**

   - Click on the "How is compatibility calculated?" link to view a detailed explanation of the compatibility calculation.

---

