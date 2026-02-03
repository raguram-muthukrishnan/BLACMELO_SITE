# About Page Setup

## Overview
The About page has been redesigned to match the BLACMELO brand aesthetic with a hero section, vision section, and detailed content sections.

## Page Structure

### 1. Hero Section
- Full-width hero with background image overlay
- "WELCOME TO" subtitle
- Large "BLACMELO" title
- Dark overlay for text readability

### 2. Our Vision Section
- Split layout: Image left, text right
- Desert/landscape image on the left
- "OUR VISION" heading with descriptive text on the right
- Responsive: stacks vertically on mobile

### 3. Content Section
- Split layout: Text left, image right
- Detailed brand philosophy and story
- Product/lifestyle image on the right
- Responsive: stacks vertically on mobile

## Required Images

You need to add 3 images to the `public/images/` directory:

1. **about-hero.jpg** (Hero background)
   - Recommended size: 1920x800px
   - Should be a lifestyle/brand image with good contrast for white text
   - Currently using a gradient overlay for text readability

2. **about-vision.jpg** (Vision section)
   - Recommended size: 800x600px
   - Desert/landscape scene with person (as shown in reference)
   - Left side of vision section

3. **about-content.jpg** (Content section)
   - Recommended size: 800x800px
   - Product/lifestyle image showing BLACMELO clothing
   - Right side of content section

## Image Setup

### Option 1: Add Your Own Images
1. Create a `public/images/` directory if it doesn't exist
2. Add your images with the names above
3. Images will be served from `/images/[filename]`

### Option 2: Use Placeholder Images
If you don't have images yet, you can:
1. Use placeholder services temporarily
2. Update the image paths in `app/routes/($locale).about.tsx`

Example with placeholder:
```tsx
<img 
  src="https://placehold.co/800x600/e5e5e5/666666?text=Vision+Image" 
  alt="BLACMELO Vision" 
/>
```

## Content Customization

To update the text content, edit `app/routes/($locale).about.tsx`:

### Hero Section
```tsx
<p className="about-hero-subtitle">WELCOME TO</p>
<h1 className="about-hero-title">BLACMELO</h1>
```

### Vision Section
```tsx
<h2 className="about-section-title">OUR VISION</h2>
<p className="about-section-text">
  Your vision text here...
</p>
```

### Content Section
```tsx
<p className="about-paragraph">
  Your content paragraphs here...
</p>
```

## Styling

All styles are in `app/styles/app.css` under the "ABOUT PAGE STYLES" section.

### Key CSS Classes:
- `.about-page` - Main container
- `.about-hero-section` - Hero with background image
- `.about-vision-section` - Vision split layout
- `.about-content-section` - Content split layout
- `.about-section-title` - Section headings
- `.about-section-text` - Body text
- `.about-paragraph` - Content paragraphs

### Responsive Breakpoints:
- Desktop: 2-column grid layout
- Tablet (< 1024px): Single column, stacked
- Mobile (< 768px): Reduced padding, smaller text

## Typography

- **Font Family**: DM Sans
- **Hero Title**: 64px (40px mobile), bold, uppercase
- **Section Titles**: 28px, bold, uppercase
- **Body Text**: 14-15px, regular weight
- **Line Height**: 1.8 for readability

## Colors

- **Background**: #ffffff (white)
- **Text Primary**: #000000 (black)
- **Text Secondary**: #333333 (dark gray)
- **Hero Overlay**: rgba(0, 0, 0, 0.4)

## Accessibility

- Semantic HTML structure
- Alt text for all images
- Proper heading hierarchy (h1, h2)
- Sufficient color contrast
- Responsive text sizing

## Future Enhancements

Possible additions:
1. Add team member section
2. Add timeline/milestones
3. Add values/principles section
4. Add video background for hero
5. Add parallax scrolling effects
6. Add testimonials/quotes
7. Add call-to-action buttons
