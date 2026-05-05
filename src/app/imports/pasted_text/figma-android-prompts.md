Complete Figma to Android Design Implementation Prompts
SECTION 1: DESIGN EXTRACTION & SETUP
Prompt 1: Extract Design System from Figma
I have designed a complete Business KPI Automation & Reporting System in Figma. Help me implement the exact design in Android. First, create the design system foundation:

COLORS (from my Figma design):
Extract and create colors.xml with:

Primary Colors:
- primary_color: [YOUR HEX COLOR]
- primary_dark: [YOUR HEX COLOR]
- primary_light: [YOUR HEX COLOR]

Secondary Colors:
- secondary_color: [YOUR HEX COLOR]
- secondary_dark: [YOUR HEX COLOR]
- secondary_light: [YOUR HEX COLOR]

Accent Colors:
- accent_color: [YOUR HEX COLOR]
- accent_light: [YOUR HEX COLOR]

Background Colors:
- background_color: [YOUR HEX COLOR]
- surface_color: [YOUR HEX COLOR]
- card_background: [YOUR HEX COLOR]

Text Colors:
- text_primary: [YOUR HEX COLOR]
- text_secondary: [YOUR HEX COLOR]
- text_tertiary: [YOUR HEX COLOR]
- text_disabled: [YOUR HEX COLOR]

Status Colors:
- success_color: [YOUR HEX COLOR]
- warning_color: [YOUR HEX COLOR]
- error_color: [YOUR HEX COLOR]
- info_color: [YOUR HEX COLOR]

Gradient Colors (if used):
- gradient_start: [YOUR HEX COLOR]
- gradient_end: [YOUR HEX COLOR]

Chart Colors (for different data series):
- chart_color_1: [YOUR HEX COLOR]
- chart_color_2: [YOUR HEX COLOR]
- chart_color_3: [YOUR HEX COLOR]
- chart_color_4: [YOUR HEX COLOR]
- chart_color_5: [YOUR HEX COLOR]

Create color values for dark mode in colors.xml (night):
[Provide dark mode color values]

TYPOGRAPHY (from my Figma design):
Create styles.xml with text styles matching:

Heading Styles:
- heading_1: [font size]sp, [font weight], [letter spacing]
- heading_2: [font size]sp, [font weight], [letter spacing]
- heading_3: [font size]sp, [font weight], [letter spacing]

Body Styles:
- body_large: [font size]sp, [font weight], [line height]
- body_medium: [font size]sp, [font weight], [line height]
- body_small: [font size]sp, [font weight], [line height]

Label Styles:
- label_large: [font size]sp, [font weight]
- label_medium: [font size]sp, [font weight]
- label_small: [font size]sp, [font weight]

Button Text:
- button_text: [font size]sp, [font weight], [letter spacing]

Caption:
- caption: [font size]sp, [font weight]

SPACING & DIMENSIONS (from my Figma design):
Create dimens.xml with:
- spacing_xs: [X]dp
- spacing_s: [X]dp
- spacing_m: [X]dp
- spacing_l: [X]dp
- spacing_xl: [X]dp
- spacing_xxl: [X]dp

- card_corner_radius: [X]dp
- button_corner_radius: [X]dp
- input_corner_radius: [X]dp
- dialog_corner_radius: [X]dp

- card_elevation: [X]dp
- button_elevation: [X]dp
- fab_elevation: [X]dp

- icon_size_small: [X]dp
- icon_size_medium: [X]dp
- icon_size_large: [X]dp

FONTS:
If using custom fonts, create font family XMLs for:
- [Font Name] Regular
- [Font Name] Medium
- [Font Name] Bold
- [Font Name] SemiBold
SECTION 2: WELCOME & ONBOARDING SCREENS
Prompt 2: Exact Welcome Screen Layout
Recreate my Figma welcome screen design exactly in WelcomeActivity:

SCREEN STRUCTURE:
[Describe your Figma layout]

Example structure to fill in:

Top Section (Height: [X]% of screen):
- Background: [gradient/solid color/image]
- App Logo:
  * Position: [centered/top-left/etc.]
  * Size: [X]dp x [X]dp
  * Margin from top: [X]dp
- App Name Text:
  * Text: "Business KPI Reporter"
  * Font: [font name], [size]sp, [weight]
  * Color: [hex color]
  * Margin from logo: [X]dp
- Tagline:
  * Text: "[Your tagline]"
  * Font: [font name], [size]sp, [weight]
  * Color: [hex color]
  * Margin from app name: [X]dp

Middle Section - Setup Options Cards:
Card Layout: [Linear/Grid/Custom]
Card Spacing: [X]dp between cards
Total Cards: 3

Card 1 - Load Demo Data:
- Width: [match_parent/X]dp
- Height: [wrap_content/X]dp
- Corner Radius: [X]dp
- Background: [color/gradient with start: [hex], end: [hex]]
- Elevation: [X]dp
- Padding: [X]dp

Card Content:
- Icon at [top/left]:
  * Icon: [icon name]
  * Size: [X]dp
  * Color: [hex color]
  * Margin: [X]dp
