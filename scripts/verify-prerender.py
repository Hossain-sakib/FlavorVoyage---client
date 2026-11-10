"""Verify indexable product HTML independently of browser-side React updates."""
import json, pathlib
from html.parser import HTMLParser
class Metadata(HTMLParser):
    def __init__(self):
        super().__init__(); self.h1=""; self.canonical=""; self.meta={}; self.heading=False
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if tag=="h1": self.heading=True
        if tag=="link" and attrs.get("rel")=="canonical": self.canonical=attrs.get("href")
        if tag=="meta": self.meta[attrs.get("name") or attrs.get("property")]=attrs.get("content","")
    def handle_data(self, value):
        if self.heading: self.h1+=value
    def handle_endtag(self, tag):
        if tag=="h1": self.heading=False
products=json.loads(pathlib.Path(".cache/catalog.json").read_text())["products"]
checked=0
for product in products:
    if product.get("catalogOnly"): continue
    html=pathlib.Path("dist/products",product["id"],"index.html").read_text()
    page=Metadata(); page.feed(html)
    assert page.h1==product["name"], product["id"]+": heading mismatch"
    assert page.canonical=="https://flavor-voyage.netlify.app/products/"+product["id"], product["id"]+": canonical mismatch"
    assert product["name"] in page.meta["description"], product["id"]+": description mismatch"
    expected=product["image"] if not product["image"].startswith("/") else "https://flavor-voyage.netlify.app"+product["image"]
    assert page.meta["og:image"]==expected, product["id"]+": social image mismatch"
    assert 'id="product-schema"' in html, product["id"]+": schema missing"
    checked+=1
print("Verified server-rendered headings, canonical URLs, descriptions, social images and schema on",checked,"product pages.")
