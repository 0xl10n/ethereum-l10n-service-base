export default () => {
  return {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
    },
    lighthouse: {
      apiKey: process.env.LIGHTHOUSE_API_KEY,
    },
    video: {
      timeIntervalS: 30,
    },
  };
};