- Title:
  * Text: "Load Demo Data"
  * Font: [size]sp, [weight]
  * Color: [hex color]
  * Alignment: [left/center]
  * Margin from icon: [X]dp
- Description:
  * Text: "[Your description text]"
  * Font: [size]sp, [weight]
  * Color: [hex color]
  * Alignment: [left/center]
  * Margin from title: [X]dp
- Badge (Optional):
  * Text: "Recommended"
  * Background: [hex color]
  * Corner radius: [X]dp
  * Position: [top-right/etc.]
  * Padding: [X]dp horizontal, [X]dp vertical

Card 2 - Import Data:
[Same structure as Card 1, specify your design values]
- Icon: [icon name]
- Title: "Import Your Data"
- Description: "[Your description]"
- Background: [color/gradient]
[etc.]

Card 3 - Manual Setup:
[Same structure, specify your design values]
- Icon: [icon name]
- Title: "Start Fresh"
- Description: "[Your description]"
- Background: [color/gradient]
[etc.]

Bottom Section:
- Skip Button:
  * Position: [bottom-right/bottom-center]
  * Style: [Text button/Outlined]
  * Text: "Skip"
  * Text color: [hex color]
  * Margin from bottom: [X]dp

ANIMATIONS:
- Logo: [describe animation - fade in, zoom, etc.]
- Cards: [stagger animation, slide up, etc.]
- Duration: [X]ms
- Delay between cards: [X]ms

DIMENSIONS:
- Screen padding horizontal: [X]dp
- Screen padding vertical: [X]dp
- Card margin: [X]dp
- Card padding: [X]dp

Create the exact XML layout matching this Figma design.
Prompt 3: Exact Splash Screen Design
Recreate my Figma splash screen design in SplashActivity:

BACKGROUND:
- Type: [Solid color/Gradient/Image]
- If gradient:
  * Start color: [hex]
  * End color: [hex]
  * Angle: [X] degrees
  * Type: [linear/radial]
- If solid: [hex color]

LOGO:
- Position: [Exact position - center, or X,Y coordinates]
- Size: [X]dp width x [X]dp height
- Source: [drawable name]
- Scale type: [centerInside/fitCenter/etc.]

APP NAME:
- Text: "[Your app name]"
- Font: [font name]
- Size: [X]sp
- Weight: [normal/bold/etc.]
- Color: [hex color]
- Position: [below logo, margin [X]dp]
- Letter spacing: [X]

TAGLINE/SUBTITLE:
- Text: "[Your tagline]"
- Font: [font name]
- Size: [X]sp
- Color: [hex color with alpha if needed]
- Position: [below app name, margin [X]dp]

LOADING INDICATOR:
- Type: [Circular progress/Custom animation/Dots/Bar]
- Position: [bottom center, margin [X]dp from bottom]
- Color: [hex color]
- Size: [X]dp

VERSION TEXT:
- Text: "v1.0.0"
- Font: [font name]
- Size: [X]sp
- Color: [hex color]
- Position: [bottom center/bottom right, margin [X]dp]

ANIMATION:
- Logo animation: [fade in/scale/rotate/zoom]
- Duration: [X]ms
- App name animation: [fade in/slide up]
- Start delay: [X]ms
- Duration: [X]ms

TIMING:
- Minimum display duration: [X] seconds
- Maximum duration: [X] seconds

Create exact XML layout and animation resources.
Prompt 4: Exact Login Screen Layout
Recreate my Figma login screen design exactly:

SCREEN BACKGROUND:
- Type: [Gradient/Image/Solid]
- If gradient:
  * Orientation: [vertical/horizontal/diagonal]
  * Start color: [hex]
  * Center color (optional): [hex]
  * End color: [hex]

TOP SECTION (Header):
Height: [X]dp or [X]% of screen

- Logo:
  * Position: [center/top-left/custom]
  * Size: [X]dp x [X]dp
  * Margin from top: [X]dp
  * Shape: [Circle/Square/Custom]
  * Background (if any): [color]
  * Elevation: [X]dp

- Welcome Text:
  * Text: "[Your welcome text]"
  * Position: [below logo, margin [X]dp]
  * Font: [name], [size]sp, [weight]
  * Color: [hex]
  * Alignment: [center/left]

- Subtitle:
  * Text: "[Your subtitle]"
  * Font: [name], [size]sp, [weight]
  * Color: [hex]
  * Margin from welcome text: [X]dp

ANIMATED KPI PREVIEW CARDS SECTION:
Layout: [Grid 2x2 / Linear / Custom]
Container:
- Background: [transparent/color]
- Padding: [X]dp
- Margin from header: [X]dp
- Cards spacing: [X]dp

Card Design (for all 4 cards):
- Width: [X]dp or match_parent with weight
- Height: [X]dp
- Corner radius: [X]dp
- Elevation: [X]dp
- Padding: [X]dp

Card 1 - Revenue Growth:
- Background: [solid color/gradient]
  * If gradient: start [hex], end [hex], angle [X]
