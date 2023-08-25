# Changelog

** - breaking change

## Unreleased

### Added

- ability to set a layers index at runtime

## [11.1.1] - 12-05-2021

### Fixed

- `Animator2DComponent` now resets correctly

## [11.1.0]

### Fixed

- `BillboardMaterial`, `billboard.vert` and `billboard.frag` now uses the correct attributes and uniform naming conventions

### Changed

- `Entity3D` now uses the same `addChild` parameters as `Scene3D` and `scene2D`

### Added

- `gb` objects now have an option to prevent animations from autoPlaying

## [11.0.1] - 15-04-21

### Fixed

- Fixed `Animator3DComponent`, added check mixes exist before using them
- orbital camera component no longer uses a passive scroll event

## [11.0.0] - 08-04-21

### Added

- MorphTargets! Requires latest version of GB model tools
- ability to load models and textures in for tests visa `loadGB` and `loadImage` in test utils
- ** `HitComponent` for the use of the `HitSystem`
- signals to `GroupSystem` for when an entity is added/removed
- Test for skybox
- Example on what to send to the `SkyboxEntity` constructor
- `Animation2D` and `Animator2DComponent` for 2d sprite animations

### Fixed

- StandardMaterial was missing ids, it now has them
- Fixed `instanceMatrix` fragment
- Fixed a few private variables in MaskSystem that needed to be public
- Entity rendering when there is no `uModelMatrix`
- fixed sourcemaps becoming mangled by webpack by compiling to ESNext and remove sourcemaps

### Changed

- set default uvs if none exist on a geometry.
- prepare function for scenes are now async.
- improved performance of the entityRenderer
- optimized `cullingSystem`
- ** split out `view3dSystem` into multiple systems
- ** logic extracted from `View3dSystem` to `LightSystem`
- ** PlaneReflectionFragment now uses `uEnvironmentMap` variable instead of `reflectionTexture`
- ** light logic extracted from `View3dSystem` to `LightSystem`.
- ** renamed `LightSystem` to `LightSetupSystem`
- ** replaced all references of `ToGame`/`FromGame` to `ToScene`/`FromScene`
- ** `HitSystem` only tests against entities with the `HitComponent` (while it is enabled)
- ** `HitComponent` works more like the pixi interactions manager
- `HitSystem` can now test children of interactive entities (off by default)
- Assign material name to the entity name, if that entity was split from original model with multiple materials
- ** renamed `Animation` to `Animation3D`
- ** renamed `AnimationControllerComponent` to `Animator3DComponent`
- exported SceneLibrary from gbToOdieParser

## [10.2.0] - 07-04-21

### Added

- `aabbIntersect` function
- `removeFromArray` function
- `removeAllFromArray` function
- Test for the `deepCopy` function (1af5f4b3)

### Fixed

- `HitSystem` failing when renderer resolution is not 1
- fixed init call being prevented on components when no data is sent
- allow for custom arguments for the typed signals in the signals object in entities
- group system not resetting on empty
- `deepCopyChildren` function targeting the wrong object to be copied in the case of ArrayBufferView types

### Changed

- `Group` now defaults to Entity instead of Entity3D
- `GroupSystem` is now generic and accepts an entity type

## [10.1.0] - 17-02-21

### Changed

- AnimationControllerComponent option for `autoUpdate` (defaults to true)
- AnimationControllerComponent using scene's delta time for auto-updates
- AnimationControllerComponent can be updated manually through `updateAnimation(deltaStep)`
- AnimationControllerComponent update logic (position/time) isolated from render

## [10.0.2] - 04-02-21

### Fixed

- runners not being re-added when `empty` is called

## [10.0.1] - 29-01-21

### Fixed

- animation.play failing if `lastAnimation` is null

## [10.0.0] - 20-01-21

### Added

- `basePath` property to `Cache`
- `Runner.destroy` has been added to completely remove everything from a `Runner`
- `renderCustom` function added to `View3DComponent` allowing you to override the standard render process
- "sideEffect" property in `package.json` to allow for tree shaking
- `round` function the the `Math2` collection. Lets you round to a specified precision
- new eslint rules
- `Geometry3D` and `GeometryFragment`
- added a `diffuseMap` getter / setter to `PhongMaterial`
- Particle component and Particle class to allow for the creation and manipulation of many particles with lower resource usage
- ability to tint particles from the particle component in multiple ways
- ability to apply a radial behaviour to particles
- added random function and exported `Random` namespace
- exported `Math` namespace

### Changed

