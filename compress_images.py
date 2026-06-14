import os
from PIL import Image

def compress_images():
    count = 0
    saved_bytes = 0
    for filename in os.listdir('.'):
        if filename.endswith('.webp'):
            filepath = os.path.join('.', filename)
            original_size = os.path.getsize(filepath)
            
            try:
                with Image.open(filepath) as img:
                    # Convert to RGB if needed
                    if img.mode != 'RGB' and img.mode != 'RGBA':
                        img = img.convert('RGB')
                    
                    # Resize if width is larger than 1920 (HD)
                    if img.width > 1920:
                        ratio = 1920.0 / img.width
                        new_height = int(img.height * ratio)
                        img = img.resize((1920, new_height), Image.Resampling.LANCZOS)
                        
                    # Save with lower quality to compress
                    img.save(filepath, 'WEBP', quality=60, method=6)
                    
                new_size = os.path.getsize(filepath)
                if new_size < original_size:
                    saved_bytes += (original_size - new_size)
                    count += 1
            except Exception as e:
                print(f"Failed to compress {filename}: {e}")
                
    print(f"Compressed {count} images, saved {saved_bytes / 1024 / 1024:.2f} MB in total.")

if __name__ == '__main__':
    compress_images()
