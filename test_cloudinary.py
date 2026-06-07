import cloudinary
import urllib.parse

url = "cloudinary://292462691742831:GYvn4fqL-dutWivU3jh-G3hf0rY@dj7dsoeln"
parsed = urllib.parse.urlparse(url)
cloudinary.config(
    cloud_name=parsed.hostname,
    api_key=parsed.username,
    api_secret=parsed.password
)

config = cloudinary.config()
print(f"Cloud name: {config.cloud_name}")
print(f"API key: {config.api_key}")
