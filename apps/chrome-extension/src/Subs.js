"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveSubs = void 0;
const lodash_1 = __importDefault(require("lodash"));
const subs_1 = require("@repo/subs");
const SubsContext_1 = require("./SubsContext");
const PlaybackContext_1 = require("./PlaybackContext");
const solid_js_1 = require("solid-js");
const ActiveSubs = () => {
    const [currentPlaybackS] = (0, PlaybackContext_1.usePlaybackContext)();
    const subsContext = (0, SubsContext_1.useSubsContext)();
    const { cuesByLocale } = subsContext;
    // TODO create explicit deps 
    const currentCues = (0, solid_js_1.createMemo)(() => {
        // better consider last endTime
        const cueFrom = lodash_1.default.find((cuesByLocale[subs_1.Locale.En] || []), cue => (0, subs_1.isCurrentCue)(cue, currentPlaybackS()));
        const cueTo = lodash_1.default.find((cuesByLocale[subs_1.Locale.ZhTw] || []), cue => (0, subs_1.isCurrentCue)(cue, currentPlaybackS()));
        return [cueFrom, cueTo];
    });
    // cues shd be pre-sorted asc
    return (<div>
            <p class=" text-white text-2xl text-center w-full pt-1">
                {currentCues()?.[0]?.text}
            </p>
            <p class=" text-white text-2xl text-center w-full pb-1">
                {currentCues()?.[1]?.text}
            </p>
        </div>);
};
exports.ActiveSubs = ActiveSubs;
