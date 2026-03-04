# Four Freedoms

Four Freedoms is an AI-powered community podcast platform designed to foster deep engagement with audio content. By combining traditional podcasting with modern LLM capabilities, it allows listeners to "chat" with episodes, discover content through community-driven topics, and access exclusive insights.

<img src="public/screenshots/home.png" alt="Home" width="600">


## 🚀 Key Features

- **Context-Aware AI Chat**: Engage in deep dives with podcast episodes. Ask questions and get answers based on the specific context of the audio content, powered by Gemini and OpenAI.
- **Topic-Driven Discovery**: Explore content organized by community interest. Navigate through curated topics to find the podcasts that matter most to your interests.
- **Integrated Audio Suite**: A high-performance, seamless audio player built for both casual listening and deep research.
- **Community Engagement**: Like, dislike, and follow topics to personalize your feed and help the community discover quality content.

- **Podcast Studio**: Use with our Podcast Studio webapp (https://github.com/captainshin90/PodStudio) to generate podcasts from documents and audio transcripts and publish your own podcasts with ease. 

## 🪟 Live Demo

  https://fourfreedoms-polished-butterfly-4117.fly.dev/

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, Tailwind CSS, Lucide Icons, Radix UI.
- **Backend**: Node.js, Express.
- **Database & Auth**: Firebase (Firestore & Firebase Auth).
- **AI/LLM**: Google Gemini API, OpenAI API.
- **Infrastructure**: Fly.io (Production Deployments), Docker, .devcontainer.

## 📥 Quick Start

To run the project locally in development mode:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/captainshin90/Four-Freedoms.git
    cd Four-Freedoms
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    Create a `.env` file in the root directory (see `.env.example` or the list below).

4.  **Run the application**:
    ```bash
    npm run dev:all
    ```
    This command starts both the Next.js client (port 3000) and the Node.js server (port 3001).

5.  **Access the app**:
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## ⚙️ Environment Variables

The following keys are required in your `.env` file:

- `GEMINI_API_KEY`: For Google Gemini integration.
- `OPENAI_API_KEY`: For OpenAI integration.
- `FIREBASE_PROJECT_ID`: Your Firebase project ID.
- `API_PORT`: Port for the backend server (default: 3001).
- `NEXT_PUBLIC_API_BASE_URL`: Base URL for the client to contact the API.

## 🚀 Deployment

The project is configured for deployment on **Fly.io**.

- To deploy: `fly deploy`
- To view logs: `fly logs`

For detailed deployment steps, environment secret management, and volume configuration, please refer to [NOTES.md](file:///c:/SRC/FourFreedoms/NOTES.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Contact

[admin@kapshin.com](mailto:admin@kapshin.com)