- Icon:
  * Name: [icon name]
  * Position: [top-left/center-left/etc.]
  * Size: [X]dp
  * Color: [hex]
  * Background circle (optional):
    - Size: [X]dp
    - Color: [hex with alpha]
- Title:
  * Text: "Revenue Growth"
  * Font: [name], [size]sp, [weight]
  * Color: [hex]
  * Position: [below icon / right of icon]
  * Margin: [X]dp
- Value:
  * Text: "+24.5%"
  * Font: [name], [size]sp, [weight]
  * Color: [hex]
  * Position: [bottom/center]
  * Margin: [X]dp
- Trend Arrow (optional):
  * Icon: [up/down arrow]
  * Size: [X]dp
  * Color: [hex]

Card 2 - Total Sales:
[Specify complete design like Card 1]
- Background: [color/gradient]
- Icon: [icon name]
- Title: "Total Sales"
- Value: "1,234"
[etc. - provide all measurements]

Card 3 - Inventory Status:
[Specify complete design]
- Background: [color/gradient]
- Icon: [icon name]
- Title: "Inventory Status"
- Value: "95%"
- Progress bar (if any):
  * Height: [X]dp
  * Color: [hex]
  * Background: [hex]
  * Corner radius: [X]dp
[etc.]

Card 4 - Profit Margin:
[Specify complete design]
- Background: [color/gradient]
- Icon: [icon name]
- Title: "Profit Margin"
- Value: "18.2%"
[etc.]

LOGIN FORM SECTION:
Container:
- Type: [CardView/Frame/None]
- Background: [color with alpha for transparency]
- Corner radius: [X]dp
- Elevation: [X]dp
- Padding: [X]dp horizontal, [X]dp vertical
- Margin from KPI cards: [X]dp
- Margin from screen edges: [X]dp

Email Input Field:
- Type: TextInputLayout with TextInputEditText
- Style: [Filled/Outlined]
- Hint: "[Your hint text]"
- Hint color: [hex]
- Box corner radius: [X]dp
- Box background color: [hex]
- Box stroke width: [X]dp
- Box stroke color: [hex]
- Start icon: [icon name]
- Start icon tint: [hex]
- Text color: [hex]
- Text size: [X]sp
- Height: [X]dp
- Margin bottom: [X]dp

Password Input Field:
[Same structure as email, specify your values]
- End icon mode: password_toggle
- Password toggle tint: [hex]

Remember Me Checkbox:
- Position: [below password, left aligned]
- Text: "Remember me"
- Text color: [hex]
- Text size: [X]sp
- Checkbox tint: [hex]
- Margin top: [X]dp

Forgot Password:
- Position: [right side, aligned with Remember Me]
- Text: "Forgot Password?"
- Text color: [hex]
- Text size: [X]sp
- Style: [underline/normal]

Login Button:
- Width: [match_parent/X]dp
- Height: [X]dp
- Background: [color/gradient]
  * If gradient: start [hex], end [hex]
- Corner radius: [X]dp
- Text: "[Your button text]"
- Text color: [hex]
- Text size: [X]sp
- Text style: [bold/all caps/normal]
- Elevation: [X]dp
- Margin top: [X]dp
- Ripple color: [hex]

BOTTOM SECTION:
- Divider (if any):
  * Text: "OR"
  * Position: [center]
  * Margin: [X]dp vertical

- Sign Up Section:
  * Layout: [LinearLayout horizontal]
  * Text 1: "Don't have an account?"
  * Text 1 color: [hex]
  * Text 2: "Sign Up"
  * Text 2 color: [hex]
  * Text 2 style: [bold/underline]
  * Position: [center, margin [X]dp from bottom]

- Copyright:
  * Text: "© 2025 Business KPI Reporter"
  * Color: [hex]
  * Size: [X]sp
  * Position: [bottom center, margin [X]dp from bottom]

ANIMATIONS TO IMPLEMENT:
- KPI Cards: [describe animation sequence]
  * Card 1 appears at: [X]ms, animation: [type]
  * Card 2 appears at: [X]ms, animation: [type]
  * Card 3 appears at: [X]ms, animation: [type]
  * Card 4 appears at: [X]ms, animation: [type]
- Values animate: [count up/fade/scale]
- Form slide in from: [bottom/fade in]

RESPONSIVE BEHAVIOR:
- Portrait mode: [describe layout]
- Landscape mode: [describe layout changes]

Create exact XML layout with all these specifications.
SECTION 3: MAIN APP LAYOUT & NAVIGATION
Prompt 5: Exact Main Activity Layout with Navigation
Recreate my Figma main app layout exactly in MainActivity:

OVERALL STRUCTURE:
Layout type: [DrawerLayout/CoordinatorLayout/ConstraintLayout]

NAVIGATION DRAWER (LEFT PANEL):
Width: [X]dp or [X]% of screen width
Background: [color/gradient]

Header Section:
Height: [X]dp
Background: [color/gradient/image]
- If gradient: start [hex], end [hex], orientation [vertical/horizontal]

User Profile:
- Avatar:
  * Position: [top-left at [X]dp, [X]dp]
  * Size: [X]dp circle
  * Border: [X]dp, color [hex]
  * Placeholder background: [hex]
