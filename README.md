# Quiz-AI Fullstack App

![Architecture Diagram](/drawio_ai.png)

## Architecture

This project is a fullstack AI-powered quiz application with the following structure:

### Frontend
- **Framework:** React (with TypeScript)
- **Bundler:** Vite
- **UI:** Tailwind CSS
- **Main Components:**
  - `QuizPage`, `QuizHistoryPage` (pages)
  - `QuizQuestionsPanel`, `QuizQuestion`, `QuizResult`, `QuizHistory`, `QuizForm`, `Header`, `QuizProgress`, `Layout`, `CustomSelect` (components)
- **State Management:** React Context
- **API Communication:** Fetch/axios to backend endpoints
- **Features:**
  - Dynamic quiz generation
  - Real-time streaming of questions/answers for a fluid UI
  - Optimistic UI updates (shows 10 questions, fallback if not all are received)
  - Input sanitization before sending to backend

### Backend
- **Framework:** Node.js with Express
- **Main Files:**
  - `index.js` (entrypoint)
  - `services/quizService.js` (quiz logic, OpenAI API calls)
  - `controllers/quiz.js` (handles quiz requests)
  - `routes/quiz.js` (API endpoints)
  - `middlewares/` (for security, validation, etc.)
- **Features:**
  - Receives quiz subject and parameters from frontend (JSON)
  - Calls OpenAI API to generate questions/answers
  - Streams responses to frontend
  - Sanitizes and validates all inputs
  - Security checks for inappropriate/racist/sexual subjects

---

## Challenges

- **Prompt Imprecision:** It is difficult to get precise answers from the OpenAI API, which can result in unexpected or poorly formatted questions.
- **OpenAI Session Limitation:** The API does not maintain context between requests, so there is no session persistence, making it hard to follow a multi-step quiz or conversation.
- **Input Sanitization:** It is mandatory to clean and validate all user inputs to prevent injection or malicious prompts.
- **Streaming for Fluid UI:** Implementing response streaming to display questions as they arrive, making the UI more responsive and pleasant.
- **Optimistic UI & Fallback:** Displaying 10 questions immediately, but providing a fallback if the API does not return enough (e.g., network issues or token cost limits).
- **Token Cost:** Using the OpenAI API incurs a cost proportional to the number of tokens generated, so prompt and response sizes must be limited.
- **JSON Communication:** Frontend and backend communicate via JSON for simplicity and compatibility.
- **Security on Subject:** A backend filter is implemented to reject inappropriate subjects (racism, sexuality, etc.) and avoid sending such prompts to the API.

---

## Optmization Token Prompt

// Before: 156 characters
"with the fields: question, correctAnswer, explanation, type. If the type is "mcq", add a "choices" array"

// After: 67 characters
"with the fields: q (question), ca (correctAnswer), exp (explanation), t (type). If the type is "m", add a "c" array (4 options exactly). If the type is "tf" or "oe", do NOT include the "c" field at all."


Token Savings:

- System prompt: ~89 characters saved per API call
- User prompt: ~15-20 characters saved per API call
- Response data: ~8-15 characters saved per question
- Total per 10-question quiz: ~200-300 characters saved

API route

1. API Chat Completions (v1/chat/completions)

+ 
API stable and Standard
Advanced Feature: Streaming, Fine-Grained control ( temperature : creativity control, max_token, top_p: against diversity, frequency_penalty: avoid repetition, presence_penalty: encourage the repetition)
Message system : user / system
Error Handler

- 
No persistent memory
token limit 
cost high for high volume

2. API Completions (v1/completions)
+ 
Simple (1 prompt), Cheap (old models), Fast
-
No Streaming 
Depreciated... 
No messaging system

3. API Assistants (v1/assistants)
+ 
Memory persistant 
Tools: Code interpreter, retrieval
long conversation 
Customization 
- 
Complex 
Expensive
+ loading that chat api
no streaming native

4. API Threads (v1/threads)
+ 
persistent conversation 
full History 
Integration assitant 
- 
complex management threads 
cost to store messaging
limitation size 

7. API Files (v1/files)
+ upload document PDF, DOCX ..etc 
- limite size 512 mB per file / no streaming 


8. API Fine-tuning (v1/fine_tuning/jobs)
+ model custom/ optimize performance/ cost cheap
- Very expensive: Training costs, Complex: Data preparation/Maintenance: Updates needed



9. Embeddings API (v1/embeddings)
✅ Pros:
Semantic search
Automatic classification
Recommendations
Similarity analysis
❌ Cons:
No generation: Analysis only
Per-token cost
Complexity: Vector management
Not standalone

10. Moderation API (v1/moderations)
✅ Pros:
Security: Inappropriate content detection
Free: No cost
Simple: Single endpoint
Fast
❌ Cons:
Limited: Moderation only
No customization
False positives possible
No generation