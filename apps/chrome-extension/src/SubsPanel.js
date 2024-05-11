"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubsPanel = exports.SubsRows = void 0;
const solid_js_1 = require("solid-js");
const PlaybackReceivedContext_1 = require("./PlaybackReceivedContext");
const SubsContext_1 = require("./SubsContext");
const subs_1 = require("@repo/subs");
const TranslationContext_1 = require("./TranslationContext");
const SubsRows = ({ cuesFrom = [], cuesTo = [], sendPlaybackControl }) => {
    const { activeCue } = (0, TranslationContext_1.useTranslationContext)();
    console.log('activeCue', activeCue, activeCue(), activeCue.id);
    const onCueClick = (cue) => {
        sendPlaybackControl('seekTo', { playbackS: cue.startTime - subs_1.CUE_BUFFER, isPause: true });
    };
    const activeClassName = 'bg-base-content';
    const defaultClassName = 'bg-base-200 text-neutral-content';
    return (<div>
            <solid_js_1.For each={cuesFrom}>
                {(cue, i) => (<tr onClick={() => onCueClick(cue)} class={(activeCue().id === cue.id ? activeClassName : defaultClassName) +
                ' text-white rounded'}>
                        <th class="text-xs min-w-32 p-1">
                            {cue.startTime} - {cue.endTime}
                        </th>
                        <td>
                            <p>{cue.text} </p>
                            <p> {cuesTo[i()]?.text} </p>
                        </td>
                    </tr>)}
            </solid_js_1.For>
        </div>);
};
exports.SubsRows = SubsRows;
const SubsPanel = () => {
    const [currentPlaybackS, sendPlaybackControl] = (0, PlaybackReceivedContext_1.usePlaybackReceivedContext)();
    const subsContext = (0, SubsContext_1.useSubsContext)();
    const { cuesByLocale } = subsContext;
    const open = async () => {
        console.log('open');
    };
    return (<div class="bg-base-200 text-white">
            <div class="overflow-x-auto overflow-y-scroll max-h-[60vh] h-full m-2">
                <table class="table">
                    <tbody>
                        <exports.SubsRows cuesFrom={cuesByLocale[subs_1.Locale.En] || []} cuesTo={cuesByLocale[subs_1.Locale.ZhTw] || []} sendPlaybackControl={sendPlaybackControl}/>
                    </tbody>
                </table>
            </div>
        </div>);
};
exports.SubsPanel = SubsPanel;