- User Name:
  * Text: "[Dynamic username]"
  * Position: [below/right of avatar, margin [X]dp]
  * Font: [name], [size]sp, [weight]
  * Color: [hex]
- User Role Badge:
  * Position: [below username, margin [X]dp]
  * Background: [hex]
  * Corner radius: [X]dp
  * Padding: [X]dp horizontal, [X]dp vertical
  * Text color: [hex]
  * Text size: [X]sp
- Edit Profile Icon:
  * Position: [top-right of header]
  * Icon: [icon name]
  * Size: [X]dp
  * Tint: [hex]
  * Margin: [X]dp

Menu Items Section:
Background: [color]
Padding: [X]dp top

Menu Item Design (for each item):
- Height: [X]dp
- Padding: [X]dp horizontal, [X]dp vertical
- Ripple effect color: [hex]
- Selected background: [hex]
- Default background: transparent

Menu Item Structure:
- Icon:
  * Position: [left, margin [X]dp]
  * Size: [X]dp
  * Default tint: [hex]
  * Selected tint: [hex]
- Text:
  * Position: [right of icon, margin [X]dp]
  * Font: [name], [size]sp, [weight]
  * Default color: [hex]
  * Selected color: [hex]
- Badge (for notifications):
  * Position: [right side]
  * Background: [hex] (red circle)
  * Size: [X]dp
  * Text color: [hex]
  * Text size: [X]sp

MENU ITEMS LIST (specify for each):
1. Dashboard:
   - Icon: [icon name]
   - Text: "Dashboard"
   - Badge: [none/number]

2. Analytics:
   - Icon: [icon name]
   - Text: "Analytics"
   - Badge: [none]

3. Inventory:
   - Icon: [icon name]
   - Text: "Inventory"
   - Badge: [low stock count]

4. Sales:
   - Icon: [icon name]
   - Text: "Sales"
   - Badge: [none]

5. Alerts:
   - Icon: [icon name]
   - Text: "Alerts"
   - Badge: [alert count with background color]

6. Stores:
   - Icon: [icon name]
   - Text: "Stores"
   - Badge: [none]

7. Customers:
   - Icon: [icon name]
   - Text: "Customers"
   - Badge: [none]

8. Reports:
   - Icon: [icon name]
   - Text: "Reports"
   - Badge: [none]

[Divider line:
- Height: [X]dp
- Color: [hex]
- Margin: [X]dp vertical]

9. Settings:
   - Icon: [icon name]
   - Text: "Settings"

10. Help & Support:
    - Icon: [icon name]
    - Text: "Help & Support"

11. Logout:
    - Icon: [icon name]
    - Text: "Logout"
    - Text color: [hex] (red for emphasis)

BOTTOM SECTION (in drawer):
Position: [bottom of drawer]
- App version:
  * Text: "Version 1.0.0"
  * Color: [hex]
  * Size: [X]sp
  * Margin: [X]dp from bottom
- Copyright:
  * Text: "© 2025 All Rights Reserved"
  * Color: [hex]
  * Size: [X]sp
  * Margin: [X]dp

MAIN CONTENT AREA:
Structure: [CoordinatorLayout with AppBarLayout + FrameLayout]

Top App Bar (Toolbar):
Height: [X]dp
Background: [color/gradient]
Elevation: [X]dp

Left Side:
- Menu Icon (hamburger):
  * Icon: [menu icon]
  * Size: [X]dp
  * Tint: [hex]
  * Margin: [X]dp

Center:
- Screen Title:
  * Text: "[Dynamic - changes per screen]"
  * Font: [name], [size]sp, [weight]
  * Color: [hex]
  * Alignment: [center/left]

Right Side:
- Store Filter Icon:
  * Icon: [icon name]
  * Size: [X]dp
  * Tint: [hex]
  * Margin: [X]dp from title
- Notification Icon:
  * Icon: [bell icon]
  * Size: [X]dp
  * Tint: [hex]
  * Badge (if notifications):
    - Size: [X]dp circle
    - Color: [hex] (red)
    - Position: [top-right of icon]
- Profile Icon:
  * Type: [Avatar image]
  * Size: [X]dp circle
  * Margin: [X]dp from edge

Content Container (FrameLayout):
- ID: fragment_container
- Background: [hex]
- This is where fragments load

Bottom Navigation Bar (if used instead of/with drawer):
Height: [X]dp
Background: [color]
Elevation: [X]dp

Bottom Nav Items (specify each):
1. Home:
   - Icon: [icon name]
   - Text: "Home"
   - Icon size: [X]dp
   - Text size: [X]sp
   - Active color: [hex]
   - Inactive color: [hex]

2. Analytics:
   - Icon: [icon name]
   - Text: "Analytics"
   [etc.]

3. Add (center FAB if used):
   - Type: FloatingActionButton
   - Size: [X]dp
   - Background: [hex/gradient]
   - Icon: [plus icon]
   - Icon size: [X]dp
   - Icon tint: [hex]
   - Elevation: [X]dp
   - Margin: [X]dp from bottom

