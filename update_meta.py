from pathlib import Path
import re

meta_block = """  <meta name=\"description\" content=\"Nebulo Education Plus is a math-focused experience offering educational algebra practice tests to strengthen advanced math skills.\">
  <meta name=\"keywords\" content=\"math, algebra, advanced math practice test, educational exercises, study tools\">
  <meta property=\"og:type\" content=\"website\">
  <meta property=\"og:title\" content=\"Nebulo Education Plus - Educational Algebra Practice Tests\">
  <meta property=\"og:description\" content=\"Step into a dedicated math site built around educational algebra practice tests designed to enhance advanced math skills.\">
"""

root = Path('public')
files = list(root.rglob('*.html'))
print(f'Updating {len(files)} HTML files...')
for path in files:
    text = path.read_text()
    text = text.replace('\r\n', '\n')
    original = text
    patterns = [
        r"\s*<meta\s+name=\"description\"[^>]*>\s*",
        r"\s*<meta\s+name=\"keywords\"[^>]*>\s*",
        r"\s*<meta\s+property=\"og:type\"[^>]*>\s*",
        r"\s*<meta\s+property=\"og:title\"[^>]*>\s*",
        r"\s*<meta\s+property=\"og:description\"[^>]*>\s*",
    ]
    for pat in patterns:
        text, _ = re.subn(pat, '\n', text, flags=re.IGNORECASE)
    viewport_match = re.search(r'<meta[^>]*name="viewport"[^>]*>', text, flags=re.IGNORECASE)
    if viewport_match:
        insertion_pos = viewport_match.end()
    else:
        charset_match = re.search(r'<meta[^>]*charset[^>]*>', text, flags=re.IGNORECASE)
        head_match = re.search(r'<head[^>]*>', text, flags=re.IGNORECASE)
        if charset_match:
            insertion_pos = charset_match.end()
        elif head_match:
            insertion_pos = head_match.end()
        else:
            continue
    text = text[:insertion_pos] + '\n' + meta_block + text[insertion_pos:]
    # Clean up accidental multiple blank lines near the top
    text = re.sub(
        r'<!DOCTYPE html>\\s*\\n+\\s*<html',
        r'<!DOCTYPE html>\\n<html',
        text,
        flags=re.IGNORECASE,
        count=1,
    )
    text = re.sub(
        r'(<html[^>]*>)\\s*\\n+\\s*<head',
        r'\\1\\n<head',
        text,
        flags=re.IGNORECASE,
        count=1,
    )
    text = re.sub(
        r'(<head[^>]*>)\\s*\\n+',
        r'\\1\\n',
        text,
        flags=re.IGNORECASE,
        count=1,
    )
    text = re.sub(
        r'(<meta[^>]*charset[^>]*>)\\s*\\n+',
        r'\\1\\n',
        text,
        flags=re.IGNORECASE,
        count=1,
    )
    if text != original:
        path.write_text(text.replace('\n', '\r\n'))
        print(f'  {path}')
