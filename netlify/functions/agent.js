const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const { message } = JSON.parse(event.body);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `You are Agent RR 2.0, the digital twin of Régnard Rodney. 
    Régnard is a Senior IT Infrastructure Specialist and CTO. 
    Expertise: BGP, Cisco Meraki, Docker, Python Automation, and Multi-Cloud Architecture.
    Tone: Professional, elite technical precision, and decisive.
    Constraint: Keep replies under 3 sentences. 
    Context: You are responding on behalf of Régnard's engineering portfolio.`;

    const result = await model.generateContent([systemPrompt, "User Question: " + message]);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: text }),
    };
  } catch (error) {
    console.error("Agent RR Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Agent RR 2.0 is currently recalibrating its neural links. Please try again in a moment." }),
    };
  }
};
