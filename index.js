const { default: axios } = require("axios");
const crypto = require("crypto");

async function BagooDex(content) {
    try {
        const post = {
            "messages": [
                {
                    "role": "system",
                    "content": "You are GPT-4o. If the response includes mathematical expressions, wrap them in markdown symbols ```math.\nUse my language to communicate with me."
                },
                {
                    "role": "user",
                    "content": content
                }
            ],
            "model": "gpt-4o",
            "personaId": "gpt",
            "frequency_penalty": 0,
            "max_tokens": 4000,
            "presence_penalty": 0,
            "stream": true,
            "temperature": 0.5,
            "top_p": 0.95
        }
        const response = await axios.post("https://chat-api.bagoodex.io/v1/chat/completions", post, {
            headers: {
                'Authorization': 'Bearer',
                'Content-Type': 'application/json',
                'Origin': 'https://bagoodex.io',
                'Referer': 'https://bagoodex.io/',
                'X-Device-Platform': 'web',
                'X-Device-UUID': crypto.randomUUID(),
            },
        });
        const data = await response.data;
        function mergeContents(dataString) {
            // Step 1: Split the string by each 'data:' block
            const dataBlocks = dataString.split('data: ');

            // Step 2: Filter out invalid or empty blocks
            const contentBlocks = dataBlocks.filter(block => {
                try {
                    // Step 3: Try to parse the JSON and check if it has 'content'
                    const parsed = JSON.parse(block);
                    return parsed.choices && parsed.choices[0].delta && parsed.choices[0].delta.content;
                } catch (e) {
                    return false;
                }
            });

            // Step 4: Extract the 'content' from each block and concatenate them
            const mergedContent = contentBlocks
                .map(block => {
                    const parsed = JSON.parse(block);
                    return parsed.choices[0].delta.content;
                })
                .join(''); // Join the content with no separator

            return mergedContent;
        }

        const result = mergeContents(data);

        return result;
    } catch (error) {
        console.error("Errorsiapa nama mu?:", error);
        return null;
    }
}

// BagooDex("kapan indonesia merdeka?").then((data) => console.log(data));
