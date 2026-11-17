from PIL import Image

src_path = r"C:/Users/anilb/.gemini/antigravity/brain/688f0e0a-4cca-4ce8-83be-f0a4150689be/.user_uploaded/media_1794928771519.png"
img = Image.open(src_path).convert("RGBA")
width, height = img.size

# Find letter pixels
letter_pixels = []
for y in range(height):
    for x in range(width):
        r, g, b, a = img.getpixel((x, y))
        if r < 240 or g < 240 or b < 240:
            letter_pixels.append((x, y, r, g, b))

print(f"Total letter pixels: {len(letter_pixels)}")
# Find y min and y max of letters
ys = [p[1] for p in letter_pixels]
xs = [p[0] for p in letter_pixels]
print(f"X range: {min(xs)} to {max(xs)}, Y range: {min(ys)} to {max(ys)}")

# Sample top of a letter (y = min(ys)) and bottom of letter (y = max(ys))
top_p = [p for p in letter_pixels if p[1] == min(ys) + 2][10]
mid_p = [p for p in letter_pixels if p[1] == (min(ys) + max(ys)) // 2][10]
bot_p = [p for p in letter_pixels if p[1] == max(ys) - 2][10]

print(f"Top color (hex): #{top_p[2]:02x}{top_p[3]:02x}{top_p[4]:02x} -> RGB({top_p[2]}, {top_p[3]}, {top_p[4]})")
print(f"Mid color (hex): #{mid_p[2]:02x}{mid_p[3]:02x}{mid_p[4]:02x} -> RGB({mid_p[2]}, {mid_p[3]}, {mid_p[4]})")
print(f"Bot color (hex): #{bot_p[2]:02x}{bot_p[3]:02x}{bot_p[4]:02x} -> RGB({bot_p[2]}, {bot_p[3]}, {bot_p[4]})")
