"""Read the public hosted API for static SEO generation, never a hardcoded catalog."""
import json, os, pathlib, urllib.request
base=os.environ.get("CATALOG_API_ORIGIN","https://flavor-voyage.netlify.app").rstrip("/")
def read(path):
    with urllib.request.urlopen(base+path,timeout=30) as response:
        return json.load(response)
snapshot={"products":read("/api/products"),"dealers":read("/api/suppliers")}
pathlib.Path(".cache").mkdir(exist_ok=True)
pathlib.Path(".cache/catalog.json").write_text(json.dumps(snapshot))
print("Loaded",len(snapshot["products"]),"product listings from the hosted database for SEO generation.")
