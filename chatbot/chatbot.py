import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load API key
load_dotenv()
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Configure generation settings
generation_config = {
    "temperature": 0.15,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

# Initialize the chatbot model
model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config=generation_config,
    system_instruction="You are a highly knowledgeable medical chatbot specializing in brain tumors. \n"
                       "You must provide summarized, factual, and to-the-point answers based on verified medical knowledge. \n"
                       "If you do not know the answer, simply respond with: \"I don't know the answer yet.\"\n\n"
                       "Follow these rules strictly:\n"
                       "1. Provide accurate and structured information in a clear, professional tone.\n"
                       "2. Do not mention symptoms, cures or any other details unless it is specifically asked.\n"
                       "3. Keep explanations medically accurate, concise, and easy to understand.\n"
                       "4. Do **not** make up any information. If the question is outside your knowledge, say:  \n"
                       "   **\"I don't know the answer yet.\"**\n"
                       "5. Do not give personal medical advice. Encourage consulting a healthcare professional for personalized guidance.\n"
)

# Predefined history for commonly asked questions
chat_history = [
    {"role": "user", "parts": ["hello"]},
    {"role": "model", "parts": ["Hello! How can I help you today with your questions about brain tumors?"]},

    {"role": "user", "parts": ["what is brain tumor?"]},
    {"role": "model", "parts": [
        "A brain tumor is an abnormal mass of tissue in the brain. It occurs when cells in the brain grow uncontrollably, forming a mass. "
        "Brain tumors can be benign (non-cancerous) or malignant (cancerous). They can originate in the brain (primary brain tumors) or "
        "spread to the brain from other parts of the body (secondary or metastatic brain tumors).\n\n"
        "**Key Points:**\n"
        "- **Types:** Gliomas, meningiomas, pituitary adenomas, and more.\n"
        "- **Symptoms:** Headaches, seizures, vision problems, personality changes.\n"
        "- **Diagnosis:** MRI, CT scan, biopsy.\n"
        "- **Treatment:** Surgery, radiation, chemotherapy, targeted therapy.\n\n"
        "Let me know if you want more details on a specific aspect!"
    ]},

    {"role": "user", "parts": ["how to cure brain tumor?"]},
    {"role": "model", "parts": [
        "Treatment for brain tumors depends on the type, size, and location of the tumor. \n\n"
        "**Common Treatments:**\n"
        "1. **Surgery:** Removes as much of the tumor as possible.\n"
        "2. **Radiation Therapy:** Destroys remaining tumor cells.\n"
        "3. **Chemotherapy:** Uses drugs to target tumor cells.\n"
        "4. **Targeted Therapy:** Attacks specific cancer cells.\n"
        "5. **Immunotherapy:** Boosts the immune system to fight cancer.\n\n"
        "The best approach depends on the patient's condition and tumor type. Let me know if you need more details!"
    ]}
]

# Start the chat session with predefined history
chat_session = model.start_chat(history=chat_history)

# Chat Loop for Continuous Q&A
while True:
    user_input = input("\nAsk a question (or type 'exit' to quit): ")
    
    if user_input.lower() == "exit":
        print("Chatbot session ended.")
        break

    # Send message to chatbot
    response = chat_session.send_message(user_input)

    # Print chatbot response
    print("\nChatbot:", response.text)
