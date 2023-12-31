import { Signal } from 'typed-signals';
import { SceneUtilsComponent } from '../../loaders/utils/SceneUtilsComponent';
import { Quaternion, Vector3 } from '../../math';
import { Animation3D } from './Animation3D';
let tempQuat;
let tempQuat2;
let tempVec;
let tempVec2;
export class Animator3DComponent {
    /**
     * A lot of the time we will be loading single master animations that need to be broken up.
     * To break up an animation please provide a clips object. Animations will be generated from this.
     * The expected format is the following:
     * ```
     * {
     *     fps:24 // the frame rate of the animation
     *     clips: {
     *        run: { frames: [960, 970], loop: true, speed: 0.02 }, // start frame and end frame
     *        roll: { frames: [151, 164], speed: 0.04 },
     *     },
     *     mixes:[
     *         ['run', 'roll', 0.012],
     *         ['roll', 'run', 0.006],
     *     ],
     * }
     *
     * // you can then play an animation like so:
     *
     * myScene.animationController.play('run');
     *
     * ```
     *
     * On complete animations will trigger the 'animationComplete' typed signal. This is accessible via:
     * AnimationControllerComponent.signals.onAnimationComplete.add()
     * This signal is dispatched with the animation name string parameter
     *
     * @param entity - an odie entity the component will be attached to
     * @param data - additional animation information
     *
     */
    constructor(entity, data) {
        var _a;
        this.signals = {
            animationComplete: new Signal(),
        };
        if (!tempQuat) {
            tempQuat = new Quaternion();
            tempQuat2 = new Quaternion();
            tempVec = new Vector3();
            tempVec2 = new Vector3();
        }
        this.entity = entity;
        this.autoUpdate = (_a = data.autoUpdate) !== null && _a !== void 0 ? _a : true;
        this._mixedMap = {};
        if (!data.clips) {
            this._animations = {};
            data.animations.forEach((a, i) => {
                this._animations[i] = new Animation3D({
                    loop: true,
                    duration: a.duration,
                    name: `animation${i}`,
                    data: a.data,
                });
            });
        }
        else {
            const animations = {};
            const masterAnimation = data.animations[0];
            const fps = data.fps || 24;
            for (const name in data.clips) {
                const clip = data.clips[name];
                const frames = clip.frames;
                const start = frames[0] / fps;
                const end = frames[1] / fps;
                if (end > masterAnimation.duration) {
                    console.warn(`[animation controller] frame range is too high.`
                        + ` max frame can be up to ${masterAnimation.duration * fps}`);
                }
                const animData = {
                    name,
                    start,
                    end,
                    animation: masterAnimation,
                    speed: clip.speed,
                    loop: clip.loop,
                };
                const animation = Animation3D.fromAnimation(animData);
                animations[name] = animation;
            }
            if (data.mixes) {
                for (const mix of data.mixes) {
                    this.setMix(mix[0], mix[1], mix[2]);
                }
            }
            this._animations = animations;
        }
        this._animationTick = 0;
        this._defaultMix = 0.045;
        this.mixAmount = this._defaultMix;
        this.lastAnimation = null;
        this._lastAnimationTick = 0;
        this._mixRatio = 0;
        this._mixing = false;
        this.allowMixing = true;
        this._nextAnimation = null;
    }
    /**
     * plays an animation
     * @param name - the name of the animation to play, this must exist in the animations object
     * @param restart - forces to restart the animation if the same one is already playing
     */
    play(name, restart = false) {
        if (!restart && this._animations[name] === this.animation) {
            return;
        }
        if (this._mixing) {
            this._nextAnimation = name;
            return;
        }
        if (this.allowMixing) {
            this.lastAnimation = this.animation;
            this._lastAnimationTick = this._animationTick;
            if (this.animation) {
                const mixedKey = this.lastAnimation.name + name;
                this.mixAmount = this._mixedMap[mixedKey] || this._defaultMix;
                this._mixRatio = 0;
                this._mixing = true;
            }
        }
        this._animationTick = 0;
        this.animation = this._animations[name];
    }
    /**
     * Set the transition duration for a specific combination of animations.
     *
     * @param animation1 - first animation id
     * @param animation2 - second animation id
     * @param duration - number in seconds that it should take to transition from one animation to the next
     */
    setMix(animation1, animation2, duration) {
        const key = animation1 + animation2;
        this._mixedMap[key] = duration;
    }
    update(time) {
        if (this.autoUpdate)
            this.updateAnimation(time.frameTime);
    }
    /**
     * Render current state, without changing time
     */
    render() {
        if (this.animation) {
            if (this._mixing && this.lastAnimation) {
                if (this._mixRatio > 1) {
                    this._applySingleAnimation(this.animation, this._animationTick);
                }
                else {
                    this._applyTwoAnimations(this.animation, this._animationTick, this.lastAnimation, this._lastAnimationTick, this._mixRatio);
                }
            }
            else {
                this._applySingleAnimation(this.animation, this._animationTick);
            }
        }
    }
    /**
     * Update animation position/state, without rendering it
     * @param step - The delta multiplier for the update, usually 0 to 1
     */
    updateAnimation(step = 1) {
        if (this.animation) {
            this._animationTick += this.animation.speed * step;
            if (this._mixing && this.lastAnimation) {
                this._lastAnimationTick += this.lastAnimation.speed * step;
                this._mixRatio += this.mixAmount * step;
                if (this._mixRatio > 1) {
                    this._mixRatio = 1;
                    this._mixing = false;
                    this._playNextAnimation();
                }
            }
            else {
                this._playNextAnimation();
            }
        }
    }
    _playNextAnimation() {
        if (this._nextAnimation) {
            this.play(this._nextAnimation);
            this._nextAnimation = null;
        }
    }
    /**
     * Applies a pose from a single animation based on the time provided
     *
     * @param animation - the animation to apply to the entity
     * @param time - time in seconds of the animation to apply
     */
    _applySingleAnimation(animation, time) {
        const loop = animation.loop;
        const sceneUtils = this.entity.getComponent(SceneUtilsComponent);
        time = this._updateAnimationTime(animation, time);
        for (let i = 0; i < animation.data.length; i++) {
            const track = animation.data[i];
            const bone = sceneUtils.map[track.id];
            if (bone) {
                if (track.t) {
                    this._interpolateVec3(track.t.times, track.t.values, time, loop, bone.transform.position);
                }
                if (track.s) {
                    this._interpolateVec3(track.s.times, track.s.values, time, loop, bone.transform.scale);
                }
                if (track.r) {
                    this._interpolateQuat(track.r.times, track.r.values, time, loop, bone.transform.quat);
                }
                // TODO add poses!
                bone.transform['_onChange']();
                if (track.w && bone.view3d.material.uniforms.uMorphTargetInfluence) {
                    this._interpolateArray(track.w.times, track.w.values, time, loop, bone.view3d.material.uniforms.uMorphTargetInfluence, bone.view3d.geometry.castToBaseGeometry().weights.length);
                }
            }
        }
    }
    /**
     * Mix two animations together with a specified ratio
     *
     * @param entity - the entity to apply the animations to
     * @param animation1 - the first animation to mix
     * @param time1 - time in seconds of the first animation pose
     * @param animation2 - the second animation to mix
     * @param time2 - time in seconds of the second animation
     * @param ratio - mix ratio between 0 and 1
     */
    _applyTwoAnimations(animation1, time1, animation2, time2, ratio) {
        const result1 = tempVec;
        const result2 = tempVec2;
        const resultQuat2 = tempQuat2;
        const loop1 = animation1.loop;
        const loop2 = animation2.loop;
        const sceneUtils = this.entity.getComponent(SceneUtilsComponent);
        time1 = this._updateAnimationTime(animation1, time1);
        time2 = this._updateAnimationTime(animation2, time2);
        for (let i = 0; i < animation1.data.length; i++) {
            const track = animation1.data[i];
            const track2 = animation2.data[i];
            const bone = sceneUtils.map[track.id];
            if (bone) {
                if (track.t) {
                    this._interpolateVec3(track.t.times, track.t.values, time1, loop1, result2);
                    this._interpolateVec3(track2.t.times, track2.t.values, time2, loop2, result1);
                    bone.transform.position.set(result1.x + ((result2.x - result1.x) * ratio), result1.y + ((result2.y - result1.y) * ratio), result1.z + ((result2.z - result1.z) * ratio));
                }
                if (track.s) {
                    this._interpolateVec3(track.s.times, track.s.values, time1, loop1, result1);
                    this._interpolateVec3(track2.s.times, track2.s.values, time2, loop2, result2);
                    bone.transform.scale.set(result1.x + ((result2.x - result1.x) * ratio), result1.y + ((result2.y - result1.y) * ratio), result1.z + ((result2.z - result1.z) * ratio));
                }
                if (track.w) {
                    this._interpolateVec3(track.w.times, track.w.values, time1, loop1, result1);
                    this._interpolateVec3(track2.w.times, track2.w.values, time2, loop2, result2);
                }
                if (track.r) {
                    const result = bone.transform.quat;
                    this._interpolateQuat(track2.r.times, track2.r.values, time2, loop2, result);
                    this._interpolateQuat(track.r.times, track.r.values, time1, loop1, resultQuat2);
                    result.slerp(resultQuat2, ratio);
                }
                bone.transform['_onChange']();
            }
        }
    }
    /**
     * used to find the value of a vector at a specific point in time on a track
     * this will interpolated between frames
     *
     * @param times - array of keyframe times
     * @param values - array of keyframe values
     * @param time - the time in seconds to find the value of the vec3
     * @param interpolateLoop - if true will ensure that the animation will loop smoothly
     * (set to true for looping animations)
     * @param result - a vec3 that the data will be written to.
     */
    _interpolateVec3(times, values, time, interpolateLoop, result) {
        let startIndex = 0;
        for (let i = 0; i < times.length; i++) {
            if (times[i] > time) {
                break;
            }
            startIndex = i;
        }
        let endIndex = (startIndex + 1);
        if (interpolateLoop) {
            // if the animation should loop round?
            if (endIndex > times.length - 1) {
                endIndex = 0;
            }
        }
        let ratio;
        if (startIndex === times.length - 1) {
            ratio = 1;
        }
        else {
            const startTime = times[startIndex];
            const endTime = times[startIndex + 1];
            const diffpos = endTime - time;
            const diff = endTime - startTime;
            ratio = 1 - (diffpos / diff);
        }
        const x = values[(startIndex * 3) + 0];
        const y = values[(startIndex * 3) + 1];
        const z = values[(startIndex * 3) + 2];
        const x2 = values[(endIndex * 3) + 0];
        const y2 = values[(endIndex * 3) + 1];
        const z2 = values[(endIndex * 3) + 2];
        result.x = x + ((x2 - x) * ratio);
        result.y = y + ((y2 - y) * ratio);
        result.z = z + ((z2 - z) * ratio);
        return result;
    }
    _interpolateArray(times, values, time, interpolateLoop, result, size) {
        let startIndex = 0;
        for (let i = 0; i < times.length; i++) {
            if (times[i] > time) {
                break;
            }
            startIndex = i;
        }
        let endIndex = (startIndex + 1);
        if (interpolateLoop) {
            // if the animation should loop round?
            if (endIndex > times.length - 1) {
                endIndex = 0;
            }
        }
        let ratio;
        if (startIndex === times.length - 1) {
            ratio = 1;
        }
        else {
            const startTime = times[startIndex];
            const endTime = times[startIndex + 1];
            const diffpos = endTime - time;
            const diff = endTime - startTime;
            ratio = 1 - (diffpos / diff);
        }
        for (let i = 0; i < size; i++) {
            const v = values[(startIndex * size) + i];
            const v2 = values[(endIndex * size) + i];
            result[i] = v + ((v2 - v) * ratio);
        }
        return result;
    }
    /**
     * used to find the value of a quad at a specific point in time on a track
     * this will interpolated between frames
     *
     * @param times - array of keyframe times
     * @param values - array of keyframe values
     * @param time - the time in seconds to find the value of the quad
     * @param interpolateLoop - if true will ensure that the animation will loop smoothly
     * (set to true for looping animations)
     * @param result - a quat that the data will be written to.
     */
    _interpolateQuat(times, values, time, interpolateLoop, result) {
        let startIndex = 0;
        for (let i = 0; i < times.length; i++) {
            if (times[i] > time) {
                break;
            }
            startIndex = i;
        }
        let endIndex = (startIndex + 1);
        if (interpolateLoop) {
            // if the animation should loop round?
            if (endIndex > times.length - 1) {
                endIndex = 0;
            }
        }
        result.x = values[(startIndex * 4) + 0];
        result.y = values[(startIndex * 4) + 1];
        result.z = values[(startIndex * 4) + 2];
        result.w = values[(startIndex * 4) + 3];
        tempQuat.x = values[(endIndex * 4) + 0];
        tempQuat.y = values[(endIndex * 4) + 1];
        tempQuat.z = values[(endIndex * 4) + 2];
        tempQuat.w = values[(endIndex * 4) + 3];
        let ratio;
        if (startIndex === times.length - 1) {
            ratio = 1;
        }
        else {
            const startTime = times[startIndex];
            const endTime = times[startIndex + 1];
            const diffpos = endTime - time;
            const diff = endTime - startTime;
            ratio = 1 - (diffpos / diff);
        }
        result.slerp(tempQuat, ratio);
        return result;
    }
    /**
     * Figures out what the time should be whether the animation needs to loop or not.
     *
     * @param animation - the animation object to read times from
     * @param time - the current time
     * @returns the new time to apply to the animation
     */
    _updateAnimationTime(animation, time) {
        const prevTime = animation.currentTime;
        let dispatchComplete = false;
        if (animation.loop) {
            time %= animation.duration;
            if (time < 0) {
                time += animation.duration;
            }
            if (time < prevTime) {
                dispatchComplete = true;
            }
        }
        else {
            const maxTime = animation.duration - 0.01;
            if (time > maxTime) {
                time = maxTime;
                if (prevTime < maxTime) {
                    dispatchComplete = true;
                }
            }
        }
        animation.currentTime = time;
        if (dispatchComplete) {
            this.signals.animationComplete.emit(animation.name);
        }
        return time;
    }
}
Animator3DComponent.DEFAULT_NAME = 'animationController';
