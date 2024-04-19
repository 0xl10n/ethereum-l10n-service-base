import { Locale } from '@repo/subs';
import { createSignal, type Component } from 'solid-js';
import { PlaybackContextProvider, usePlaybackContext } from './PlaybackContext';
import { SubsContextProvider } from './SubsContext';
import { produce } from 'solid-js/store';
import { RuntimeContextProvider } from './RuntimeContext';
import { PlaybackReceivedContextProvider } from './PlaybackReceivedContext';
import { SubsPanel } from './SubsPanel';
import { LanguageHeader } from './LanguageHeader';


const App: Component = () => {
  return (
    <RuntimeContextProvider>
      <PlaybackReceivedContextProvider>
        <SubsContextProvider>
          <div class="bg-base-100 p-5">
            <LanguageHeader fromLocale={Locale.En} toLocale={Locale.ZhTw} />
            <SubsPanel />
          </div>
        </SubsContextProvider>
      </PlaybackReceivedContextProvider>

    </RuntimeContextProvider>

  );
};

export default App;

