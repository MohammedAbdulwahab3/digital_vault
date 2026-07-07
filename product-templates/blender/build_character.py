"""
__PRODUCT_NAME__ — procedural character builder
Run inside Blender 3.6+ (Scripting workspace → Run Script).

Reads character_config.json (same folder) and generates:
  * low-poly character mesh with themed materials
  * simple FK armature, auto-weighted
  * turntable camera + lighting rig + idle spin animation
"""

import bpy
import json
import math
import os

# ── Config ───────────────────────────────────────────────────────
def load_config():
    try:
        base = os.path.dirname(bpy.context.space_data.text.filepath)
    except Exception:
        base = os.path.dirname(os.path.abspath(__file__))
    path = os.path.join(base, "character_config.json")
    with open(path) as fh:
        return json.load(fh)


def hex_to_rgba(value: str):
    value = value.lstrip("#")
    r, g, b = (int(value[i : i + 2], 16) / 255 for i in (0, 2, 4))
    return (r, g, b, 1.0)


CFG = load_config()
H = CFG["proportions"]["height"]
HEAD = CFG["proportions"]["head_scale"]
SHOULDER = CFG["proportions"]["shoulder_width"]

# ── Fresh collection ─────────────────────────────────────────────
COLL_NAME = CFG["name"][:48]
if COLL_NAME in bpy.data.collections:
    old = bpy.data.collections[COLL_NAME]
    for obj in list(old.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    bpy.data.collections.remove(old)

coll = bpy.data.collections.new(COLL_NAME)
bpy.context.scene.collection.children.link(coll)


def link(obj):
    for c in obj.users_collection:
        c.objects.unlink(obj)
    coll.objects.link(obj)
    return obj


# ── Materials ────────────────────────────────────────────────────
def make_material(name, color, emission=0.0, metallic=0.3, roughness=0.45):
    mat = bpy.data.materials.new(f"{COLL_NAME}.{name}")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if emission > 0:
        bsdf.inputs["Emission Color"].default_value = color
        bsdf.inputs["Emission Strength"].default_value = emission
    return mat


body_mat = make_material("Body", hex_to_rgba(CFG["body_color"]))
accent_mat = make_material("Accent", hex_to_rgba(CFG["accent_color"]), metallic=0.7)
eye_mat = make_material("Eyes", hex_to_rgba(CFG["eye_color"]), emission=6.0)


def box(name, size, location, material, bevel=0.02):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.active_object
    obj.name = f"{COLL_NAME}.{name}"
    obj.scale = size
    mod = obj.modifiers.new("Bevel", "BEVEL")
    mod.width = bevel
    mod.segments = 2
    obj.data.materials.append(material)
    return link(obj)


# ── Body parts (proportions from config) ─────────────────────────
torso_h = H * 0.32
leg_h = H * 0.42
head_s = H * 0.16 * HEAD

parts = []
parts.append(box("Torso", (SHOULDER, 0.30, torso_h), (0, 0, leg_h + torso_h / 2), body_mat))
parts.append(box("Hips", (SHOULDER * 0.8, 0.28, 0.14), (0, 0, leg_h), accent_mat))
parts.append(box("Head", (head_s, head_s, head_s), (0, 0, leg_h + torso_h + head_s / 2 + 0.05), body_mat))

# Eyes (emissive)
eye_z = leg_h + torso_h + head_s / 2 + 0.08
for side in (-1, 1):
    parts.append(box(f"Eye.{'L' if side < 0 else 'R'}", (0.05, 0.02, 0.07),
                     (side * head_s * 0.22, -head_s / 2, eye_z), eye_mat, bevel=0.005))

# Arms + legs
for side in (-1, 1):
    sfx = "L" if side < 0 else "R"
    parts.append(box(f"Arm.{sfx}", (0.13, 0.13, torso_h * 0.95),
                     (side * (SHOULDER / 2 + 0.10), 0, leg_h + torso_h * 0.5), accent_mat))
    parts.append(box(f"Leg.{sfx}", (0.16, 0.18, leg_h * 0.96),
                     (side * SHOULDER * 0.22, 0, leg_h * 0.5), body_mat))

# Accessory
acc = CFG.get("accessory", "none")
if acc == "katana":
    parts.append(box("Katana", (0.03, 0.03, H * 0.7),
                     (SHOULDER / 2 + 0.24, 0.1, leg_h + torso_h * 0.6), accent_mat, bevel=0.004))
elif acc == "staff":
    parts.append(box("Staff", (0.04, 0.04, H * 0.95),
                     (-(SHOULDER / 2 + 0.24), 0, H * 0.5), accent_mat, bevel=0.006))
elif acc == "helmet":
    parts.append(box("Helmet", (head_s * 1.15, head_s * 1.15, head_s * 0.5),
                     (0, 0, leg_h + torso_h + head_s + 0.02), accent_mat))
elif acc == "antenna":
    parts.append(box("Antenna", (0.02, 0.02, 0.25),
                     (0, 0, leg_h + torso_h + head_s + 0.15), eye_mat, bevel=0.003))

# ── Join into one mesh ───────────────────────────────────────────
bpy.ops.object.select_all(action="DESELECT")
for p in parts:
    p.select_set(True)
bpy.context.view_layer.objects.active = parts[0]
bpy.ops.object.join()
character = bpy.context.active_object
character.name = f"{COLL_NAME}.Character"

# ── Armature ─────────────────────────────────────────────────────
bpy.ops.object.armature_add(location=(0, 0, 0))
arm = bpy.context.active_object
arm.name = f"{COLL_NAME}.Rig"
link(arm)
bpy.ops.object.mode_set(mode="EDIT")
eb = arm.data.edit_bones
root = eb[0]
root.name = "root"
root.head, root.tail = (0, 0, 0), (0, 0, leg_h)

spine = eb.new("spine")
spine.head, spine.tail = (0, 0, leg_h), (0, 0, leg_h + torso_h)
spine.parent = root

head_b = eb.new("head")
head_b.head, head_b.tail = spine.tail, (0, 0, leg_h + torso_h + head_s)
head_b.parent = spine

for side, sfx in ((-1, "L"), (1, "R")):
    ab = eb.new(f"arm.{sfx}")
    ab.head = (side * SHOULDER / 2, 0, leg_h + torso_h * 0.9)
    ab.tail = (side * (SHOULDER / 2 + 0.1), 0, leg_h + torso_h * 0.05)
    ab.parent = spine
    lb = eb.new(f"leg.{sfx}")
    lb.head = (side * SHOULDER * 0.22, 0, leg_h)
    lb.tail = (side * SHOULDER * 0.22, 0, 0.02)
    lb.parent = root

bpy.ops.object.mode_set(mode="OBJECT")

# Parent mesh to rig with automatic weights
bpy.ops.object.select_all(action="DESELECT")
character.select_set(True)
arm.select_set(True)
bpy.context.view_layer.objects.active = arm
bpy.ops.object.parent_set(type="ARMATURE_AUTO")

# ── Idle turntable animation ─────────────────────────────────────
scene = bpy.context.scene
scene.frame_start, scene.frame_end = 1, 120
arm.rotation_euler = (0, 0, 0)
arm.keyframe_insert("rotation_euler", frame=1)
arm.rotation_euler = (0, 0, math.tau)
arm.keyframe_insert("rotation_euler", frame=120)
for fc in arm.animation_data.action.fcurves:
    for kp in fc.keyframe_points:
        kp.interpolation = "LINEAR"

# ── Camera + lights ──────────────────────────────────────────────
bpy.ops.object.camera_add(location=(3.2, -3.2, H * 0.75),
                          rotation=(math.radians(75), 0, math.radians(45)))
cam = bpy.context.active_object
cam.name = f"{COLL_NAME}.Camera"
link(cam)
scene.camera = cam

for name, loc, energy, color in (
    ("Key", (2.5, -2.5, 3.0), 900, (1, 1, 1)),
    ("Rim", (-3.0, 2.0, 2.2), 500, hex_to_rgba(CFG["accent_color"])[:3]),
):
    bpy.ops.object.light_add(type="AREA", location=loc)
    light = bpy.context.active_object
    light.name = f"{COLL_NAME}.{name}"
    light.data.energy = energy
    light.data.color = color
    link(light)

print(f"✅ {CFG['name']} built — press Space for the turntable, F12 to render.")
