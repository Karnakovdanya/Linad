"""Trace the supplied wordmarks to SVG paths; never generate or modify raster sources.

Requires Pillow and numpy only. Sources remain byte-for-byte originals.
Contours use subpixel matte interpolation, then a 0.16 source-pixel simplification.
No installed fonts, retyping, recolouring filters, embedded bitmap or background rect.
"""
from pathlib import Path
import json
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCES = ROOT / 'design/brand/sources'
OUTPUT = ROOT / 'public/assets/brand'


def simplify(points, epsilon=.16):
    if len(points) < 3:
        return points
    a, b = np.array(points[0]), np.array(points[-1])
    v = b - a
    p = np.array(points)
    if np.dot(v, v) < 1e-12:
        distances = np.linalg.norm(p - a, axis=1)
    else:
        t = np.clip(((p - a) @ v) / (v @ v), 0, 1)
        distances = np.linalg.norm(p - a - t[:, None] * v, axis=1)
    k = int(np.argmax(distances))
    if distances[k] <= epsilon:
        return [points[0], points[-1]]
    return simplify(points[:k+1], epsilon)[:-1] + simplify(points[k:], epsilon)


def contours(alpha):
    # Marching squares, joining edge IDs instead of rounded floating point coordinates.
    segments = []
    h, w = alpha.shape
    for y in range(h-1):
        for x in range(w-1):
            values = [alpha[y, x], alpha[y, x+1], alpha[y+1, x+1], alpha[y+1, x]]
            bits = sum(1 << k for k, value in enumerate(values) if value >= .5)
            if bits in (0, 15):
                continue
            ends = []
            for k, (i, j, edge) in enumerate([(0,1,('h',x,y)), (1,2,('v',x+1,y)), (2,3,('h',x,y+1)), (3,0,('v',x,y))]):
                if (values[i] >= .5) == (values[j] >= .5):
                    continue
                t = (.5 - values[i]) / (values[j] - values[i])
                xy = [(x,y),(x+1,y),(x+1,y+1),(x,y+1)]
                point = (xy[i][0] + t * (xy[j][0]-xy[i][0]), xy[i][1] + t * (xy[j][1]-xy[i][1]))
                ends.append((edge, point))
            for i in range(0, len(ends), 2):
                segments.append((ends[i], ends[i+1]))
    adjacency = {}
    positions = {}
    for a,b in segments:
        adjacency.setdefault(a[0], []).append(b[0])
        adjacency.setdefault(b[0], []).append(a[0])
        positions[a[0]], positions[b[0]] = a[1], b[1]
    seen = set()
    paths = []
    for start in adjacency:
        if start in seen:
            continue
        chain, current, previous = [], start, None
        while current not in seen:
            seen.add(current)
            chain.append(positions[current])
            nxt = [p for p in adjacency[current] if p != previous]
            if not nxt:
                break
            previous, current = current, nxt[0]
        area = abs(sum(chain[i][0]*chain[(i+1)%len(chain)][1] - chain[(i+1)%len(chain)][0]*chain[i][1] for i in range(len(chain))) / 2)
        if area > 2:
            # Split the closed contour at its farthest point before RDP.
            p = np.array(chain)
            split = int(np.argmax(np.linalg.norm(p-p[0], axis=1)))
            reduced = simplify(chain[:split+1])[:-1] + simplify(chain[split:] + [chain[0]])[:-1]
            paths.append((reduced, area))
    return paths


def path_text(paths):
    return ' '.join('M' + ' L'.join(f'{x:.2f},{y:.2f}' for x,y in points) + ' Z' for points,_ in paths)


