import * as fc from 'fast-check';
import { Translation } from './distribution';
import Decimal from 'decimal.js';

export const randomBigInt = () => fc.bigInt(1n, 1000000000000000000n);

// Generator for TranslationInput
export const translationArbitrary = fc.record({
  contributorAddress: fc.hexaString({ minLength: 40, maxLength: 40 }), // 40 hex characters for a typical Ethereum address
  lineId: fc.uuid(),
  translatedLineId: fc.uuid(),
  contributedAtMs: randomBigInt(),
  translatedText: fc.string({ minLength: 1 } ),
  score: fc.float({ min: 1, max: 100, noNaN: true })
    .map((it) => new Decimal(it)) // assuming score is a float between 1 and 100
});

export const tranlsationListArbitary = (constraints: fc.ArrayConstraints = {}) =>
  fc.array(translationArbitrary, constraints)

// Test fixture
export const translationsFixture: Translation[] = [
  {
    contributorAddress: '0x1234',
    lineId: 'line1',
    translatedLineId: 'translatedLine1',
    contributedAtMs: BigInt(1618000000000),
    translatedText: 'Hello, world!',
    score: new Decimal(10)
  },
  {
    contributorAddress: '0x5678',
    lineId: 'line1',
    translatedLineId: 'translatedLine2',
    contributedAtMs: BigInt(1618000005000),
    translatedText: 'Goodbye, world!',
    score: new Decimal(20)
  },
  {
    contributorAddress: '0x9abc',
    lineId: 'line1',
    translatedLineId: 'translatedLine3',
    contributedAtMs: BigInt(1618000010000),
    translatedText: 'Hello again, world!',
    score: new Decimal(30)
  },
  {
    contributorAddress: '0xdef0',
    lineId: 'line2',
    translatedLineId: 'translatedLine5',
    contributedAtMs: BigInt(1618000200000),
    translatedText: 'Goodbye, Bob!',
    score: new Decimal(5)
  },
  {
    contributorAddress: '0x2234',
    lineId: 'line2',
    translatedLineId: 'translatedLine6',
    contributedAtMs: BigInt(1618000300000),
    translatedText: 'Hello again, Bob!',
    score: new Decimal(5)
  },
  {
    contributorAddress: '0x1234',
    lineId: 'line2',
    translatedLineId: 'translatedLine4',
    contributedAtMs: BigInt(1618000100000),
    translatedText: 'Hello, Bob!',
    score: new Decimal(50)
  },
  {
    contributorAddress: '0x1234',
    lineId: 'line2',
    translatedLineId: 'translatedLine7',
    contributedAtMs: BigInt(1649536100000),
    translatedText: 'Hello, Bobby!',
    score: new Decimal(2)
  }
];