4. Alerts:
   - Icon: [icon name]
   - Text: "Alerts"
   [etc.]

5. More:
   - Icon: [icon name]
   - Text: "More"
   [etc.]

Bottom Nav Configuration:
- Label visibility: [always/selected/never]
- Animation: [scale/shift/none]
- Background shape: [rounded/flat]
- Indicator: [type and color]

FLOATING ACTION BUTTON (if used):
Position: [bottom-right, margin [X]dp, [X]dp]
Size: [normal/mini/auto - [X]dp]
Background: [color/gradient]
Icon: [icon name]
Icon color: [hex]
Elevation: [X]dp
Ripple color: [hex]

DIMENSIONS:
- Status bar height handling: [transparent/colored]
- Navigation bar handling: [transparent/colored]
- Safe area insets: [specify]

Create complete MainActivity XML with NavigationView and all specifications.
SECTION 4: DASHBOARD SCREEN EXACT DESIGN
Prompt 6: Exact Dashboard Fragment Layout
Recreate my Figma dashboard design exactly in DashboardFragment:

OVERALL LAYOUT:
Root: [NestedScrollView/ScrollView]
Background: [hex color]
Padding: [X]dp

TOP HEADER SECTION:
Container type: [CardView/LinearLayout]
Background: [color/gradient]
- If gradient: start [hex], end [hex], angle [X]
Corner radius (if card): [X]dp
Elevation: [X]dp
Padding: [X]dp
Margin bottom: [X]dp

Header Content:
- Greeting Text:
  * Text: "Good Morning, [Name]" (dynamic based on time)
  * Font: [name], [size]sp, [weight]
  * Color: [hex]
- Date Text:
  * Text: "[Day], [Date] [Month] [Year]"
  * Font: [name], [size]sp
  * Color: [hex]
  * Margin top: [X]dp

STORE FILTER SECTION:
Position: [below header, margin [X]dp]
Layout: [HorizontalScrollView with ChipGroup]

Chip Design:
- Height: [X]dp
- Padding: [X]dp horizontal, [X]dp vertical
- Corner radius: [X]dp
- Stroke width: [X]dp
- Default:
  * Background: transparent
  * Stroke color: [hex]
  * Text color: [hex]
- Selected:
  * Background: [hex]
  * Stroke color: [hex]
  * Text color: [hex]
- Text size: [X]sp
- Margin end: [X]dp

Chips:
1. "All Stores"
2. "Store 1"
3. "Store 2"
[etc. - dynamic from database]

KPI CARDS GRID:
Layout: [GridLayout/LinearLayout with weights]
Columns: [2]
Column spacing: [X]dp
Row spacing: [X]dp
Margin top: [X]dp

CARD DESIGN TEMPLATE (for all KPI cards):
- Width: [match_parent with weight / specific dp]
- Height: [X]dp
- Corner radius: [X]dp
- Elevation: [X]dp
- Padding: [X]dp
- Card animation on appear: [fade/scale/slide]

KPI CARD 1 - TOTAL REVENUE:
Background: [solid/gradient]
- If gradient: orientation [angle], colors [hex] to [hex]

Content Layout: [Vertical/Horizontal]
- Icon:
  * Name: [icon name]
  * Size: [X]dp
  * Position: [top-left/center-left]
  * Tint: [hex or gradient]
  * Background (optional):
    - Shape: circle
    - Size: [X]dp
    - Color: [hex with alpha]
  * Margin: [X]dp

- Label:
  * Text: "Total Revenue"
  * Font: [name], [size]sp, [weight]
  * Color: [hex]
  * Position: [below/beside icon]
  * Margin: [X]dp

- Value:
  * Text: "₹1,24,350" (dynamic)
  * Font: [name], [size]sp, [weight - bold/extra bold]
  * Color: [hex]
  * Position: [below label / bottom of card]
  * Margin: [X]dp
  * Number format: [comma separated]

- Trend Indicator:
  * Layout: horizontal
  * Arrow icon: [up/down arrow]
  * Arrow size: [X]dp
  * Arrow color: [hex green for up, red for down]
  * Percentage text: "+12.5%"
  * Percentage font: [name], [size]sp
  * Percentage color: [hex]
  * Position: [below value]
  * Margin: [X]dp

- Sparkline Chart (optional mini chart):
  * Position: [right side / bottom]
  * Size: [X]dp x [X]dp
  * Line color: [hex]
  * Line width: [X]dp

KPI CARD 2 - TOTAL SALES:
[Specify complete design similar to Card 1]
Background gradient: [hex] to [hex]
Icon: [icon name], color [hex]
Label: "Total Sales"
Value: "1,234"
Trend: "+85 today" with color [hex]
[All measurements as per your Figma]

KPI CARD 3 - LOW STOCK ALERT:
[Specify complete design]
Background gradient: [hex] to [hex]
Icon: [warning icon], color [hex]
Label: "Low Stock"
Value: "8 Products"
Action text: "View Details" with color [hex]
Badge: Red pulsing dot (size [X]dp)
[All measurements]

