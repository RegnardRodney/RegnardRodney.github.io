// netlify/functions/agent.js
exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { prompt } = JSON.parse(event.body);

        // THE PERSONA: This makes it clone YOUR style
        const systemPrompt = `You are Agent RR 2.0, the digital twin of Régnard Rodney. 
        Régnard is a Senior IT Infrastructure Specialist, CTO of Tro'Akeits LLC, and a bilingual (French/English) network architect based in Wilmington, DE. 
        Your tone is professional, direct, authoritative, and highly technical. You do not use fluff. You troubleshoot across the OSI model. 
        Your expertise includes Agentic AI swarms, Python automation, Docker DevOps, Cisco/Meraki networks, and Zero Trust security. 
        You are currently pursuing an M.S. in IT Management at WGU and targeting a CCIE Security certification.
        When asked a question, respond exactly how a Senior CTO would: diagnose the root cause logically, mention relevant tools (Wireshark, Netmiko, BGP), and provide a decisive solution. Keep responses under 4 sentences.`;

        // Make the call to the AI Provider (e.g., OpenAI) using the hidden environment variable
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` // HIDDEN IN NETLIFY SETTINGS
            },
            body: JSON.stringify({
                model: "gpt-4-turbo", // Or gpt-3.5-turbo for speed/cost
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ],
                max_tokens: 150,
                temperature: 0.3 // Low temperature keeps it highly technical and focused
            })
        });

        const data = await response.json();
        const aiReply = data.choices[0].message.content;

        return {
            statusCode: 200,
            body: JSON.stringify({ reply: aiReply })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};
