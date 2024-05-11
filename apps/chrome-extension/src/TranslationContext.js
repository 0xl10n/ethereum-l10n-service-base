"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTranslationContext = exports.TranslationContextProvider = void 0;
const lodash_1 = __importDefault(require("lodash"));
const solid_js_1 = require("solid-js");
const PlaybackReceivedContext_1 = require("./PlaybackReceivedContext");
const subs_1 = require("@repo/subs");
const SubsContext_1 = require("./SubsContext");
const store_1 = require("solid-js/store");
const TranslationContext = (0, solid_js_1.createContext)();
// Mirror PlaybackContext as much as possible
const TranslationContextProvider = (props) => {
    const [playbackTimeSReceived, sendPlaybackControl] = (0, PlaybackReceivedContext_1.usePlaybackReceivedContext)();
    const [localeStore, setLocaleStore] = (0, store_1.createStore)({
        fromLocale: subs_1.Locale.En,
        toLocale: subs_1.Locale.ZhTw
    });
    const subsContext = (0, SubsContext_1.useSubsContext)();
    const { cuesByLocale } = subsContext;
    const cuesFrom = cuesByLocale[subs_1.Locale.En] || [];
    // TODO more efficient to seek from cues instead of one observer each
    const activeCue = (0, solid_js_1.createMemo)(() => {
        return lodash_1.default.find(cuesFrom, cue => (0, subs_1.isCurrentCue)(cue, playbackTimeSReceived()));
    });
    return (<TranslationContext.Provider value={{
            activeCue,
            localeStore
        }}>
            {props.children}
        </TranslationContext.Provider>);
};
exports.TranslationContextProvider = TranslationContextProvider;
const useTranslationContext = () => (0, solid_js_1.useContext)(TranslationContext);
exports.useTranslationContext = useTranslationContext;
