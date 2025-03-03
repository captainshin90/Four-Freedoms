# Changelog

## [0.1.0] - 2025-04-15

### Added
- Initial project setup with Next.js, React, and shadcn/ui
- Firebase integration for authentication and database
- Express.js backend with OpenAI, Gemini, ElevenLabs, and Play.ai API integrations
- User authentication with email/password and social providers (Google, Facebook, Microsoft)
- Database schemas for Users, Subscriptions, Personas, Documents, Topics, Transcripts, Prompts, Podcasts, Episodes, Questions, and Chats
- Seed script to populate the database with initial test data
- Main application layout with header, sidebar, content panel, and bottom bar
- Topic panel with expandable/collapsible functionality
- Podcast listing and filtering by topic
- Podcast player with play/pause, volume, and progress controls
- Chat interface with AI assistant integration
- User profile management
- Subscription management
- Responsive design for all device sizes

### Fixed
- Authentication provider implementation to properly handle context values
- Time formatting utility for podcast player
- Database seeding to include all required collections

### Changed
- Updated main page layout to use a more modular component structure
- Improved podcast player UI with minimized and full-view modes