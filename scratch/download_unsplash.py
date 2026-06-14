import os
import re
import urllib.request

html_path = r'c:\Users\Aryan\Desktop\Hardcore\gym-website\index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

# Find all Unsplash URLs
urls = re.findall(r'src="(https://images\.unsplash\.com/[^"]+)"', html_content)
urls = list(set(urls)) # unique

for idx, url in enumerate(urls):
    local_filename = f'unsplash_{idx}.webp'
    local_path = os.path.join(os.path.dirname(html_path), local_filename)
    print(f'Downloading {url} to {local_filename}')
    try:
        # Download image
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(local_path, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        
        # Replace in HTML
        html_content = html_content.replace(url, local_filename)
    except Exception as e:
        print(f'Error downloading {url}: {e}')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

print('Done downloading and updating HTML.')
