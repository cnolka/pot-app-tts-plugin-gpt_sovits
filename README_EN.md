# Pot-App GPT-SoVITS Text-to-Speech Plugin

## Plugin Introduction

`pot-app-tts-plugin-gptsovits` is a localized text-to-speech (TTS) plugin specifically designed for Pot-App, based on the advanced GPT-SoVITS voice generation model. This plugin allows users to convert text into natural, expressive speech in a completely offline environment, while supporting multiple languages and customizable voice styles.

## 🛠️Required API Modifications

**Important Notice**: This plugin requires a modified version of the GPT-SoVITS API interface file. Before use, please complete the following steps:

### Prerequisites

1. **Download the modified api_v2.py**:
   - Obtain the modified `api_v2.py` file from the `gpt_sovits_fix/` directory of this project

2. **Replace the original file**:
   - Copy the downloaded `api_v2.py` file to your GPT-SoVITS installation directory
   - Overwrite the original file: `GPT_SoVITS/api_v2.py`
   - 📝Recommended to backup the original file: `cp api_v2.py api_v2.py.bak`

### Modification Details
This modified `api_v2.py` primarily adds the `/tts_json` endpoint, supporting:
- Base64 encoded audio data return
- Standardized JSON response format
- Comprehensive error handling mechanism
- Better Pot-App compatibility

## Key Features

- **Localized Deployment**: All speech synthesis processes are performed locally, eliminating the need for external network services and ensuring user privacy and data security
- **High-Quality Speech Synthesis**: Utilizes the GPT-SoVITS model to generate high-quality voice output that closely resembles human speech
- **Multi-Language Support**: Supports speech synthesis in multiple languages including Chinese, English, Japanese, and more
- **Voice Customization**: Allows users to train and use custom voice models to create unique vocal experiences
- **Easy Integration**: Fully compatible with the Pot-App plugin system, featuring simple installation and flexible configuration

## Installation and Usage

1. **Complete the above API modifications** (mandatory step)
2. Download the latest `.potext` plugin file from the Releases page of this repository
3. Import the plugin into Pot-App and complete the basic configuration
4. Configure the local GPT-SoVITS service address and model parameters
5. Start using high-quality local speech synthesis services

## Technical Implementation

This plugin strictly follows Pot-App's TTS plugin development specifications:

- **Plugin Identifier**: `plugin.com.pot-app.gptsovits`
- **Configuration File**: Complete `info.json` configuration containing all necessary dependencies and language mappings
- **Core Function**: Implements the standard `tts` asynchronous function to handle text-to-speech conversion
- **Tool Integration**: Fully utilizes the toolset provided by Pot-App (HTTP requests, file operations, encryption functions, etc.)

## Open Source Contribution

We welcome developers to participate in the improvement and feature expansion of this plugin. Please follow Pot-App's plugin development specifications to ensure code quality and compatibility.

With this GPT-SoVITS-TTS plugin, Pot-App users can now enjoy enterprise-quality local speech synthesis services without worrying about privacy leaks or network dependencies.

### Acknowledgments

Special thanks to the following projects and developers for their contributions:  
- **GPT-SoVITS** (https://github.com/RVC-Boss/GPT-SoVITS): For their open-source high-quality few-shot voice cloning project, providing powerful support for localized speech synthesis technology.
- **Pot** (https://github.com/pot-app/pot-desktop): For their excellent cross-platform text translation and OCR framework, as well as the open plugin system that enabled the smooth integration and service of this plugin.

---

**Note**: The modified `api_v2.py` file provided by this plugin is derived from the GPT-SoVITS project source code. Original copyright information is retained in accordance with the requirements of the original project's license.