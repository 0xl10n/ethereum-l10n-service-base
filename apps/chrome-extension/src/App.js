"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SubsContext_1 = require("./SubsContext");
const RuntimeContext_1 = require("./RuntimeContext");
const PlaybackReceivedContext_1 = require("./PlaybackReceivedContext");
const SubsPanel_1 = require("./SubsPanel");
const LanguageHeader_1 = require("./LanguageHeader");
const WalletContext_1 = require("./WalletContext");
const WalletHeader_1 = require("./WalletHeader");
const TranslationContext_1 = require("./TranslationContext");
const AttestButtonGroup_1 = require("./AttestButtonGroup");
const App = () => {
    return (<RuntimeContext_1.RuntimeContextProvider>
      <WalletContext_1.WalletContextProvider>
        <PlaybackReceivedContext_1.PlaybackReceivedContextProvider>
          <SubsContext_1.SubsContextProvider>
            <TranslationContext_1.TranslationContextProvider>
              <div class="bg-base-100 p-5">
                <WalletHeader_1.WalletHeader />
                <LanguageHeader_1.LanguageHeader />
                <SubsPanel_1.SubsPanel />
                <AttestButtonGroup_1.AttestButtonGroup />
              </div>
            </TranslationContext_1.TranslationContextProvider>
          </SubsContext_1.SubsContextProvider>
        </PlaybackReceivedContext_1.PlaybackReceivedContextProvider>
      </WalletContext_1.WalletContextProvider>
    </RuntimeContext_1.RuntimeContextProvider>);
};
exports.default = App;
