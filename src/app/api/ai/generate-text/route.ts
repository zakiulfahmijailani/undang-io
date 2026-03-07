import { NextResponse } from 'next/server'

// Note: Ensure you have OPENROUTER_API_KEY in your .env.local
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

export async function POST(req: Request) {
    if (!OPENROUTER_API_KEY) {
        return NextResponse.json({ error: "OpenRouter API Key not configured" }, { status: 500 })
    }

    try {
        const { groomName, brideName, context, style } = await req.json()

        if (!groomName || !brideName) {
            return NextResponse.json({ error: "Missing required names" }, { status: 400 })
        }

        const systemPrompt = `Kamu adalah asisten copywriter profesional untuk undangan pernikahan digital di Indonesia.
Task: Tulis teks sambutan untuk undangan pernikahan dalam Bahasa Indonesia yang natural, hangat, dan sesuai budaya Indonesia.

Input dari user:
- Nama Mempelai Pria: ${groomName}
- Nama Mempelai Wanita: ${brideName}
- Konteks: ${context || 'Pengantin baru yang berbahagia'}
- Gaya: ${style || 'Formal'} (Formal/Santai/Romantis/Religius)

Output: Tulis teks dalam 1-2 paragraf, maksimal 80 kata, dengan tone yang ${style || 'Formal'}. Jangan gunakan bahasa yang terlalu puitis atau berlebihan. Pastikan mudah dibaca dan cocok untuk semua kalangan tamu. Hanya output teks hasil jadinya saja tanpa preamble.`

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "anthropic/claude-3.5-sonnet:beta",
                messages: [
                    { role: "user", content: systemPrompt }
                ],
                temperature: 0.7,
                max_tokens: 300,
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error("OpenRouter Error:", errorText)
            return NextResponse.json({ error: "Failed to generate text from AI" }, { status: 502 })
        }

        const data = await response.json()
        const generatedText = data.choices?.[0]?.message?.content || "Gagal generate teks."

        return NextResponse.json({ text: generatedText })
    } catch (error) {
        console.error("AI Route Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
