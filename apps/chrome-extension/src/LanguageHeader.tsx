import { Locale, NAME_BY_LOCALE } from '@repo/subs';

export const LanguageHeader = ({
    fromLocale, toLocale
}: { fromLocale: Locale, toLocale: Locale }) => {

    return (
        <div class="text-xl">
            <div class="flex">
                <span>
                    <h2>
                        {NAME_BY_LOCALE[fromLocale]}
                    </h2>
                </span>
                <span>
                    ➡️
                </span>
                <span>
                    <h2>
                        {NAME_BY_LOCALE[toLocale]}
                    </h2>
                </span>
            </div>
        </div>
    )
}