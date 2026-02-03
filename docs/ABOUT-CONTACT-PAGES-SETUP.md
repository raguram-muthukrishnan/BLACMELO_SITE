# About Us & Contact Us Pages Setup Guide

This guide explains how to set up the About Us and Contact Us pages in your Shopify admin to work with the dynamic page designs.

## Overview

Both pages now fetch content from Shopify's Page API and dynamically render the content based on the structure you provide. The design adapts to the content classification (headings, sections, etc.).

**Important:** Both pages include fallback content, so they will work immediately even without Shopify pages. However, you should create the pages in Shopify to customize the content for your brand.

## Quick Start (Using Fallback Content)

If you haven't created the pages in Shopify yet, the routes will display placeholder content automatically. You'll see a notice at the bottom of each page indicating that it's using fallback content.

To customize the pages with your own content, follow the setup instructions below.

## Setting Up Pages in Shopify Admin

### 1. About Us Page

**Step 1: Create the Page**
1. Go to Shopify Admin → Online Store → Pages
2. Click "Add page"
3. Set the title to "About Us"
4. **Important:** Set the handle to `about` (this is required for the route to work)

**Step 2: Structure Your Content**

The About page parser looks for `<h2>` tags to create sections. Here's a recommended structure:

```html
<h2>Our Story</h2>
<p>Tell your brand story here. This will be rendered as a separate section with a heading.</p>
<p>You can include multiple paragraphs in each section.</p>

<h2>Our Mission</h2>
<p>Describe your mission and values.</p>
<ul>
  <li>Value 1</li>
  <li>Value 2</li>
  <li>Value 3</li>
</ul>

<h2>Our Team</h2>
<p>Introduce your team members and their roles.</p>
<p>You can use <strong>bold text</strong> and <em>italic text</em> for emphasis.</p>

<h2>Why Choose Us</h2>
<p>Highlight what makes your brand unique.</p>
```

**Content Tips:**
- Use `<h2>` tags for main section headings
- Use `<h3>` tags for subsections within a section
- Use `<p>` tags for paragraphs
- Use `<ul>` or `<ol>` for lists
- Use `<strong>` for bold text
- Use `<em>` for italic text
- Add links with `<a href="...">` tags

**Step 3: SEO Settings**
- Add a meta description (recommended: 150-160 characters)
- The page title will be used in the browser tab as "BLACMELO | About Us"

---

### 2. Contact Us Page

**Step 1: Create the Page**
1. Go to Shopify Admin → Online Store → Pages
2. Click "Add page"
3. Set the title to "Contact Us"
4. **Important:** Set the handle to `contact` (this is required for the route to work)

**Step 2: Structure Your Content**

The Contact page parser looks for `<h3>` tags to create contact detail sections. Here's a recommended structure:

```html
<p>We'd love to hear from you! Whether you have a question about our products, need assistance, or just want to say hello, feel free to reach out.</p>

<h3>Email</h3>
<p><a href="mailto:hello@blacmelo.com">hello@blacmelo.com</a></p>
<p>For customer support: <a href="mailto:support@blacmelo.com">support@blacmelo.com</a></p>

<h3>Phone</h3>
<p>+1 (555) 123-4567</p>
<p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>

<h3>Address</h3>
<p>BLACMELO Headquarters<br>
123 Fashion Street<br>
New York, NY 10001<br>
United States</p>

<h3>Social Media</h3>
<p>Follow us on social media for the latest updates:</p>
<p>
  Instagram: <a href="https://instagram.com/blacmelo">@blacmelo</a><br>
  Twitter: <a href="https://twitter.com/blacmelo">@blacmelo</a><br>
  Facebook: <a href="https://facebook.com/blacmelo">BLACMELO</a>
</p>
```

**Content Structure:**
- **Intro paragraph(s)**: Any content before the first `<h3>` tag will be displayed as an introduction
- **Contact Details**: Each `<h3>` tag creates a new contact detail section
- **Additional Info**: Any content after the last section can include business hours, policies, etc.

**Step 3: SEO Settings**
- Add a meta description (recommended: 150-160 characters)
- The page title will be used in the browser tab as "BLACMELO | Contact Us"

---

## Design Features

### About Us Page Design
- **Hero Section**: Large title with gradient background
- **Content Sections**: Each `<h2>` creates a new section with:
  - Section heading
  - Rich text content with proper typography
  - Support for lists, links, and formatted text
- **Responsive**: Adapts to mobile, tablet, and desktop screens
- **Typography**: Uses Serifa for headings and DM Sans for body text

### Contact Us Page Design
- **Two-Column Layout**: 
  - Left: Contact information from Shopify
  - Right: Contact form
- **Contact Form Fields**:
  - Name (required)
  - Email (required)
  - Phone (optional)
  - Subject (required)
  - Message (required)
- **Responsive**: Stacks to single column on mobile devices
- **Styled Form**: Clean, modern form design with focus states

---

## Testing Your Pages

After setting up the pages in Shopify:

1. **Visit the pages**:
   - About: `https://yourstore.com/about`
   - Contact: `https://yourstore.com/contact`

2. **Check the content**:
   - Verify all sections are rendering correctly
   - Test links and formatting
   - Check responsive behavior on different screen sizes

3. **Test the contact form**:
   - Fill out all required fields
   - Submit the form
   - Verify form validation works

---

## Customization

### Modifying the Design

The styles are located in `hydrogen-storefront/app/styles/tailwind.css`:
- About page styles: Search for `ABOUT PAGE STYLES`
- Contact page styles: Search for `CONTACT PAGE STYLES`

### Modifying the Content Parser

The content parsing logic is in the route files:
- About: `hydrogen-storefront/app/routes/($locale).about.tsx` → `parsePageContent()` function
- Contact: `hydrogen-storefront/app/routes/($locale).contact.tsx` → `parseContactInfo()` function

You can modify these functions to change how content is structured and displayed.

---

## Troubleshooting

### Page Shows Fallback Content
- The page is working but displaying placeholder content
- Create a page in Shopify admin with the correct handle (`about` or `contact`)
- Publish the page and refresh your browser

### Page Not Found (404)
- This should no longer happen as fallback content is provided
- If you still see 404, check your route configuration
- Verify the route files exist in `app/routes/`

### Content Not Displaying Correctly
- Check that you're using the correct HTML tags (`<h2>` for About, `<h3>` for Contact)
- Verify there are no HTML syntax errors in your content
- Use the Shopify HTML editor (not the rich text editor) for precise control

### Styling Issues
- Check browser console for CSS errors
- Verify the tailwind.css file includes the page styles
- Test in different browsers to rule out browser-specific issues

---

## Best Practices

1. **Keep Content Updated**: Regularly review and update your About and Contact pages
2. **Use Semantic HTML**: Proper heading hierarchy improves SEO and accessibility
3. **Test Responsiveness**: Always check how pages look on mobile devices
4. **Optimize Images**: If you add images, use optimized formats and appropriate sizes
5. **Monitor Form Submissions**: Set up email notifications for contact form submissions
6. **Add Analytics**: Track page views and form submissions to understand user engagement

---

## Next Steps

- Set up email notifications for contact form submissions
- Add a map widget to the contact page (if desired)
- Create additional custom pages using the same pattern
- Implement form submission handling (currently form is set up but needs backend integration)
