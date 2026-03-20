async function testDeepSeek() {
    const apiKey = 'sk-d036577e0a24464ebb2ad051c964e731';
    const baseURL = 'https://api.deepseek.com/v1';

    console.log('Testing DeepSeek API...');
    try {
        const response = await fetch(`${baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: 'Say hello.' }
                ],
                max_tokens: 10
            }),
        });

        const data = await response.json();
        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

testDeepSeek();
