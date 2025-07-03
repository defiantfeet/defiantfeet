# DefiantFeet - Dance Social Media Platform

## Overview

This is a full-stack dance social media platform built with React Native/Expo for mobile app store deployment, with Express.js backend and PostgreSQL database. The application allows dancers to share videos and headshots, organize events, manage newsletters, and interact through a social media-style interface with AI-powered features for content analysis and training recommendations.

## System Architecture

### Frontend Architecture
- **Framework**: React Native with Expo for mobile app development
- **UI Components**: Native React Native components with custom styling
- **Navigation**: React Navigation for native mobile navigation
- **State Management**: TanStack Query for server state, React Context for authentication
- **Styling**: StyleSheet with dark theme optimized for mobile
- **Platform**: iOS and Android app store deployment via Expo

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Neon serverless connection
- **ORM**: Drizzle ORM for database operations
- **File Uploads**: Multer for handling video and image files
- **AI Integration**: OpenAI GPT-4o for content analysis and recommendations

### Database Schema
The application uses PostgreSQL with the following main entities:
- Users (authentication, profiles, dance styles)
- Videos (content, metadata, engagement metrics)
- Headshots (professional photos with tags)
- Events (competitions, workshops, showcases)
- Newsletters (content management and subscriptions)
- Tips (monetary donations between users)
- Likes (engagement tracking)

## Key Components

### Authentication System
- Simple email/password authentication
- User profiles with dance styles and verification status
- Session management through localStorage
- Protected routes and API endpoints

### Content Management
- Video upload and sharing with AI-powered categorization
- Professional headshot gallery
- Event creation and management (competitions, workshops, showcases)
- Newsletter creation and subscriber management

### AI Features
- Content analysis for automatic categorization and tagging
- Training recommendations based on user preferences
- Engagement insights and optimal posting time suggestions
- Newsletter content analysis

### Social Features
- Video feed with like and tip functionality
- User discovery and collaboration matching
- Event participation tracking
- Professional networking through headshots

## Data Flow

1. **Content Upload**: Users upload videos/images → Multer processes files → AI analyzes content → Database stores metadata
2. **Feed Generation**: Client requests content → Server queries database with user preferences → Returns personalized feed
3. **AI Insights**: User activity data → OpenAI API analysis → Generated recommendations → Cached results
4. **Real-time Updates**: User interactions → Database updates → Query invalidation → UI refresh

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless database
- **AI Services**: OpenAI API for content analysis and recommendations
- **File Storage**: In-memory multer storage (production would use cloud storage)
- **UI Framework**: Extensive Radix UI component library

### Development Tools
- TypeScript for type safety
- Vite for fast development and building
- Drizzle Kit for database migrations
- ESBuild for server-side bundling

## Deployment Strategy

### Development
- Vite dev server for frontend with HMR
- tsx for TypeScript execution in development
- Concurrent frontend and backend development

### Production Build
- Frontend: Vite builds optimized React bundle
- Backend: ESBuild bundles server code with external dependencies
- Database: Drizzle migrations for schema deployment
- Environment: NODE_ENV-based configuration

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY` or `OPENAI_KEY`: AI service authentication
- `NODE_ENV`: Environment configuration

## Changelog

Changelog:
- July 02, 2025. Initial setup
- July 02, 2025. **Anonymous System Implementation**: All likes, tips, and subscriptions are now completely anonymous. Users receive persistent anonymous IDs stored in localStorage for consistent interaction tracking while maintaining privacy. Database schema updated to use anonymous_id instead of user references for these interactions.
- July 02, 2025. **Public vs Subscription Content System**: Implemented comprehensive subscription-based content posting system. Dancers can now mark videos as public or subscription-only ($9.99/month). Features include subscription-locked video previews, Stripe subscription payments, subscription status checking, and seamless content access management for premium content.
- July 02, 2025. **Subscriptions Dashboard Added**: Created new Subscriptions page showing subscriber count, monthly revenue ($7.49 creator cut - 75%), and daily earnings. Added Subscriptions tab to hamburger menu positioned after Profile. Removed Headshots tab from navigation as requested. Includes API endpoint for subscription statistics with recent subscriber tracking.
- July 02, 2025. **React Native/Expo Conversion**: Major architectural conversion from React web app to React Native/Expo mobile app for iOS and Android app store deployment. Created complete mobile app structure with native navigation, mobile-optimized screens, camera integration, and authentication flow. All core features converted including video feed, discovery, content creation, training, profiles, and subscription management.

## User Preferences

Preferred communication style: Simple, everyday language.