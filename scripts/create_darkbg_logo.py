import os
from PIL import Image, ImageFilter

src_path = "public/brand/beadssource-logo@2x.png"
img = Image.open(src_path).convert("RGBA")
w, h = img.size

# 1. Dark-background optimized version:
# Add a very subtle crisp white drop-shadow/glow so the dark purple at the bottom is crystal clear on black/dark charcoal backgrounds
# Create expanded canvas for shadow
glow_canvas = Image.new("RGBA", (w + 8, h + 8), (0, 0, 0, 0))
# Extract alpha mask
alpha = img.split()[-1]
# Create white silhouette for shadow
white_silhouette = Image.new("RGBA", (w, h), (255, 255, 255, 0))
white_silhouette.putalpha(alpha)

# Paste white silhouette and blur slightly for glow
glow_layer = Image.new("RGBA", (w + 8, h + 8), (0, 0, 0, 0))
glow_layer.paste(white_silhouette, (4, 4))
blurred_glow = glow_layer.filter(ImageFilter.GaussianBlur(radius=1.5))

# Dark background version
dark_bg_logo = Image.new("RGBA", (w + 8, h + 8), (0, 0, 0, 0))
# Paste blurred white glow with 40% opacity
glow_r, glow_g, glow_b, glow_a = blurred_glow.split()
glow_a = glow_a.point(lambda p: int(p * 0.45))
dark_bg_logo.paste((255, 255, 255, 255), (0, 0), mask=glow_a)
# Paste original crisp logo on top
dark_bg_logo.paste(img, (4, 4), mask=img)

dark_bg_logo.save("public/brand/beadssource-logo-darkbg@2x.png", "PNG")
print("Saved dark background logo to public/brand/beadssource-logo-darkbg@2x.png")

# Also copy standard logo directly to public/logo.png for universal access
img.save("public/logo.png", "PNG")
print("Saved public/logo.png")