KPI CARD 4 - PROFIT MARGIN:
[Specify complete design]
Background gradient: [hex] to [hex]
Icon: [icon name], color [hex]
Label: "Profit Margin"
Value: "18.5%"
Progress bar:
- Width: match_parent
- Height: [X]dp
- Progress color: [hex]
- Background: [hex]
- Corner radius: [X]dp
- Margin top: [X]dp
[All measurements]

KPI CARD 5 - DEAD STOCK:
[Specify complete design]
Background: [hex] (red-tinted)
Icon: [delete icon]
Label: "Dead Stock"
Value: "5 Items"
Subtitle: "90+ days no sales"
[All measurements]

KPI CARD 6 - INVENTORY TURNOVER:
[Specify complete design]
Background gradient: [hex] to [hex]
Icon: [cached icon]
Label: "Inventory Turnover"
Value: "4.2x"
Circular progress indicator (optional):
- Outer circle size: [X]dp
- Inner circle size: [X]dp
- Color: [hex]
[All measurements]

QUICK ACTIONS SECTION:
Position: [below KPI cards, margin [X]dp]
Title: "Quick Actions"
Title font: [name], [size]sp, [weight]
Title color: [hex]
Title margin bottom: [X]dp

Layout: [HorizontalScrollView with LinearLayout]
Padding: [X]dp vertical

Action Button Design (for each):
- Type: CardView with vertical LinearLayout
- Width: [X]dp
- Height: [X]dp
- Corner radius: [X]dp
- Elevation: [X]dp
- Background: [hex]
- Margin end: [X]dp
- Ripple: [hex]

Button Content:
- Icon:
  * Size: [X]dp
  * Position: [center-top]
  * Tint: [hex]
  * Background circle (optional):
    - Size: [X]dp
    - Color: [hex with alpha]
- Label:
  * Font: [name], [size]sp
  * Color: [hex]
  * Position: [below icon, margin [X]dp]
  * Alignment: center

Quick Action Buttons (specify each):
1. Add Sale:
   - Icon: [icon name]
   - Background: [hex]
   - Label: "Add Sale"

2. Add Product:
   - Icon: [icon name]
   - Background: [hex]
   - Label: "Add Product"

3. View Reports:
   - Icon: [icon name]
   - Background: [hex]
   - Label: "Reports"

4. Scan Barcode:
   - Icon: [icon name]
   - Background: [hex]
   - Label: "Scan"

CHART SECTION:
Position: [below quick actions, margin [X]dp]
Container: CardView
Background: [hex]
Corner radius: [X]dp
Elevation: [X]dp
Padding: [X]dp

Chart Header:
- Title: "Sales Trend"
- Title font: [name], [size]sp, [weight]
- Title color: [hex]
- Filter tabs (optional):
  * TabLayout with tabs: 7D, 30D, 3M, 1Y
  * Tab text size: [X]sp
  * Selected color: [hex]
  * Unselected color: [hex]
  * Indicator color: [hex]
  * Indicator height: [X]dp

Chart:
- Type: LineChart from MPAndroidChart
- Height: [X]dp
- Line color: [hex]
- Line width: [X]dp
- Fill gradient: [hex with alpha] to transparent
- Grid lines color: [hex]
- X-axis text size: [X]sp
- Y-axis text size: [X]sp
- Axis text color: [hex]
- Margin top: [X]dp

RECENT SALES SECTION:
Position: [below chart, margin [X]dp]
Container: CardView
Background: [hex]
Corner radius: [X]dp
Elevation: [X]dp
Padding: [X]dp

Section Header:
- Layout: horizontal with space between
- Title: "Recent Sales"
- Title font: [name], [size]sp, [weight]
- Title color: [hex]
- "View All" link:
  * Font: [name], [size]sp
  * Color: [hex] (accent)
  * Icon: arrow_forward (size [X]dp)

RecyclerView (for sales items):
- Item design (specify):
  * Height: [X]dp or wrap_content
  * Padding: [X]dp
  * Background: [transparent/subtle color]
  * Divider: [X]dp line, color [hex]
  * Ripple effect: [hex]

Sale Item Layout:
- Left section (product info):
  * Product icon/image: [X]dp circle
  * Product name: font [size]sp, color [hex]
  * Sale date/time: font [size]sp, color [hex]
  * Layout: vertical

- Right section (amount):
  * Amount: font [size]sp bold, color [hex]
  * Quantity badge: 
    - Background: [hex]
    - Corner radius: [X]dp
    - Padding: [X]dp
    - Font size: [X]sp
  * Layout: vertical, gravity end

- Left border (colored by amount/status):
  * Width: [X]dp
  * Color: [dynamic - green/orange/red]

PULL-TO-REFRESH:
- SwipeRefreshLayout colors: [hex], [hex], [hex]
- Progress background: [hex]

EMPTY STATE (if no data):
- Illustration: [drawable name]
- Illustration size: [X]dp
- Message: "No data available"
- Message font: [name], [size]sp, [weight]
- Message color: [hex]
- Button: "Load Demo Data"
- Button background: [hex]
- Button corner radius: [X]dp

