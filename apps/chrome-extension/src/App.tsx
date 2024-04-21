import { Locale } from '@repo/subs';
import { createSignal, type Component } from 'solid-js';
import { PlaybackContextProvider, usePlaybackContext } from './PlaybackContext';
import { SubsContextProvider } from './SubsContext';
import { produce } from 'solid-js/store';
import { RuntimeContextProvider } from './RuntimeContext';
import { PlaybackReceivedContextProvider } from './PlaybackReceivedContext';
import { SubsPanel } from './SubsPanel';
import { LanguageHeader } from './LanguageHeader';
import { WalletContextProvider } from './WalletContext';
import { WalletHeader } from './WalletHeader';
import { TranslationContextProvider } from './TranslationContext';
import { AttestButtonGroup } from './AttestButtonGroup';


const App: Component = () => {
  return (

    <RuntimeContextProvider>
      <WalletContextProvider>
        <PlaybackReceivedContextProvider>
          <SubsContextProvider>
            <TranslationContextProvider>
              <div class="bg-base-100 p-5">
                <WalletHeader />
                <LanguageHeader />
                <SubsPanel />
                <AttestButtonGroup />
              </div>
            </TranslationContextProvider>
          </SubsContextProvider>
        </PlaybackReceivedContextProvider>
      </WalletContextProvider>
    </RuntimeContextProvider>

  );
};

export default App;

