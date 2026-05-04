from PIL import Image
import os

# Load the sprite sheet
sprite_sheet = Image.open('/mnt/user-data/uploads/treasures.png')

# Define approximate coordinates for each treasure (x, y, width, height)
# Based on visual analysis of the 2x5 grid
treasures = [
    # Top row
    (30, 20, 350, 260),      # treasure-1: coins
    (420, 60, 220, 220),     # treasure-2: red gem
    (680, 60, 220, 220),     # treasure-3: green gem
    (940, 60, 220, 220),     # treasure-4: blue gem
    (1180, 30, 280, 280),    # treasure-5: treasure chest
    
    # Bottom row
    (30, 300, 290, 380),     # treasure-6: open chest
    (360, 310, 300, 360),    # treasure-7: crown
    (700, 330, 200, 340),    # treasure-8: goblet
    (930, 340, 250, 330),    # treasure-9: compass
    (1210, 360, 240, 290),   # treasure-10: ring
]

output_dir = '/home/claude/torch-hunt/src/assets/treasures'
os.makedirs(output_dir, exist_ok=True)

for i, (x, y, w, h) in enumerate(treasures, 1):
    # Crop the treasure
    treasure = sprite_sheet.crop((x, y, x + w, y + h))
    
    # Get bounding box to remove excess transparency
    bbox = treasure.getbbox()
    if bbox:
        treasure = treasure.crop(bbox)
    
    # Save the individual treasure
    treasure.save(f'{output_dir}/treasure-{i}.png')
    print(f'Extracted treasure-{i}.png - Size: {treasure.size}')

print('\nAll treasures extracted successfully!')
