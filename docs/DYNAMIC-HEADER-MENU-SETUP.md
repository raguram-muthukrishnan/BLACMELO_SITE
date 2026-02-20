# Dynamic Header Menu Setup Guide

This guide explains how to set up dynamic header menus based on Shopify collections using metaobjects.

## Overview

The header menu system will be driven by Shopify metaobjects, allowing you to manage menu structure, items, and collections directly from your Shopify admin without code changes.

## Step 1: Create Metaobject Definitions in Shopify

### 1.1 Create "Header Menu Item" Metaobject

Go to Shopify Admin → Settings → Custom Data → Metaobjects → Add definition

**Name:** `Header Menu Item`
**Type:** `header_menu_item`

**Fields:**
- `name` (Single line text) - Required - The display name of the menu item
- `link` (URL) - Optional - Custom link for the item
- `collection` (Collection reference) - Optional - Link to a collection
- `is_bold` (True/False) - Optional - Whether to display in bold
- `description` (Single line text) - Optional - Description text

### 1.2 Create "Header Menu Section" Metaobject

**Name:** `Header Menu Section`
**Type:** `header_menu_section`

**Fields:**
- `label` (Single line text) - Optional - Section label (e.g., "FEATURED", "SHOP")
- `items` (List of Metaobjects: header_menu_item) - Required - Menu items in this section
- `has_submenu` (True/False) - Optional - Whether items have submenus
- `is_bold` (True/False) - Optional - Whether to display items in bold

### 1.3 Create "Header Menu Config" Metaobject

**Name:** `Header Menu Config`
**Type:** `header_menu_config`

**Fields:**
- `menu_key` (Single line text) - Required - Unique identifier (e.g., "man", "women", "blacmelo")
- `title` (Single line text) - Required - Display title
- `sections` (List of Metaobjects: header_menu_section) - Required - Menu sections
- `image` (File) - Optional - Menu image
- `default_collection` (Collection reference) - Optional - Default collection for this menu

## Step 2: Create Menu Entries

### Example: Man Menu

1. Create menu items:
   - "New Arrivals" → Link to collection
   - "Bestsellers" → Link to collection
   - "Shop All" → Link to collection

2. Create sections:
   - Section 1: No label, items: [New Arrivals, Bestsellers, Shop All], is_bold: true
   - Section 2: Label "FEATURED", items: [Fall Winter '25, Owners Club, etc.]
   - Section 3: Label "SHOP", items: [Clothing, Footwear, Accessories], has_submenu: true

3. Create menu config:
   - menu_key: "    "
   - title: "Man"
   - sections: [Section 1, Section 2, Section 3]
   - image: Upload menu image

Repeat for "women" and "blacmelo" menus.

## Step 3: Implementation

The code implementation includes:

1. **GraphQL Queries** - Fetch metaobject data
2. **Type Definitions** - TypeScript types for menu data
3. **Header Component Updates** - Use dynamic data instead of hardcoded menus
4. **Root Loader Updates** - Fetch menu data on page load

## Benefits

- ✅ No code changes needed to update menus
- ✅ Manage all menu content from Shopify admin
- ✅ Automatically sync with your collections
- ✅ Easy to add/remove menu items
- ✅ Support for multiple menu configurations
- ✅ Image management through Shopify

## Next Steps

After creating the metaobjects in Shopify:
1. The GraphQL queries will automatically fetch the data
2. The Header component will render menus dynamically
3. Test the menus and adjust as needed