def trace(theme, filename, shared_shapes=None):
    pixels = np.asarray(Image.open(SOURCES / filename).convert('RGB'), dtype=float)
    h,w,_ = pixels.shape
    bg = np.median(pixels[:8], axis=(0,1))
    ink = np.median(pixels[30:145, 20:45], axis=(0,1))
    expected = np.broadcast_to(ink, pixels.shape).copy()
    definitions = []
    # Least-squares gradient direction and monotone stops follow each supplied A/D.
    for name, left, right in [('a',505,740), ('d',745,960)]:
        region = pixels[:205, left:right]
        y,x = np.indices(region.shape[:2], dtype=float)
        global_x = x + left
        distance = np.linalg.norm(region-bg, axis=2)
        initial = distance > (26 if theme == 'dark' else 110)
        # Erode only the fitting samples to exclude antialiased boundaries.
        interior = initial.copy()
        for dy,dx in [(-2,0),(2,0),(0,-2),(0,2)]:
            interior &= np.roll(initial, (dy,dx), axis=(0,1))
        interior[:4] = False; interior[-8:] = False
        design = np.column_stack([global_x[interior], y[interior], np.ones(interior.sum())])
        coefficients = np.linalg.lstsq(design, region[interior], rcond=None)[0]
        direction = coefficients[:2].mean(axis=1)
        direction /= np.linalg.norm(direction)
        projection = global_x*direction[0] + y*direction[1]
        lo,hi = np.quantile(projection[interior], [.005,.995])
        knots = np.linspace(lo,hi,13)
        samples = []
        for t in knots:
            nearby = interior & (np.abs(projection-t) < (hi-lo)/20)
            samples.append(np.median(region[nearby], axis=0) if nearby.any() else np.array([140,150,220]))
        for channel in range(3):
            expected[:205,left:right,channel] = np.interp(projection, knots, np.array(samples)[:,channel])
        p1,p2 = direction*lo, direction*hi
        stops = ''.join(f'<stop offset="{i/12:.5f}" stop-color="#{int(round(c[0])):02x}{int(round(c[1])):02x}{int(round(c[2])):02x}"/>' for i,c in enumerate(samples))
        definitions.append(f'<linearGradient id="{name}" gradientUnits="userSpaceOnUse" x1="{p1[0]:.3f}" y1="{p1[1]:.3f}" x2="{p2[0]:.3f}" y2="{p2[1]:.3f}">{stops}</linearGradient>')
    delta = expected-bg
    alpha = np.clip(np.sum((pixels-bg)*delta, axis=2) / np.sum(delta*delta, axis=2), 0, 1)
    paths = contours(alpha)
    groups = {'ink': [], 'a': [], 'd': []}
    for points, area in paths:
        center = np.mean(points, axis=0)
        key = 'a' if center[1] < 210 and 505 < center[0] < 740 else 'd' if center[1] < 210 and center[0] > 745 else 'ink'
        groups[key].append((points,area))
    if shared_shapes is not None:
        # The A/D silhouettes are the same in both supplied images. The light
        # source has clean contrast; reuse its outlines to avoid the dark
        # source's compressed low-contrast fringe cutting holes in D's edge.
        groups['a'] = shared_shapes['a']
        groups['d'] = shared_shapes['d']
    color = '#' + ''.join(f'{int(c):02x}' for c in ink)
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="LINAD — LANGUAGES FOR REAL LIFE">\n<title>LINAD — LANGUAGES FOR REAL LIFE</title>\n<desc>Approved {theme}-theme wordmark, traced from {filename}. Transparent vector paths.</desc>\n<defs>' + ''.join(definitions) + '</defs>\n'
    for key, group in groups.items():
        fill = color if key == 'ink' else f'url(#{key})'
        svg += f'<path fill="{fill}" fill-rule="evenodd" d="{path_text(group)}"/>\n'
    svg += '</svg>\n'
    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / f'linad-logo-{theme}.svg').write_text(svg, encoding='utf-8')
    return {'theme':theme,'source':filename,'size':[w,h],'ink':color,'contours':{k:len(v) for k,v in groups.items()}}, groups


if __name__ == '__main__':
    light, shapes = trace('light','LINAD_preview_light.jpg')
    dark, _ = trace('dark','image(20261017-172457).png', shapes)
    print(json.dumps([light,dark], indent=2))
