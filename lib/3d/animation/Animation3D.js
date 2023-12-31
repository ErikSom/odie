export class Animation3D {
    /**
     *
     * @param options - data for the Animation initialization
     */
    constructor(options) {
        this.name = options.name;
        this.data = options.data;
        this.duration = options.duration;
        this.loop = options.loop || false;
        this.speed = options.speed || 0.012;
        this.currentTime = 0;
    }
    /**
     * Create a new animation by extracting it from an existing one.
     * A lot of our animations are all on one timeline when loaded in. This lets us extract the individual animations
     *
     * Example:
     *
     * ```s
     *  const fps = 24
     *  const runAnimation = Animation.fromAnimation(
     * { name: 'run', start: 10/fps, end: 100/fps, animation: loadedAnimation});
     *
     * ```
     *
     * @param options - data for the Animation initialization
     * @returns the new animation;
     */
    static fromAnimation(options) {
        const animation = options.animation;
        const start = options.start;
        const end = options.end;
        if (end > animation.duration) {
            throw new Error(`cannot split animation, end time is longer than the duration (${animation.duration}) of the animation`);
        }
        else if (start < 0) {
            throw new Error('cannot split animation, start time is smaller than the zero');
        }
        const newAnimationData = {};
        // assuming a certain snapping to keyframe! will be useful here..
        newAnimationData.data = animation.data.map((trackData) => {
            const newTrackData = {
                id: trackData.id,
            };
            if (trackData.t) {
                newTrackData.t = extractTrack(trackData.t, start, end, 3);
            }
            if (trackData.s) {
                newTrackData.s = extractTrack(trackData.s, start, end, 3);
            }
            if (trackData.r) {
                newTrackData.r = extractTrack(trackData.r, start, end, 4);
            }
            if (trackData.w) {
                newTrackData.w = extractTrack(trackData.w, start, end, 2);
            }
            return newTrackData;
        });
        newAnimationData.duration = end - start;
        newAnimationData.name = options.name;
        newAnimationData.speed = options.speed;
        newAnimationData.loop = options.loop;
        return Animation3D.fromData(newAnimationData);
    }
    /**
     * create an Animation object from a generic animation data object (assumed to be a gb animation format)
     *
     * @param animationData - this is usually going to be a loaded gb animation object
     */
    static fromData(animationData) {
        return new Animation3D(animationData);
    }
}
/**
 * extract a new track from an existing one
 * @param track - the track from the animation data (times and values)
 * @param start - time in seconds that the animation starts
 * @param end - time in seconds that the animation ends
 * @param size - the size of the values (3 for transform and scale tracks, 4 for rotation tracks)
 *
 * @returns new track object containing times and values arrays
 */
function extractTrack(track, start, end, size) {
    const times = track.times;
    let startIndex = 0;
    let endIndex = 0;
    for (let i = 0; i < times.length; i++) {
        if (times[i] > start) {
            break;
        }
        startIndex = i;
    }
    for (let i = startIndex; i < times.length; i++) {
        if (times[i] >= end) {
            endIndex = i;
            break;
        }
    }
    const startTime = times[startIndex];
    return {
        times: times.slice(startIndex, endIndex).map((v) => v - startTime),
        values: track.values.slice(startIndex * size, endIndex * size),
    };
}
