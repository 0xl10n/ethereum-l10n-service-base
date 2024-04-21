import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import {
  each,flatten, flow, get, groupBy, map, mapValues,
  sortBy, tap, toPairs, values
} from 'lodash/fp';
import {
  type Translation,
  type WithAdjustedScore,
  calculateDistribution,
  createAdjustedScores,
  createDecayMultiplier,
  createEditDistanceMultiplier,
  sumDecimal,
  debugLog,
} from "./distribution";
import { tranlsationListArbitary, translationsFixture } from './distribution.fixture';
import Decimal from 'decimal.js';

describe('createEditDistanceMultiplier()', () => {
  const injectEditDistanceMultiplier = createEditDistanceMultiplier()

  test('it adds "editDistance" to tranlsation inputs', () => {
    expect(injectEditDistanceMultiplier(translationsFixture)).toMatchSnapshot()
  })
})

describe('decayMultiplier()', () => {
  const injectDecayMultiplier = createDecayMultiplier()

  test('it adds "decayMultiplier" to tranlsation objects', () => {
    expect(injectDecayMultiplier(translationsFixture)).toMatchSnapshot()
  })
})

describe('createAdjustedScores()', () => {
  const injectAdjustedScores = createAdjustedScores()

  describe('Properties', () => {
    test('adjustedScore >= 0', () => {
      fc.assert(
        fc.property(tranlsationListArbitary(), (inputs) => {
          const outputs = injectAdjustedScores(inputs)
          outputs.forEach((it: Translation & WithAdjustedScore) => {
            expect(it.adjustedScore.greaterThanOrEqualTo(0)).toBeTruthy()
          })
        })
      )
    })
  })

  test('it adds "adjustedScores" to tranlsation inputs', () => {
    expect(injectAdjustedScores(translationsFixture)).toMatchSnapshot()
  })
})

describe('calculateDistribution()', () => {
  test('it returns [[address, distributionPercentage]]', () => {
    expect(calculateDistribution(translationsFixture)).toMatchSnapshot()
  })

  describe('Properties', () => {
    test('total distribution in range [0, 1]', () => {
      fc.assert(
        fc.property(tranlsationListArbitary(), (inputs) => {
          const sum: Decimal = flow(
            map(get(1)),
            sumDecimal,
          )(calculateDistribution(inputs))

          expect(sum.lessThanOrEqualTo(1)).toBeTruthy()
        })
      )
    })
  })
})
