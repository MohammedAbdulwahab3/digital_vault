# Export Guide — __PRODUCT_NAME__

## glTF (recommended — Godot, three.js, web)

`File → Export → glTF 2.0`

- Format: **glTF Binary (.glb)**
- Include: Selected Objects (character + rig)
- Transform: **+Y Up** ✔
- Animation: ✔ (bakes the turntable/idle actions)

## FBX (Unity / Unreal)

`File → Export → FBX`

- Limit to: Selected Objects
- Object Types: **Armature + Mesh**
- Armature → Add Leaf Bones: ✖ (off — cleaner skeleton)
- Bake Animation: ✔

### Unity

Drop the FBX into `Assets/`. In the model import settings set
**Rig → Animation Type: Generic** (or Humanoid after mapping bones).

### Unreal

Import with **Skeletal Mesh ✔**, leave "Create New Skeleton" checked the
first time. Materials arrive as instances — swap the emissive eye slot for
an Unreal emissive material for the same glow.

### Godot 4

Import the `.glb` directly — rig, materials and the idle animation come
through as an `AnimationPlayer`.
