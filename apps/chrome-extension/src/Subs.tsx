import _ from 'lodash';


import { isCurrentCue, Locale } from '@repo/subs';
import { SubsContextArgs, useSubsContext } from './SubsContext';
import { usePlaybackReceivedContext } from './PlaybackReceivedContext';
import { usePlaybackContext } from './PlaybackContext';
import { createMemo } from 'solid-js';


export const ActiveSubs = () => {

    const [currentPlaybackS] = usePlaybackContext();

    const subsContext: SubsContextArgs = useSubsContext()


    const { cuesByLocale } = subsContext

    // TODO create explicit deps 
    const currentCues = createMemo(() => {

        // better consider last endTime

        const cueFrom = _.find(
            (cuesByLocale[Locale.En] || []),
            cue => isCurrentCue(cue, currentPlaybackS())
        );

        const cueTo = _.find(
            (cuesByLocale[Locale.ZhTw] || []),
            cue => isCurrentCue(cue, currentPlaybackS())
        );

        return [cueFrom, cueTo];

    })

    // cues shd be pre-sorted asc
    return (
        <div>
            <p class=" text-white text-2xl text-center w-full pt-1">
                {currentCues()?.[0]?.text}
            </p>
            <p class=" text-white text-2xl text-center w-full pb-1">
                {currentCues()?.[1]?.text}
            </p>
        </div>
    );
};
