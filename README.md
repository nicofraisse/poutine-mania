# Poutine Mania - A Social Website to Rate & Review Poutines

## About
A platform for poutine enthusiasts to discover, rate, and review poutines from various restaurants.

## Tech Stack
- Frontend: React.js, Next.js, Tailwind CSS
- Backend: Node.js, Express.js, MongoDB
- Auth: JWT, OAuth
- Storage: AWS S3
- Deployment: Vercel
- Emails: SendGrid,

## Features
- User authentication
- Restaurant profiles and reviews
- Multi-criteria poutine rating system
- "Poutines to Try" watchlist
- Search and filtering options
- Admin moderation tools

## Getting Started
- Add environment variables in `.env.development`
- Run `npm i`
- Run `npm run dev`

## Todo
- [X] Implement database pooling
- [X] Test compatibility with various mobile browsers
- [X] Add "Add to Watch List"/"Poutines to Try" feature & page
- [X] Implement edit profile functionality (name, profile photo, bio, soft-delete account)
- [ ] Implement follow user feature
- [X] Create About Us/Contact page
- [ ] Create `isLoggedIn` and `isAdmin` backend middleware
- [ ] Add backend validation using Joi
- [ ] Refetch data without page refresh for actions like login, account creation, adding a review, etc.
- [X] Cache the current user
- [X] Use skeleton screens instead of spinner
- [X] Add filtering options on restaurant index page
- [X] Implement email verification for email signup
- [X] Implement email-based password change
- [ ] Add upvote, downvote, and report review features

### Reviews
- [X] Support multi-photo upload
- [ ] Add takeout/dine-in pill selector in review form
- [X] Rate fries
- [X] Rate sauce
- [X] Rate cheese
- [ ] Include poutine name and price in reviews  
Inspiration ideas for rating criteria: [Route de la Poutine](http://www.routedelapoutine.com/)

### Restaurants
- [ ] Add `isPermanentlyClosed` boolean
- [X] Improve design of category tag pills in restaurant card and show page
- [X] Add `isApproved` boolean to restaurants — Users can create & review a new restaurant, but it will only be visible to them until an admin approves it