RESPONSIVE BEHAVIOR:
- Phone portrait: 2 column KPI grid
- Phone landscape: 3 column KPI grid
- Tablet: 3-4 column KPI grid

Create complete XML layout matching this exact design.
SECTION 5: ALL OTHER SCREENS
Prompt 7: Exact Inventory Screen Layout
Recreate my Figma inventory management screen in InventoryFragment:

[Follow same detailed format as Dashboard]

TOP BAR:
Search bar design:
- Height: [X]dp
- Corner radius: [X]dp
- Background: [hex]
- Elevation: [X]dp
- Hint text: "[Your hint]"
- Hint color: [hex]
- Text color: [hex]
- Icon: [search icon]
- Icon tint: [hex]
- Icon size: [X]dp
- Padding: [X]dp
- Margin: [X]dp

FILTER CHIPS:
ChipGroup design:
- Layout: [horizontal scroll]
- Chip height: [X]dp
- Chip background selected: [hex]
- Chip background unselected: [hex]
- Chip text color selected: [hex]
- Chip text color unselected: [hex]
- Chip corner radius: [X]dp
- Chip spacing: [X]dp

Chips:
1. "All" - icon: [icon name]
2. "Low Stock" - icon: [icon name], badge color: [hex]
3. "Dead Stock" - icon: [icon name], badge color: [hex]
4. "By Category" - icon: [icon name]

SORT DROPDOWN:
- Position: [right side of filters]
- Icon: [sort icon]
- Icon size: [X]dp
- Text: "Sort"
- Text size: [X]sp
- Dropdown style: [material/custom]

VIEW TOGGLE:
- Position: [right side]
- Icons: [grid icon / list icon]
- Size: [X]dp
- Selected color: [hex]
- Unselected color: [hex]

PRODUCT CARD (List View):
CardView design:
- Width: match_parent
- Height: [wrap_content / X]dp
- Corner radius: [X]dp
- Elevation: [X]dp
- Background: [hex]
- Margin: [X]dp horizontal, [X]dp vertical
- Padding: [X]dp

Card Layout Structure:
- Left colored strip:
  * Width: [X]dp
  * Height: match_parent
  * Color: [dynamic - green/orange/red based on stock]

- Product Image (optional):
  * Position: [left, after strip]
  * Size: [X]dp x [X]dp
  * Shape: [circle/rounded square]
  * Corner radius: [X]dp
  * Background: [hex]
  * Margin: [X]dp

- Main Content (center):
  * Product Name:
    - Font: [name], [size]sp, [weight]
    - Color: [hex]
    - Max lines: 2
    - Ellipsize: end
  
  * Category Chip:
    - Background: [hex]
    - Corner radius: [X]dp
    - Padding: [X]dp horizontal, [X]dp vertical
    - Text size: [X]sp
    - Text color: [hex]
    - Margin top: [X]dp
  
  * Price:
    - Font: [name], [size]sp, [weight]
    - Color: [hex]
    - Margin top: [X]dp
  
  * Stock Progress Bar:
    - Width: match_parent
    - Height: [X]dp
    - Progress color: [dynamic green/orange/red]
    - Background: [hex]
    - Corner radius: [X]dp
    - Margin top: [X]dp
  
  * Stock Text:
    - Text: "X units left"
    - Font: [name], [size]sp
    - Color: [hex]
    - Margin top: [X]dp
  
  * Restock Date (if exists):
    - Icon: [calendar icon], size [X]dp
    - Text: "Restock: DD/MM/YYYY"
    - Font: [name], [size]sp
    - Color: [hex]
    - Margin top: [X]dp

- Right Section:
  * Three-dot menu:
    - Icon: [more_vert]
    - Size: [X]dp
    - Tint: [hex]
    - Position: [top-right]

DEAD STOCK INDICATOR (if applicable):
- Ribbon:
  * Position: [top-right corner, diagonal]
  * Background: [hex red]
  * Width: [X]dp
  * Height: [X]dp
  * Rotation: 45 degrees
  * Text: "DEAD"
  * Text color: [hex white]
  * Text size: [X]sp

- Or Badge:
  * Position: [top-right]
  * Background: [hex red]
  * Corner radius: [X]dp
  * Text: "Dead Stock"
  * Padding: [X]dp
  * Pulsing animation

PRODUCT CARD (Grid View):
- Width: [match_parent with weight 0.5 for 2 columns]
- Height: [X]dp
- [Specify complete compact design for grid view]

FAB (Add Product):
- Position: [bottom-right]
- Margin: [X]dp from edges
- Size: [normal / X]dp
- Background: [hex/gradient]
- Icon: [add icon]
- Icon color: [hex]
- Elevation: [X]dp

Specify all measurements from your Figma design.
Prompt 8: Exact Analytics Screen with Charts
Recreate my Figma analytics screen in AnalyticsFragment:

[Provide complete specifications for:]

1. Date Range Selector:
   - Position, size, colors, fonts
   - Chip design for: 7D, 30D, 3M, 1Y, Custom

