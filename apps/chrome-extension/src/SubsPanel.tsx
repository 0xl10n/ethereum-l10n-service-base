import _ from 'lodash'
import { Component, For, createMemo } from 'solid-js';
import { usePlaybackReceivedContext } from './PlaybackReceivedContext';
import { useSubsContext } from './SubsContext';
import { isCurrentCue, Locale, CUE_BUFFER } from '@repo/subs';
import { useTranslationContext } from './TranslationContext';

export const SubsRows = ({
    cuesFrom = [],
    cuesTo = [],
    currentPlaybackS,
    sendPlaybackControl
}: {
    cuesFrom: VTTCue[];
    cuesTo: VTTCue[];
    currentPlaybackS: () => number;
    sendPlaybackControl: any
}) => {


    const { activeCue } = useTranslationContext();


    const onCueClick = (cue) => {
        sendPlaybackControl('seekTo', { playbackS: cue.startTime - CUE_BUFFER, isPause: true })
    }

    const activeClassName = 'bg-base-content';
    const defaultClassName = 'bg-base-200 text-neutral-content';


    return (
        <div>
            <For each={cuesFrom}>
                {(cue, i) => (
                    <tr
                        onClick={() => onCueClick(cue)}
                        class={
                            (activeCue.id === cue.id ? activeClassName : defaultClassName) +
                            ' text-white rounded'
                        }
                    >
                        <th class="text-xs min-w-32 p-1">
                            {cue.startTime} - {cue.endTime}
                        </th>
                        <td>
                            <p>{cue.text} </p>
                            <p> {cuesTo[i()]?.text} </p>
                        </td>
                    </tr>
                )}
            </For>
        </div>
    );
};

export const SubsPanel: Component = () => {
    const [currentPlaybackS, sendPlaybackControl] = usePlaybackReceivedContext();

    const subsContext = useSubsContext();

    const { cuesByLocale } = subsContext;

    const open = async () => {
        console.log('open');
    };

    return (
        <div class="bg-base-200 text-white">
            <div class="overflow-x-auto overflow-y-scroll max-h-[90vh] h-full m-2">
                <table class="table">
                    <tbody>
                        <SubsRows
                            cuesFrom={cuesByLocale[Locale.En] || []}
                            cuesTo={cuesByLocale[Locale.ZhTw] || []}
                            currentPlaybackS={currentPlaybackS}
                            sendPlaybackControl={sendPlaybackControl}
                        />
                    </tbody>
                </table>
            </div>
        </div>
    );
};
