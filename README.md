# Valorant Map Picker

A web application for selecting Valorant maps through a team-based ban/pick process.

## Features

- Two-team map selection process (Team A and Team B)
- Team A bans one map, then Team B bans another map
- Teams take turns picking maps
- Automatic final map selection based on team choices
- Responsive design that works on desktop and mobile
- Fully customizable map images

## How the Map Selection Works

1. Team A bans one map from the pool of 7 maps
2. Team B bans another map from the remaining maps
3. Team A selects one map
4. Team B selects one map
5. If both teams choose the same map, that map is selected
6. If teams choose different maps, Team A makes a final selection
7. Team B makes a final selection
8. If teams still choose different maps, the last remaining map is selected

## Getting Started

### Prerequisites

- Node.js 18.17 or later

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Customizing Map Images

You have two ways to add map images:

### Option 1: Default File Structure

Place your map images in the `/public/images/maps/` directory with the default filenames:

- ascent.jpg
- bind.jpg
- haven.jpg
- split.jpg
- icebox.jpg
- breeze.jpg
- fracture.jpg

### Option 2: In-App Customization

1. Click the "Customize Images" button in the app
2. Edit each map's image path individually
3. You can use:
   - Local images in public directory: `/images/your-folder/any-name.png`
   - External images: `https://example.com/image.jpg`
   - Any image format: JPG, PNG, GIF, WebP, SVG, etc.

## Built With

- [Next.js](https://nextjs.org/) - The React framework
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
