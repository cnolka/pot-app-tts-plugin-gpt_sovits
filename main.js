async function tts(text, lang, options = {}) {
    const { config, utils } = options;
    const { tauriFetch } = utils;
    
    // 语言映射表
    const languageMap = {
        "zh_cn": "zh",
        "zh_tw": "zh",
        "en": "en",
        "ja": "ja",
        "ko": "ko",
        "fr": "fr",
        "es": "es",
        "ru": "ru",
        "de": "de",
        "it": "it",
        "tr": "tr",
        "pt_pt": "pt",
        "pt_br": "pt",
        "vi": "vi",
        "ms": "ms",
        "ar": "ar",
        "hi": "hi"
    };

    const text_lang = languageMap[lang];
    if (!text_lang) {
        throw "Language not Support!";
    }

    // 改进的默认值处理函数
    function getConfigValue(key, defaultValue) {
        const value = config?.[key];
        if (value === undefined || value === null || value === "" || 
            value === "undefined" || value === "null") {
            console.log(`Using default value for ${key}:`, defaultValue);
            return defaultValue;
        }
        console.log(`Using configured value for ${key}:`, value);
        return value;
    }

    let api_host = getConfigValue('api_host', '127.0.0.1');
    let api_port = getConfigValue('api_port', '9880');
    let gpt_weights_path = getConfigValue('gpt_weights_path', '');
    let sovits_weights_path = getConfigValue('sovits_weights_path', '');
    let ref_audio_path = getConfigValue('ref_audio_path', '');
    let prompt_text = getConfigValue('prompt_text', '');
    let prompt_lang = getConfigValue('prompt_lang', 'zh');
    let top_k = parseInt(getConfigValue('top_k', '5'));
    let top_p = parseFloat(getConfigValue('top_p', '1.0'));
    let temperature = parseFloat(getConfigValue('temperature', '1.0'));
    let text_split_method = getConfigValue('text_split_method', 'cut5');
    let batch_size = parseInt(getConfigValue('batch_size', '1'));
    let batch_threshold = parseFloat(getConfigValue('batch_threshold', '0.75'));
    let split_bucket = getConfigValue('split_bucket', 'true');
    let speed_factor = parseFloat(getConfigValue('speed', '1.0'));
    let streaming_mode = getConfigValue('streaming_mode', 'true');
    let seed = parseInt(getConfigValue('seed', '42'));
    let parallel_infer = getConfigValue('parallel_infer', 'true');
    let repetition_penalty = parseFloat(getConfigValue('repetition_penalty', '1.35'));
    let sample_steps = parseInt(getConfigValue('sample_steps', '32'));
    let super_sampling = getConfigValue('super_sampling', 'false');

    // 构建基础URL和TTS URL
    const base_url = `http://${api_host}:${api_port}`;
    const api_url = `${base_url}/tts_json`;

    // 提取模型切换函数
    async function switchModel(modelType, weightsPath) {
        const endpoint = modelType === 'gpt' ? 'set_gpt_weights' : 'set_sovits_weights';
        const url = `${base_url}/${endpoint}?weights_path=${encodeURIComponent(weightsPath)}`;
        
        try {
            const response = await tauriFetch(url, {
                method: "GET"
            });

            if (!response.ok) {
                throw `${modelType}模型切换失败: ${response.status} - ${response.data?.message || '未知错误'}`;
            }
            
            if (response.data && response.data.message === "success") {
                console.log(`${modelType}模型切换成功`);
                return true;
            } else {
                throw `${modelType}模型切换失败: ${JSON.stringify(response.data)}`;
            }
        } catch (error) {
            throw `切换${modelType}模型时出错: ${error}`;
        }
    }

    // 切换GPT模型
    await switchModel('gpt', gpt_weights_path);
    
    // 切换SoVITS模型
    await switchModel('sovits', sovits_weights_path);

    // 准备TTS请求参数
    const requestBody = {
        text: text,
        text_lang: text_lang,
        ref_audio_path: ref_audio_path,
        prompt_text: prompt_text,
        prompt_lang: prompt_lang,
        top_k: top_k,
        top_p: top_p,
        temperature: temperature,
        text_split_method: text_split_method,
        batch_size: batch_size,
        batch_threshold: batch_threshold,
        split_bucket: split_bucket,
        speed_factor: speed_factor,
        streaming_mode: streaming_mode,
        seed: seed,
        parallel_infer: parallel_infer,
        repetition_penalty: repetition_penalty,
        sample_steps: sample_steps,
        super_sampling: super_sampling
    };

    try {
        // 发送请求到GPT-SoVITS API
        const res = await tauriFetch(api_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: {
                type: "Json",
                payload: requestBody
            }
        });

        if (res.ok) {
            // 直接使用res.data而不是res.json()
            if (res.data && typeof res.data === 'object') {
                // 处理JSON响应（包含base64音频）
                if (res.data.status === "success" && res.data.audio_data) {
                    // 解码base64音频数据
                    const audioData = atob(res.data.audio_data);
                    const audioBytes = new Uint8Array(audioData.length);
                    for (let i = 0; i < audioData.length; i++) {
                        audioBytes[i] = audioData.charCodeAt(i);
                    }
                    return Array.from(audioBytes);
                } else {
                    throw `TTS API Error: ${res.data.message || "Unknown error"}`;
                }
            } else {
                // 处理直接的音频流响应
                // 假设res.data已经是二进制数据
                if (res.data instanceof ArrayBuffer) {
                    const audioBytes = new Uint8Array(res.data);
                    return Array.from(audioBytes);
                } else if (typeof res.data === 'string') {
                    // 如果是base64字符串
                    const audioData = atob(res.data);
                    const audioBytes = new Uint8Array(audioData.length);
                    for (let i = 0; i < audioData.length; i++) {
                        audioBytes[i] = audioData.charCodeAt(i);
                    }
                    return Array.from(audioBytes);
                } else {
                    throw "Unknown response format from TTS API";
                }
            }
        } else {
            throw `HTTP Request Error\nStatus: ${res.status}\n${JSON.stringify(res.data)}`;
        }
    } catch (error) {
        throw `TTS API Error: ${error}`;
    }
}