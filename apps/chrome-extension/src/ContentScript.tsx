console.log('ContentScript.tsx');
import './index.css'
import { render } from 'solid-js/web';
import { ActiveSubs } from './Subs';
import { PlaybackContextProvider, usePlaybackContext } from './PlaybackContext';
import { SubsContextProvider, SubsContextArgs, useSubsContext } from './SubsContext';
import { Locale, createTranscriptFileName } from '@repo/subs';

const PlaybackDisplay = () => {
  const [currentPlaybackS] = usePlaybackContext();

  return (
    <div>
      {currentPlaybackS()}
    </div>
  )
};

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log("Message from runtime:", request);
    const { action, actionParams } = request;

    if (action === 'seekTo') {
      console.log('seekTo', actionParams);
      const { playbackS, isPause } = actionParams
      const video = document.querySelector('video');
      video.currentTime = playbackS;
      if (isPause) {
        video.pause();
      }
    }
  }
);

const SuggestionContainer = () => {
  const submitSuggestion = async () => {
    const subsContext: SubsContextArgs = useSubsContext()
    const { cuesByLocale } = subsContext

    let suggestionTextArea = document.querySelector('#suggestion-textarea');
    let suggestionText = suggestionTextArea.value;

    // update the button to disabled and loading
    const submitButton = document.querySelector('#submit-button');
    submitButton.disabled = true;
    const video = document.querySelector('video');
    console.log(video.currentTime);
    submitButton.textContent = 'Loading...';

    // TODO: wrap into shared function
    let domain: string = window.location.hostname;
    let videoId: string = window.location.search.split('v=')[1];
    let sourceId: string;

    switch (domain) {
      case 'www.youtube.com':
        sourceId = createTranscriptFileName('youtube', videoId, Locale.ZhTw);
        break;
      default:
        return;
    }

    let response = await fetch('http://localhost:4000/suggestions', {
      mode: "cors",
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sourceId: sourceId,
        sourceStringId: '1', // TODO: should be index of the vtt based on current time
        text: suggestionText,
      })
    });
    console.log('response', await response.json());
    // update the button to submitted for 3 seconds
    suggestionTextArea.value = '';
    submitButton.disabled = false;
    submitButton.textContent = 'Submitted';
    submitButton.classList.add('btn-success');
    setTimeout(() => {
      submitButton.classList.remove('btn-success');
      submitButton.textContent = 'Submit';
    }, 1000);
  }

  return (
    <div style="z-index:900;" class="fixed rounded-xl bg-base-200 w-full m-2 h-80 p-10 z-50 bottom-10">
      <div class="flex flex-col w-full h-100 rounded-xl text-white place-content-center">
        <div>
          <h2 class="text-2xl">
            🙋‍♂️Suggestion
          </h2>
        </div>
        <div class="p-5">
          <textarea id="suggestion-textarea" placeholder="Add Suggestion" class="textarea textarea-bordered textarea-lg w-11/12 p-5" ></textarea>
          <div id="submit-button" onclick={submitSuggestion}
            class="flex flex-row-reverse w-full"><button class="btn btn-outline text-white text-xl">Submit</button></div>
        </div >
      </div >
    </div >
  )
}

const SubsContainer = () => {
  return (
    <PlaybackContextProvider>
      <SubsContextProvider>
        <div>

          <div
            class="els-subs-container absolute bottom-0
                  bg-base-300 rounded-xl w-full z-50 overflow-hidden pr-[24px]
                  text-white text-lg text-center"
          >
            <ActiveSubs />
            <PlaybackDisplay />
          </div>
        </div>
      </SubsContextProvider>
    </PlaybackContextProvider>
  );
};

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    console.log('content script', document);

    setTimeout(() => {
      // not availalbe in iife
      //https://github.com/mikesteele/dual-captions/blob/b0ab92e4670100a27b76b2796995ad1be89f1672/content_script/src/index.js#L7
      const subs = document.createElement('div');

      // https://stackoverflow.com/questions/48104433/how-to-import-es6-modules-in-content-script-for-chrome-extension

      // const src = chrome.runtime.getURL("https://cdn.jsdelivr.net/npm/solid-js@1.8.16/web/dist/web.js");
      // const contentMain = await import(src);
      // console.log(src)

      // var script = document.createElement('script');
      // script.setAttribute('src', 'https://cdn.jsdelivr.net/npm/solid-js@1.8.16/+esm');
      // document.head.appendChild(script);

      subs.className = 'els-subs';

      const subsText = document.createElement('p');
      subs.appendChild(subsText);

      const container = document.getElementById('player-container-outer');
      console.log('container ytd', container);
      // const notificationText = document.createElement('p');



      const parentContainer = document.getElementsByClassName('ytd-player')?.[0] as HTMLElement;
      // create offset so subs can float on top
      // on parent as video will take full of container
      // buttons ytp-chrome-bottom
      parentContainer.style.paddingBottom = '60px'


      parentContainer.appendChild(subs);
      console.log('element injected');

      render(() => <SubsContainer />, parentContainer!);
      const body = document.querySelector('body');

      render(() => <SuggestionContainer />, body!);


      // window.chrome.sidePanel.setOptions({
      //     tabId,
      //     enabled: true
      //   });
    }, 2000);
  }
};
