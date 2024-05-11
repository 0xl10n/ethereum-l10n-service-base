"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSubsContext = exports.SubsContextProvider = void 0;
const solid_js_1 = require("solid-js");
const store_1 = require("solid-js/store");
const subs_1 = require("@repo/subs");
const rxjs_1 = require("rxjs");
const SubsContext = (0, solid_js_1.createContext)({ cuesByLocale: {} });
const SubsContextProvider = (props) => {
    const [cuesByLocale, setCuesByLocale] = (0, store_1.createStore)({
        [subs_1.Locale.En]: [],
        [subs_1.Locale.ZhTw]: []
    });
    // TODO run once only
    (0, subs_1.parseForCues)(window, subs_1.VTT_WHISPER_EN)
        .pipe((0, rxjs_1.tap)((cue) => {
        setCuesByLocale((0, store_1.produce)((cueByLocale) => {
            cueByLocale[subs_1.Locale.En].push(cue);
        }));
    }))
        .subscribe();
    (0, subs_1.parseForCues)(window, subs_1.VTT_WHISPER_ZH_TW)
        .pipe((0, rxjs_1.tap)((cue) => {
        setCuesByLocale((0, store_1.produce)((cueByLocale) => {
            cueByLocale[subs_1.Locale.ZhTw].push(cue);
        }));
    }))
        .subscribe();
    return (<SubsContext.Provider value={{
            cuesByLocale,
        }}>
            {props.children}
        </SubsContext.Provider>);
};
exports.SubsContextProvider = SubsContextProvider;
const useSubsContext = () => (0, solid_js_1.useContext)(SubsContext);
exports.useSubsContext = useSubsContext;
