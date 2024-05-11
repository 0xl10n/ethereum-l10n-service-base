"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageHeader = void 0;
const subs_1 = require("@repo/subs");
const TranslationContext_1 = require("./TranslationContext");
const LanguageHeader = () => {
    const { localeStore } = (0, TranslationContext_1.useTranslationContext)();
    return (<div class="text-xl font-bold">
            <div class="flex">
                <span>
                    <h2>
                        {subs_1.NAME_BY_LOCALE[localeStore?.fromLocale]}
                    </h2>
                </span>
                <span>
                    ➡️
                </span>
                <span>
                    <h2>
                        {subs_1.NAME_BY_LOCALE[localeStore?.toLocale]}
                    </h2>
                </span>
            </div>
        </div>);
};
exports.LanguageHeader = LanguageHeader;
