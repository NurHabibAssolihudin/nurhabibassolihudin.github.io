"""Regenerate self-hosted WOFF2 assets from the licensed original TTFs.

Optional tooling: fonttools==4.68.0 brotli==1.2.1. Not needed for npm build;
the generated assets are checked in alongside the original font sources.
"""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parents[1]
# Latin/Latin extended, punctuation, arrows and replacement character cover
# current EN/ID copy, project names, dynamic labels and typographic symbols.
unicodes = set(range(0x250)) | set(range(0x2000, 0x2070)) | set(range(0x2190, 0x2200)) | {0xFFFD}
for name in ("bricolage", "manrope"):
    source = root / "assets" / "fonts" / f"{name}.ttf"
    output = source.with_suffix(".woff2")
    font = TTFont(source)
    original_cmap = font.getBestCmap()
    original_metrics = {code: font["hmtx"][glyph] for code, glyph in original_cmap.items() if code in unicodes}
    options = subset.Options()
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.name_legacy = True
    options.name_languages = ["*"]
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=unicodes)
    subsetter.subset(font)
    font.flavor = "woff2"
    font.save(output)
    result = TTFont(output)
    cmap = result.getBestCmap()
    assert all(code in cmap and result["hmtx"][cmap[code]] == metrics for code, metrics in original_metrics.items())
    print(f"{name}: {source.stat().st_size:,} -> {output.stat().st_size:,} bytes; retained glyph advances verified")
