# 🧠 Quiz-AI Fullstack App

> **An intelligent AI-powered quiz application built with React, Node.js, and OpenAI API**

---

## 📖 **Medium Post**

**[How we build an AI-Powered React App? My Experience with a Quiz App AI](https://medium.com/@samrub06/how-we-build-an-ai-powered-react-app-my-experience-with-a-quiz-app-ai-f40d5c276f3b)**

*Read about the complete development journey, challenges faced, and solutions implemented in building this AI-powered quiz application.*

---

## 🏗️ **Architecture Overview**

### **System Architecture**
![System Architecture](/drawio_ai.png)

### **API Flow & Parameters**
![API Flow](/drawio_ai_1.png)

### **Moderation Pipeline**
![Moderation Pipeline](/drawio_ai_2.png)

---

## ✨ **Features**

- 🎯 **Dynamic Quiz Generation** - AI-powered questions based on any topic
- 🚀 **Real-time Streaming** - Questions appear as they're generated
- 🎨 **Modern UI/UX** - Beautiful interface built with Tailwind CSS
- 🔒 **Content Moderation** - Built-in safety filters for inappropriate content
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🌍 **Multi-language Support** - Internationalization ready
- 📊 **Quiz History** - Track your learning progress
- ⚡ **Performance Optimized** - Fast and efficient user experience

---

## 🛠️ **Tech Stack**

### **Frontend**
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context
- **Internationalization:** i18next
- **UI Components:** Custom components with modern design

### **Backend**
- **Runtime:** Node.js with Express
- **API:** RESTful endpoints with streaming support
- **AI Integration:** OpenAI GPT API
- **Security:** Input validation, content moderation
- **Testing:** Jest for unit testing

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- OpenAI API key

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/quiz-ai.git
cd quiz-ai
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

3. **Environment Setup**
```bash
# Backend (.env)
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001

# Frontend (.env)
VITE_API_BASE_URL=http://localhost:3001
```

4. **Run the application**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

---

## 📁 **Project Structure**

```
quiz-ai/
├── 🎯 frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Application pages
│   │   ├── api/               # API service layer
│   │   ├── contexts/          # React contexts
│   │   ├── types/             # TypeScript type definitions
│   │   └── locales/           # Internationalization files
│   └── public/                # Static assets
├── 🔧 backend/                 # Node.js Express server
│   ├── controllers/           # Request handlers
│   ├── services/              # Business logic & OpenAI integration
│   ├── routes/                # API endpoints
│   ├── middlewares/           # Request processing
│   └── config/                # Configuration files
└── 📚 docs/                   # Documentation & diagrams
```

---

## 🔌 **API Endpoints**

### **Quiz Generation**
```http
POST /api/quiz/generate
Content-Type: application/json

{
  "topic": "JavaScript",
  "subtopic": "ES6 Features",
  "nbQuestions": 10,
  "level": "intermediate",
  "lang": "en",
  "type": "mcq"
}
```

### **Response Format**
```json
{
  "questions": [
    {
      "q": "What is destructuring in ES6?",
      "ca": "Extracting values from objects/arrays",
      "exp": "Destructuring allows you to extract values...",
      "t": "m",
      "c": ["Option A", "Option B", "Option C", "Option D"]
    }
  ]
}
```

---

## 🎯 **Key Features Deep Dive**

### **1. AI-Powered Question Generation**
- **Dynamic Content:** Generate questions on any topic instantly
- **Multiple Formats:** MCQ, True/False, Open-ended questions
- **Difficulty Levels:** Beginner, intermediate, advanced
- **Language Support:** Multi-language question generation

### **2. Real-time Streaming**
- **Progressive Loading:** Questions appear as they're generated
- **Optimistic UI:** Shows expected number of questions immediately
- **Fallback Handling:** Graceful degradation if API limits are reached

### **3. Content Safety**
- **Moderation Pipeline:** Multi-layer content filtering
- **Forbidden Word Cache:** Efficient content screening
- **OpenAI Moderation:** Advanced AI-powered safety checks

### **4. Performance Optimization**
- **Token Optimization:** Reduced API costs through prompt engineering
- **Caching Strategy:** Smart caching for repeated requests
- **Response Streaming:** Efficient data transfer

---

## 🔒 **Security Features**

- **Input Sanitization:** All user inputs are cleaned and validated
- **Content Moderation:** Built-in filters for inappropriate content
- **Rate Limiting:** Protection against API abuse
- **Error Handling:** Secure error messages without information leakage
- **CORS Configuration:** Proper cross-origin resource sharing setup

---

## 📊 **Performance Metrics**

### **Token Optimization Results**
- **System Prompt:** ~89 characters saved per API call
- **User Prompt:** ~15-20 characters saved per API call  
- **Response Data:** ~8-15 characters saved per question
- **Total Savings:** ~200-300 characters per 10-question quiz

### **API Response Times**
- **Question Generation:** 2-5 seconds per question
- **Streaming Latency:** <100ms between questions
- **Total Quiz Time:** 20-50 seconds for 10 questions

---

## 🧪 **Testing**

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test

# Run all tests
npm run test:all
```

---

## 🚧 **Challenges & Solutions**

### **Challenge 1: Prompt Imprecision**
- **Problem:** OpenAI API responses were inconsistent
- **Solution:** Optimized prompt engineering with clear formatting instructions

### **Challenge 2: Session Management**
- **Problem:** No persistent context between API calls
- **Solution:** Stateless design with client-side state management

### **Challenge 3: Content Safety**
- **Problem:** Need to filter inappropriate content
- **Solution:** Multi-layer moderation pipeline with OpenAI Moderation API

### **Challenge 4: Cost Optimization**
- **Problem:** High token costs for large prompts
- **Solution:** Aggressive prompt compression and token counting

---


## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---


## 📞 **Support**

- **Issues:** [GitHub Issues](https://github.com/yourusername/quiz-ai/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/quiz-ai/discussions)
- **Email:** charbit.samuel@gmail.com

---

<div align="center">

**Made with ❤️ and ☕ by Samuel Charbit**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/samrub06)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/samuelcharbit)
[![Medium](https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@samrub06)

</div>