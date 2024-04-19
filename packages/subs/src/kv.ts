// TODO use lib to be indifferent vs redis

export type Query = {};

export const filterVideos = (query: Query) => {
  return [
    {
      videoId: '',
      status: 'asr-completed',
      translations: [
        {
          fromLocale: 'en',
          toLocale: 'zh-TW',
          source: 'whisper',
          status: 'pending',
        },
        {
          fromLocale: 'en',
          source: 'gpt-4',
          toLocale: 'zh-TW',
          status: 'initialized',
        },
      ],
    },
    {
      videoId: '',
      status: 'pending',
      translations: [],
    },
  ].filter((video) => video.status === query.status);
};
