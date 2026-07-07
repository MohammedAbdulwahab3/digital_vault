# __PRODUCT_NAME__ — Blender Package

__PRODUCT_DESCRIPTION__

Purchased on PixelVault · Commercial license included (see LICENSE.txt).

## What's inside

| File | Purpose |
|------|---------|
| `build_character.py` | Procedural character builder — run it inside Blender to generate the rigged character |
| `character_config.json` | Colors, proportions and accessory settings the script reads |
| `EXPORT_GUIDE.md` | FBX / glTF export settings for Unity, Unreal and Godot |

## Quick start (Blender 3.6+)

1. Open Blender → **Scripting** workspace.
2. Open `build_character.py`, make sure `character_config.json` sits next to it.
3. Press **▶ Run Script**.

The script builds the complete character in a fresh collection:

- Low-poly body (head, torso, arms, legs) with clean quad topology
- Emissive eye and accent materials driven by `character_config.json`
- A simple FK armature (root → spine → head, arms, legs) with the mesh
  parented using automatic weights
- A turntable camera + key/rim lights, ready to render

Press `Space` to see the included idle rotation, or `F12` to render the
turntable frame.

## Customizing

Edit `character_config.json` — body/accent/eye colors, proportions and the
accessory — then re-run the script. Nothing else to touch.

---
© __YEAR__ PixelVault buyer license.
