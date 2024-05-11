

const inputs = () => {
    return {
        "en": {
            "#docusaurus_skipToContent_fallback > button": "Scroll back to top",
            ".menu__link--active": "Welcome to EAS",
            ".menu__link[href*='/purpose']": "Purpose",
            ".menu__link[href*='/quick-start']": "Quick Start",
            ".menu__link[href*='/core-concepts']": "Core Concepts",
            ".menu__link[href*='/developer-tools']": "Developer Tools",
            ".menu__link[href*='/tutorials']": "Tutorials",
            ".menu__link[href*='/the-explorer']": "The Explorer",
            ".menu__link[href*='/ideas-to-build']": "Ideas to Build",
            ".navbar__title": "Ethereum Attestation Service",
            ".navbar__link[href*='easscan.org']": "EAS Explorer",
            ".navbar__link[href*='attest.sh']": "EAS Website",
            ".navbar__link[href*='github.com/ethereum-attestation-service']": "GitHub",
            ".breadcrumbs__link[aria-label='Home page']": "Home page",
            ".breadcrumbs__item--active > span": "Welcome to EAS",
            "h1": "Welcome to EAS",
            "article p:nth-of-type(1)": "👋 Welcome.​Ethereum Attestation Service (EAS) is an open-source infrastructure public good for making attestations onchain or offchain.",
            "article p:nth-of-type(2)": "How do you decide who and what to trust? Our online and onchain worlds are filled with both genuine and deceptive information. We need a common way we can trust the authenticity of information and safety of our interactions. Anytime you need to prove or verify something, attestations will play a critical role. EAS is a standard and base layer where any entity can make attestations about anything. This primitive and ledger of attestations will help us decentralize more than just money and assets. We'll be able to coordinate and build reputation systems, voting systems, governance systems, decentralized social media, provenance of goods, knowledge and social graphs, and much much more. We're excited to see what you'll build with EAS, and we can't wait to see how you'll use attestations to create a more trustful and transparent world.",
            "article p:nth-of-type(3) > a:nth-of-type(1)": "Why We Built EAS",
            "article p:nth-of-type(3) > a:nth-of-type(2)": "Why Attestations Matter​",
            "article p:nth-of-type(4) strong": "At its core, attestations are simply a digital signatures on a structured pieces of information.",
            "article p:nth-of-type(5)": "In the age of misinformation - verifying facts, proving the authenticity and trustworthiness of information become critical. In our offline worlds, people attest to things all the time. A notary attests that you signed a document, a doctor attests to your health, a university attests to your diploma, you attest to the post and likes you make on social media, a bank attests you're qualified for a loan, and even your friends attest that they like you or that they trust you. The interactions are endless. However there is no universal and standard way for making attestations online or onchain.",
            "article p:nth-of-type(6)": "At the heart of every interaction, whether it's a financial transaction or a simple online conversation, trust is essential. EAS enables anyone to make attestations onchain or offchain about anything. You simply register a schema (or use an existing one) about any topic and make attestations referencing that schema. We believe that by creating a free and open-source platform for attestations, we can foster innovation and enable people to verify and trust each other in a more efficient and transparent way. Join us and help build the global attestation layer for the Ethereum ecosystem.",
            "article p:nth-of-type(7) strong": "Key Things to Know About EAS​",
            "article p:nth-of-type(8) strong": "✨ The architecture is elegantly simple.​",
            "article p:nth-of-type(8)": "EAS runs on two simple smart contracts: one for registering attestation Schemas and another for attesting with them. Schemas can be registered for any use case, and attestations can be made onchain or offchain. You can also add a resolver contract to the Schema for advanced use cases, such as onchain verification of attestation data and attaching payments to attestations.",
            "article p:nth-of-type(9) strong": "🔓 We don't pressupose anything.​",
            "article p:nth-of-type(9)": "EAS doesn't box you in with presumptions. Instead, it offers a base layer that's adaptable to myriad applications and does not make assumptions about how it will be used or the appropriate schema structure for a particular use case. It is designed to be a foundation that can be used to build more specific and complex systems on top of it and can be tailored to fit the needs of different users. This primitive layer will enable the freedom to create and reinforce the right schemas and attestations for the right use cases for the right users over time.",
            "article p:nth-of-type(10) strong": "🙌  EAS is a public good.​",
            "article p:nth-of-type(10)": "EAS is an open-source, permissionless, tokenless, and free-to-use software. It's built by the community for the community. As a public good, we've opted for impact over profit. We realized that when you are building something so atomic for trust and identity, it's imperative that someone with a bigger budget can't manipulate the protocol or community for their own financial gain. Trust and money are like oil and water. To become a standard, we need to keep value extractors away from value creator at the protocol layer. It must be credibly neutral. Anyone has the ability to build for-profit businesses on top of the protocol that leverage attestations.",
            "article p:nth-of-type(11) strong": "💡 Attestations aren't tokens.​",
            "article p:nth-of-type(11)": "It's a new primitive. While tokens represent a type of digital asset, EAS attestations are fundamentally different. The primary purpose of EAS is to serve as a protocol that facilitates the creation of digital signatures on structured information, enhancing both their composability and interoperability, trust, and validation. You can build your own UIs for attestation data or even generate NFTs or different ERCs based on attestations.",
            "article p:nth-of-type(12) strong": "🧠 Think beyond identity.​",
            "article p:nth-of-type(12)": "The identity ecosystem is extremely fragmented and a key reason why EAS was built, however, its flexibility lends itself to build trust beyond identity. EAS is not an identity provider. EAS allows for a wide range of possibilities for entrepreneurs and developers to build applications that make use of attestations. Some examples of what can be built with EAS include reputation systems, provenance of information or assets, voting & governance systems, registries, social graphs, and more. We're excited to see what you'll build with EAS and how you'll use attestations to create a more trustful and transparent world.",
            "article p:nth-of-type(13)": "Get inspired with a few thought starters!",
            "article p:nth-of-type(14) strong": "Start Building​",
            "article p:nth-of-type(14)": "We're excited to see what you build with EAS. Let's get started!",
            "article p:nth-of-type(15)": "Read the documentation to learn more about attestations and how to use EAS.",
            "article p:nth-of-type(16)": "Install the SDK to easily integrate into a Javascript/Typescript project",
            "article p:nth-of-type(17)": "Create your own indexer for easily indexing attestation data.",
            "article p:nth-of-type(18)": "Query your attestations with the GraphQL API using the EAS smart contracts or UI.",
            "article p:nth-of-type(19)": "Use the EAS to create and verify attestations for any purpose.",
            "article p:nth-of-type(20) strong": "Join the Community​",
            "article p:nth-of-type(20)": "Come build with us. EAS is built by the community and for the community. You can join the community and contribute to the project by:",
            "article p:nth-of-type(21)": "Joining the EAS telegram channel for discussions and support EAS Telegram.",
            "article p:nth-of-type(22)": "Submitting issues or pull requests on the EAS GitHub repository.",
            "article p:nth-of-type(23)": "Following for updates and announcements on X (Twitter) @eas_eth."
        },
        "zh_TW": {
            "#docusaurus_skipToContent_fallback > button": "滾動回頁首",
            ".menu__link--active": "歡迎使用 EAS",
            ".menu__link[href*='/purpose']": "目的",
            ".menu__link[href*='/quick-start']": "快速入門",
            ".menu__link[href*='/core-concepts']": "核心概念",
            ".menu__link[href*='/developer-tools']": "開發者工具",
            ".menu__link[href*='/tutorials']": "教學",
            ".menu__link[href*='/the-explorer']": "瀏覽器",
            ".menu__link[href*='/ideas-to-build']": "建構構想",
            ".navbar__title": "以太坊認證服務",
            ".navbar__link[href*='easscan.org']": "EAS 瀏覽器",
            ".navbar__link[href*='attest.sh']": "EAS 網站",
            ".navbar__link[href*='github.com/ethereum-attestation-service']": "GitHub",
            ".breadcrumbs__link[aria-label='Home page']": "主頁",
            ".breadcrumbs__item--active > span": "歡迎使用 EAS",
            "h1": "歡迎使用 EAS",
            "article p:nth-of-type(1)": "👋 歡迎。​以太坊認證服務 (EAS) 是一種用於在鏈上或鏈下進行認證的開源基礎設施公共產品。",
            "article p:nth-of-type(2)": "您如何決定信任誰和信任什麼？我們的線上和鏈上世界充滿了真實和虛假的信息。我們需要一種通用的方式來信任信息的真實性和互動的安全性。每當您需要證明或驗證某些東西時，認證都將發揮關鍵作用。EAS 是一個標準和基礎層，任何實體都可以對任何事物進行認證。這個原始的認證分類帳將幫助我們不僅僅是去中心化貨幣和資產。我們將能夠協調和構建聲譽系統、投票系統、治理系統、去中心化社交媒體、商品來源、知識和社交圖，以及更多。我們很興奮地看到您將使用 EAS 構建什麼，並且迫不及待地想看到您將如何使用認證來創造一個更加信任和透明的世界。",
            "article p:nth-of-type(3) > a:nth-of-type(1)": "我們為什麼構建 EAS",
            "article p:nth-of-type(3) > a:nth-of-type(2)": "為什麼認證很重要​",
            "article p:nth-of-type(4) strong": "從本質上講，認證只是對結構化信息片段的數字簽名。",
            "article p:nth-of-type(5)": "在這個錯誤信息時代，驗證事實、證明信息的真實性和可信度變得至關重要。在我們的線下世界中，人們一直在證明各種事情。公證人證明您簽署了文件，醫生證明您的健康狀況，大學證明您的文憑，您證明您在社交媒體上發布的帖子和點讚，銀行證明您有資格獲得貸款，甚至您的朋友證明他們喜歡您或信任您。互動是無窮無盡的。然而，沒有通用的標準方式來線上或鏈上進行認證。",
            "article p:nth-of-type(6)": "在每一次互動的核心，無論是金融交易還是簡單的線上對話，信任都是必不可少的。EAS 使任何人都可以對任何事物進行鏈上或鏈下認證。您只需註冊一個關於任何主題的模式（或使用現有的模式），並進行參考該模式的認證。我們相信，通過創建一個免費和開源的認證平台，我們可以促進創新，並使人們能夠以更有效和透明的方式相互驗證和信任。加入我們，幫助為以太坊生態系統構建全球認證層。",
            "article p:nth-of-type(7) strong": "關於 EAS 的重要事項​",
            "article p:nth-of-type(8) strong": "✨ 架構非常簡單。​",
            "article p:nth-of-type(8)": "EAS 運行在兩個簡單的智能合約上：一個用於註冊認證模式，另一個用於使用它們進行認證。模式可以註冊用於任何用例，並且認證可以在鏈上或鏈下進行。您還可以向模式添加解析器合約以用於高級用例，例如鏈上驗證認證數據和將付款附加到認證。",
            "article p:nth-of-type(9) strong": "🔓 我們不做任何假設。​",
            "article p:nth-of-type(9)": "EAS 不會用假設來限制您。相反，它提供了一個適應無數應用程序的基礎層，並且不對其使用方式或特定用例的適當模式結構做出假設。它旨在成為一個基礎，可用於在其之上構建更具體和複雜的系統，並且可以根據不同用戶的需求進行定制。這個原始層將使人們能夠自由地為正確的用例、正確的用戶創建和加強正確的模式和認證。",
            "article p:nth-of-type(10) strong": "🙌  EAS 是一種公共產品。​",
            "article p:nth-of-type(10)": "EAS 是一種開源、無需許可、無代幣和免費使用的軟件。它是社區為社區構建的。作為一種公共產品，我 們選擇了影響力而不是利潤。我們意識到，當您構建如此原子化的信任和身份的東西時，必須確保預算較大的人不能為了自己的經濟利益而操縱協議或社區。信任和金錢就像油和水。為了成為一個標準，我們需要讓價值提取者遠離協議層的價值創造者。它必須是可信的中立的。任何人都可以在利用認證的協議之上構建營利性業務。",
            "article p:nth-of-type(11) strong": "💡 認證不是代幣。​",
            "article p:nth-of-type(11)": "這是一種新的原語。雖然代幣代表一種數字資產，但 EAS 認證在根本上是不同的。EAS 的主要目的是作為一個協議，促進在結構化信息上創建數字簽名，增強其可組合性和互操作性、信任和驗證。您可以為認證數據構建自己的 UI，甚至可以根據認證生成 NFT 或不同的 ERC。",
            "article p:nth-of-type(12) strong": "🧠 超越身份思考。​",
            "article p:nth-of-type(12)": "身份生態系統極度分散，這是構建 EAS 的一個關鍵原因，然而，它的靈活性使其能夠超越身份構建信任。EAS 不是身份提供商。EAS 為企業家和開發人員提供了廣泛的可能性，以構建利用認證的應用程序。使用 EAS 可以構建的一些示例包括聲譽系統、信息或資產來源、投 票和治理系統、註冊表、社交圖等等。我們很興奮地看到您將使用 EAS 構建什麼，以及您將如何使用認證來創造一個更加信任和透明的世界。",
            "article p:nth-of-type(13)": "從一些思考的起點獲得靈感！",
            "article p:nth-of-type(14) strong": "開始構建​",
            "article p:nth-of-type(14)": "我們很興奮地看到您使用 EAS 構建什麼。讓我們開始吧！",
            "article p:nth-of-type(15)": "閱讀文檔以了解有關認證以及如何使用 EAS 的更多信息。",
            "article p:nth-of-type(16)": "安裝 SDK 以輕鬆集成到 Javascript/Typescript 項目中",
            "article p:nth-of-type(17)": "創建您自己的索引器，以便輕鬆索引認證數據。",
            "article p:nth-of-type(18)": "使用 EAS 智能合約或 UI，通過 GraphQL API 查詢您的認證。",
            "article p:nth-of-type(19)": "使用 EAS 為任何目的創建和驗證認證。",
            "article p:nth-of-type(20) strong": "加入社區​",
            "article p:nth-of-type(20)": "與我們一起構建。EAS 由社區構建，為社區服務。您可以通過以下方式加入社區並為項目做出貢獻：",
            "article p:nth-of-type(21)": "加入 EAS 電報頻道以進行討論和支持 EAS Telegram。",
            "article p:nth-of-type(22)": "在 EAS GitHub 倉庫上提交問題或拉取請求。",
            "article p:nth-of-type(23)": "在 X (Twitter) @eas_eth 上關注更新和公告。"
        }
    }
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        console.log('l10n script', document);

        const kv = inputs()

        Object.keys(kv["zh_TW"]).map(
            selector => {

                const elements = document.querySelectorAll(selector);
                console.log('selector', selector, elements)

                const content = kv["zh_TW"][selector]
                console.log('content', content)
                // Iterate through each element and modify its content
                elements.forEach((element) => {
                    // Update inner content
                    element.innerHTML = content;

                    // Optionally update attributes
                    // element.setAttribute('class', 'new-class');
                });

            }
        )

    };

}