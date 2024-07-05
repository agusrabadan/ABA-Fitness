import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/chatBot.css";

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [error, setError] = useState("");
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        // Obtener ejercicios de la base de datos al montar el componente
        const fetchExercises = async () => {
            try {
                const response = await axios.get(`${process.env.BACKEND_URL}/admin/exercises`);
                setExercises(response.data);
            } catch (error) {
                console.error("Error fetching exercises:", error);
                setExercises([]); // Asegurar que exercises es un array
            }
        };

        fetchExercises();
    }, []);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSend = async () => {
        if (input.trim() === "") return;

        const userMessage = { sender: "user", text: input };
        setMessages([...messages, userMessage]);
        setInput("");

        try {
            const apiKey = "sk-working-jTi2ael7bon59Y7LxsI1T3BlbkFJz0A8yAesJTsWectigtkt";
            console.log('OpenAI API Key:', apiKey);

            if (!apiKey) {
                throw new Error('API Key not found');
            }

            // Asegurar que exercises es un array antes de usar map
            const exerciseList = Array.isArray(exercises)
                ? exercises.map(ex => `[${ex.name}](/exercises?search=${encodeURIComponent(ex.name)})`).join("\n")
                : "No exercises available.";

            const initialPrompt = {
                role: "system",
                content: `Eres un asistente útil en una aplicación de fitness. Proporciona información sobre ejercicios, planes de entrenamiento, y puedes incluir enlaces a partes específicas de la aplicación. 
                No puedes usar otras sugerencias que no sean las de la lista que te muestro a continuación. Debes, además, proporcionar en tu respuesta links a los ejercicios propuestos (que serán los propios nombres del ejercicio),
                siendo la ruta esta ${process.env.BACKEND_URL}/exercises.
                En el componente de exercises tengo esto (useEffect(() => {
                  const params = new URLSearchParams(location.search);
                  const search = params.get("search");
                  if (search) {
                    setSearchTerm(search);
                  }
                }, [location.search]);), que puedes usar para establecer los parámetros de búsqueda en la url para que el componente exercises lo use.
                Procura que se pueda hacer clic sobre los nombres de los ejercicios y que estos lleven a la ruta de exercises con el parámetro correcto para que se use en la búsqueda (serán elementos html clicables como a href). 
                No pongas los links a parte, queda feo. Además, contesta en el idioma en el que te escriban previamente.
                Aquí tienes la lista de ejercicios disponibles y en la que debes basarte, intenta usar un repertorio rico cuando propongas, pero sé conciso:\n${exerciseList}`
            };

            const response = await axios.post("https://api.openai.com/v1/chat/completions", {
                model: "gpt-3.5-turbo",
                messages: [initialPrompt, { role: "user", content: input }],
                max_tokens: 150
            }, {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                }
            });

            const botMessage = { sender: "bot", text: response.data.choices[0].message.content };
            setMessages([...messages, userMessage, botMessage]);
            setError("");
        } catch (error) {
            console.error("Error sending message:", error);
            setError("An error occurred while sending the message. Please try again later.");

            // Manejar errores específicos
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                console.error("Response headers:", error.response.headers);
                if (error.response.data.error.type === "insufficient_quota") {
                    setError("You have exceeded your API quota. Please check your plan and billing details.");
                }
            } else if (error.request) {
                console.error("Request data:", error.request);
            } else {
                console.error('Error', error.message);
            }
        }
    };

    return (
        <div className="chatbot-container">
            <div className={`chatbot-icon ${isOpen ? "open" : ""}`} onClick={toggleChat}>
                💬
            </div>
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`} dangerouslySetInnerHTML={{ __html: msg.text }}>
                            </div>
                        ))}
                    </div>
                    {error && <div className="chatbot-error">{error}</div>}
                    <div className="chatbot-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
