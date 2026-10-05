1. Overview

InnerBetter is a mobile-first commerce UI that consistently uses rounded rectangles across cards, buttons, and input fields, giving it a soft, approachable feel. The background is white-based by default, with a Green brand color used as an accent on primary actions, and a Violet grayscale used as the neutral tone throughout text, backgrounds, and inactive elements.

2. Color

Violet (neutral/text grayscale)

Token Value
violet-light
#F3F3F4
violet-light-hover
#EDEDEE
violet-light-active
#DADADB
violet-normal
#89878C
violet-normal-hover
#7B7A7E
violet-normal-active
#6E6C70
violet-dark
#676569
violet-dark-hover
#525154
violet-dark-active
#3E3D3F
violet-darker
#302F31

Green (brand color)

Token Value
green-50
#FDFDF0
green-100
#F8F9C1
green-200
#F5F6BB
green-300
#F0F29C
green-400
#EDF089
green-500 (base)
#E9EC6B
green-600
#D4D761
green-700
#A5A84C
green-800
#80823B
green-900
#62632D

Base (background)

Token Value
white
#FFFFFF

Error (status color)

Token Value
error
#FF0000

3. Typography
Use Size
Large title 24px
Section title 18px
Button/input label 16px
Body/product name 14px
Caption/secondary text 12px (fixed)

Font family: Inter
Allowed weights: Regular (400) / Medium (500) / SemiBold (600) only

4. Layout & Shape
   Mobile frame baseline 375×812, fixed 20px side margins
   Product thumbnails: 162×162 square, circular add(+) button overlaid at bottom-right
   Repeating header structure: 46px status bar + 60px top bar
   Fixed bottom button area: height varies by state (92px–146px)
   Shadow usage not verifiable from current metadata

Corner radius rules

Radius Applied to
6px Inputs, quantity steppers, and other small content boxes
8px Cards, buttons
12px Modals, list items, and other mid-size containers
14px Large section boxes, bottom sheets, and other top-level containers 5. Components
Quantity stepper (+/−): Circular −/+ button pair inside a dark-background list item, 6px radius
List item (dark): Label + quantity stepper combination, 6px radius
Banner/toast (green): Variable-width colored block with status text, 8px radius
Bottom button: Variants — active / disabled / minimum order reached / payment amount reached / payment not reached / checkout, 8px radius
Modal: Combinations of 1–2 subtitles × 1–2 buttons, 12px radius
Toast: primary / secondary, 8px radius
Product card: Square image + circular add button + product name (2 lines) + price, image radius 8px 6. Do / Don't

Do

Use only the green-500 family for primary action buttons; handle state changes within the tone ramp
Keep the fixed type scale: caption 12 / body 14 / label 16 / section 18 / large title 24
Use only the 4 defined radius values (6/8/12/14)

Don't

Don't add arbitrary raw colors outside the Base/Violet/Green/Error palettes as accents
Don't use font weights other than Inter Regular/Medium/Semi Bold
Don't use sizes outside the defined type scale
Don't use radius values outside the defined set