- `ApplyProcessing` clearing now also clears the alpha channel too.
- `Runner.add` and `Runner.remove` now return the runner instance
- `View3DSystem` minor refactor to move camera update logic to its own function
- Only add uniformParser in 3D Games
- Converted the remaining js files to TypeScript
- Moved groups to core folder
- removed `getGUI` as this was already a function in `debugGUI`
- ** replaced all instances of `game` with `scene`
- ** remove `shadowRenderGroup` from `LightEntity`
- ** remove `add` and `remove` from `Entity`
- ** remove dynamic assignment of systems and components
- build is now compiled to es6 to allow for tree shaking
- moved `pixi.js` to `peerDependency`
- ** renamed all private variables to have `_` prefix.
- removed as many `public` variables as possible
- ** removed `gbb` and `gbo` loaders
- ** removed `GeometryFrag`
- `gbToOdieParser` now creates `GeometryFragments` instead of `GeometryFrag`

### Fixed

- `compileHighShader` now compiles even if there are no hooks
- `ContainerSystem` does not throw error if Entity added to game has no container component
- `View3DSystem` does not throw error if you render an empty scene
- `Runner.tidy` now deletes all elements in its `_toRemove` array
- `ApplyProcessing` use original resolution on resize if non provided
- `ColorMaterial` is now usable again

## [9.0.1] - 25-09-20

### Fixed

- vertex/fragment precision issue on android devices

## [9.0.0] - 25-09-20

- add ability to run scene tests in browser using `npm run test:dev`
- add ability to automatically generate `*-scene.test.ts` files from `*.scene.ts` files
- changed npm command `npm run test` - logs are no longer outputted to the terminal
- add new npm command `npm run test:debug` - logs are outputted to the terminal
- fix typing for component and system interfaces
- circular dependency refactor
- added `checkCircularDependencies` to tools
- refactored plane reflection probe
- refactored reflection probe
- ApplyEffects class
- Gaussian Blur pass added
- add scale option to debug entity
- add billboard entity
- add zoom property to camera.. for zooming
- bugfix only add camera if it is not already in game
- layers system added
- fixed interpolation loop error in animation

#### [9.0.0-alpha]

- doc improvement for base material
- make bone amount variable
- daeLoader now exports named function daeLoader
- fbxLoader now exports named function fbxLoader
- gbLoader now exports named function gbLoader
- gbbLoader now exports named function gbbLoader
- gboLoader now exports named function gboLoader
- gltfLoader now exports named function gltfLoader
- PCDLoader now exports named function PCDLoader
- MovieSystem removed
- PostSystem removed. PostSystem_new renamed to PostSystem
- Renamed transform class in transform3d_dynamic to have 'Dynamic' prefix
- Added deprecation function, similar to PIXI
- Added debugGUI util function to grab dat-gui instead of instantiate it right away

## [6.0.0]

- added PCD Loader (for point clouds)
- added normal map support to phong shader
- code tidy
- animation controller updates
- gbLoader fixes
- lowered bone count
- fixes to fog

## [5.0.6]

- lowered number of bones in shader to 20 as it was too high for ios devices
- fixed gb animation parsing issue
- added `getGeometry` to gbScene

## [4.3.0]

- added Animation engine using gb parser
- updated new destroy functions

[Unreleased]: https://github.com/Goodboy-Digital/odie/compare/v11.1.1...HEAD
[11.1.1]: https://github.com/Goodboy-Digital/odie/compare/v11.1.0...v11.1.1
[11.1.0]: https://github.com/Goodboy-Digital/odie/compare/v11.0.1...v11.1.0
[11.0.1]: https://github.com/Goodboy-Digital/odie/compare/v11.0.0...v11.0.1
[11.0.0]: https://github.com/Goodboy-Digital/odie/compare/v10.2.0...v11.0.0
[10.2.0]: https://github.com/Goodboy-Digital/odie/compare/v10.1.0...v10.2.0
[10.1.0]: https://github.com/Goodboy-Digital/odie/compare/v10.0.2...v10.1.0
[10.0.2]: https://github.com/Goodboy-Digital/odie/compare/v10.0.1...v10.0.2
[10.0.1]: https://github.com/Goodboy-Digital/odie/compare/v10.0.1...v10.0.0
[10.0.0]: https://github.com/Goodboy-Digital/odie/compare/v10.0.0...v9.0.1
[9.0.1]: https://github.com/Goodboy-Digital/odie/compare/v9.0.0...v9.0.1
[9.0.0]: https://github.com/Goodboy-Digital/odie/compare/v8.0.1...v9.0.0
