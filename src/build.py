import re, pathlib
root = pathlib.Path(__file__).parent
html = (root/'index.html').read_text()
html = html.replace('<link rel="stylesheet" href="app.css">', '<style>\n' + (root/'app.css').read_text() + '\n</style>')
def js(m):
    return '<script>\n' + (root/m.group(1)).read_text().replace('</script', '<\\/script') + '\n</script>'
html = re.sub(r'<script src="(js/[^"]+)"></script>', js, html)
(root/'dist').mkdir(exist_ok=True)
(root/'dist'/'landscape-drawing.html').write_text(html)
print(len(html)//1024, 'KB')

# Standalone website build: full document head, favicon and share preview.
body = html
fav = "data:image/svg+xml," + ("%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'%3E%3Crect width='36' height='36' rx='7' fill='%231B2433'/%3E%3Cpath d='M3 26 12 14l5 6 6-10 10 16z' fill='%23CDCBC5'/%3E%3Cpath d='M23 10l3.5 7-2 9H33z' fill='%23F7F6F2'/%3E%3Cline x1='2' y1='26.2' x2='34' y2='26.2' stroke='%233E8FC7' stroke-width='1.8'/%3E%3C/svg%3E")
head = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#1B2433">
<link rel="icon" href="{fav}">
<meta property="og:title" content="Landscape Drawing">
<meta property="og:description" content="Learn to see, simplify, and draw the world around you. A 30-lesson graphite landscape course with exercises, drills and a step-by-step tool.">
<meta property="og:type" content="website">
<style>html{{-webkit-text-size-adjust:100%}}:root{{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}[hidden]{{display:none!important}}</style>
'''
title_end = body.index('</title>') + len('</title>')
meta_end = body.index('<a class="skip"')
site = head + body[:meta_end] + '</head>\n<body>\n' + body[meta_end:] + '\n</body>\n</html>\n'
(root/'site').mkdir(exist_ok=True)
(root/'site'/'index.html').write_text(site)
(root/'site'/'404.html').write_text(site)
print('site', len(site)//1024, 'KB')
