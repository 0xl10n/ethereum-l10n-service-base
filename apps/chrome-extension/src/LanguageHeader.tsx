import { Locale, NAME_BY_LOCALE } from '@repo/subs';
import { useTranslationContext } from './TranslationContext';

export const LanguageHeader = () => {


    const { localeStore } = useTranslationContext()

    return (
        <div class="text-xl font-bold">
            <div class="flex">
                <span>
                    <h2>
                        {NAME_BY_LOCALE[localeStore?.fromLocale]}
                    </h2>
                </span>
                <span>
                    ➡️
                </span>
                <span>
                    <h2>
                        {NAME_BY_LOCALE[localeStore?.toLocale]}
                    </h2>
                </span>
            </div>
        </div>
    )
}