import os
from PIL import Image

src_path = r"C:/Users/anilb/.gemini/antigravity/brain/688f0e0a-4cca-4ce8-83be-f0a4150689be/.user_uploaded/media_1794928771519.png"
img = Image.open(src_path).convert("RGBA")
width, height = img.size

# High-quality alpha matting:
# The background is white (254, 254, 252)
# Calculate opacity based on distance from pure white
new_img = Image.new("RGBA", (width, height), (0, 0, 0, 0))

for y in range(height):
    for x in range(width):
        r, g, b, a = img.getpixel((x, y))
        # Distance from white (255, 255, 255)
        # Luminance
        lum = 0.299 * r + 0.587 * g + 0.114 * b
        if lum > 250:
            # Pure white background -> fully transparent
            new_img.putpixel((x, y), (r, g, b, 0))
        elif lum > 230:
            # Anti-aliased edge -> blend alpha
            alpha = int(255 * (250 - lum) / 20)
            new_img.putpixel((x, y), (r, g, b, alpha))
        else:
            new_img.putpixel((x, y), (r, g, b, 255))

# Crop transparent border
bbox = new_img.getbbox()
if bbox:
    cropped = new_img.crop(bbox)
else:
    cropped = new_img

# Save standard logo
os.makedirs("public/brand", exist_ok=True)
cropped.save("public/brand/beadssource-logo.png", "PNG")
print(f"Saved cropped logo (size {cropped.size}) to public/brand/beadssource-logo.png")

# Also create high-res 2x / 3x supersampled version
high_res = cropped.resize((cropped.width * 2, cropped.height * 2), Image.Resampling.LANCZOS)
high_res.save("public/brand/beadssource-logo@2x.png", "PNG")
print(f"Saved 2x logo (size {high_res.size}) to public/brand/beadssource-logo@2x.png")