2. Each Chart Container (CardView):
   - Dimensions, padding, margin, elevation
   - Header design (title, filters)
   - Chart specifications (colors, sizes, fonts)
   - Legend design

3. Chart 1 - Sales Trend Line Chart:
   [Complete specs from Figma]

4. Chart 2 - Category Bar Chart:
   [Complete specs from Figma]

5. Chart 3 - Revenue Pie Chart:
   [Complete specs from Figma]

6. Chart 4 - Store Comparison:
   [Complete specs from Figma]

[Provide all measurements, colors, fonts as detailed as previous prompts]
Prompt 9: Exact Sales Management Screen
Recreate my Figma sales management screen in SalesFragment:

[Follow same detailed format]

Top Stats Cards:
[Specify 4 horizontal scroll cards with complete design specs]

Filter Section:
[Specify all filter UI elements with exact measurements]

Sales List RecyclerView:
[Specify item design with all details]

Add Sale FAB:
[Specify design]

Swipe Actions:
[Specify reveal animation and button design]

[Provide all specifications from your Figma]
Prompt 10: Exact Alerts Screen
Recreate my Figma alerts screen in AlertsFragment:

Tab Layout:
[Specify tab design: All, Critical, Warnings, Info]

Alert Card Types (specify each):
1. Low Stock Alert - complete design
2. Dead Stock Alert - complete design  
3. Restock Reminder - complete design
4. High Value Sale - complete design
5. Target Achievement - complete design

[Provide all measurements, colors, icons from Figma]
Prompt 11: Product Detail Screen
Recreate my Figma product detail screen in ProductDetailActivity:

CollapsingToolbarLayout:
[Specify header image, title overlay, toolbar specs]

Scrollable Content Sections:
1. Basic Info Card - [complete specs]
2. Stock Status Card with circular progress - [complete specs]
3. Restock Info Card - [complete specs]
4. Sales Performance Card with mini chart - [complete specs]
5. Sales History Timeline - [complete specs]

Bottom Action Buttons:
[Specify button designs, sizes, colors]

[Provide all Figma specifications]
Prompt 12: Add/Edit Product Form
Recreate my Figma add product screen in AddEditProductActivity:

Form Layout:
[Specify each TextInputLayout design exactly:]
- Product Name field - [all specs]
- Category dropdown - [all specs]
- Price field - [all specs]
- Cost price field - [all specs]
- Stock field - [all specs]
- Low stock threshold - [all specs with SeekBar design if used]
- Description field - [all specs]
- Restock date picker - [all specs]

Image Upload Section:
[Specify design, placeholder, camera/gallery buttons]

Save Button:
[Specify complete design]

[Provide all Figma measurements]
Prompt 13: Settings Screen
Recreate my Figma settings screen in SettingsActivity:

PreferenceScreen Layout:
[Specify each preference category and item design]

Section Headers:
[Typography, colors, spacing]

Preference Items:
[Switch design, dropdown design, seekbar design]

[Provide all Figma specifications]
SECTION 6: COMPONENTS & RESOURCES
Prompt 14: Create All Drawable Resources
Create all drawable XML files matching my Figma designs:

GRADIENTS:
1. login_background_gradient.xml:
   - Type: [linear/radial/sweep]
   - Start color: [hex]
   - End color: [hex]
   - Angle: [X]

2. revenue_card_gradient.xml:
   [specs]

3. sales_card_gradient.xml:
   [specs]

[Create for all gradients used]

SHAPES:
1. rounded_button.xml:
   - Shape: rectangle
   - Corner radius: [X]dp
   - Solid color: [hex]

2. rounded_card.xml:
   [specs]

3. circular_background.xml:
   [specs]

[Create all shape drawables from your Figma]

SELECTORS:
1. button_selector.xml:
   - State pressed: [drawable/color]
   - State default: [drawable/color]

[Create all selectors]

RIPPLES:
1. ripple_effect.xml:
   - Ripple color: [hex]
   - Background: [drawable]

[Create all ripple effects]
Prompt 15: Create All Animation Resources
Create all animation XML files from Figma interactions:

1. fade_in.xml:
   - Duration: [X]ms
   - From alpha: 0
   - To alpha: 1

2. slide_up.xml:
   - Duration: [X]ms
   - From Y: [X]%
   - To Y: 0

3. scale_animation.xml:
   [specs]

4. card_appear_animation.xml:
   [specs for your card entrance]

[Create all animations matching Figma prototypes]
Prompt 16: Create Custom Styles
Create styles.xml with all custom styles from Figma:

<style name="AppTheme" parent="Theme.Material3...">
    [All theme attributes from your Figma]
</style>

<style name="CardViewStyle">
    [Card styling from Figma]
</style>

<style name="ButtonPrimary">
    [Primary button style from Figma]
</style>

<style name="ButtonSecondary">
    [Secondary button style from Figma]
</style>

<style name="TextInputLayoutStyle">
    [Input field style from Figma]
</style>

<style name="ChipStyle">
    [Chip style from Figma]
</style>

[Create all custom styles matching your Figma components]