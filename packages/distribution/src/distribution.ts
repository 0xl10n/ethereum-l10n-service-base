import {
  each,flatten, flow, fromPairs, get, groupBy, invoke,
  map, mapValues, sum, sumBy, sortBy, tap, toPairs, values
} from 'lodash/fp';
import rawMap from 'lodash/map';
import Decimal from 'decimal.js';

import levenshtein from 'js-levenshtein';

export type WalletAddress = string;

// 0.1 represents 10%
export type AllocationRatio = Decimal;

export type Distribution = [WalletAddress, AllocationRatio];

export type TranslationInput = {
  contributorAddress: WalletAddress,
  lineId: string,
  translatedLineId: string,
  contributedAtMs: bigint,
  translatedText: string,
  // assuming value [1, 100]
  score: number | Decimal
};

export type Translation = TranslationInput & {
  score: Decimal
};

export type WithEditDistance = Translation & {
  // between 0 and EDIT_DISTANCE_MULTIPLIER_SCALE
  editDistanceMultiplier: number
};

export type WithDecay = Translation & {
  // between 0 and 1
  decayMultiplier: number
};

export type WithAdjustedScore = Translation & {
  adjustedScore: Decimal
};

// Scale of effect of edit distance.
export const EDIT_DISTANCE_MULTIPLIER_SCALE = 1

// 365 days - meaning contribution after 365 days the decay multiplier = 0
export const DEFAULT_DECAY_THRESHOLD = 365 * 24 * 60 * 60 * 1000;

export const sumDecimal = (them: Decimal[]) => them.length > 0 ? Decimal.sum(...them) : new Decimal(0)
export const sumByDecimal = (key: string) => flow(map(get(key)), sumDecimal)

/**
 * @returns A flattened list of distribution. The sum of all AllocationRatio <= 1.
 */
export function calculateDistribution(inputs: Translation[]): Distribution[] {
  return flow(
    map((it: TranslationInput) => ({ ...it, score: new Decimal(it.score) })),
    each(validate),
    createAdjustedScores(),
    sumByWallet,
    normalizeScore,
  )(inputs)
}

export function validate(input: Translation): void {
  const { score } = input

  if (score.lessThan(1) || score.greaterThan(100)) {
    throw new Error('score must be [1, 100]')
  }
}

/**
 * Injects `adjustedScore` to each item.
 */
export const createAdjustedScores = (
  injectEditDistanceMultiplier = createEditDistanceMultiplier(),
  injectDecayMultiplier = createDecayMultiplier()
) => flow(
  groupBy('lineId'),
  mapValues(sortBy('contributedAtMs')),
  mapValues(injectEditDistanceMultiplier),
  mapValues(injectDecayMultiplier),
  mapValues(map((curr: Translation & WithEditDistance & WithDecay): Translation & WithAdjustedScore => ({
    ...curr,
    adjustedScore: curr.score.times(curr.editDistanceMultiplier).times(curr.decayMultiplier)
  }))),
  values,
  flatten,
)

/**
 * Group and sum scores by wallet address.
 */
export const sumByWallet = flow(
  groupBy('contributorAddress'),
  mapValues(sumByDecimal('adjustedScore')),
  toPairs,
)

/**
 * Normalize adjusted scores into percentage value.
 */
export const normalizeScore = (scores: [string, number][]) => {
  const total = flow(map(get(1)), sumDecimal)(scores)
  return flow(
    fromPairs,
    mapValues((it: number) => new Decimal(it)),
    mapValues((it: Decimal) => it.dividedBy(total)),
    toPairs
  )(scores)
}

/**
 * Calculates multiplier based on edit distance / text length.
 */
export const createEditDistanceMultiplier = (scale: number = EDIT_DISTANCE_MULTIPLIER_SCALE) =>
  (them: Translation[] ): Translation[] =>
    rawMap(them, (curr, i, array): Translation & WithEditDistance => {
      if (i === 0) {
        return { ...curr, editDistanceMultiplier: 1 };
      }

      const last = array[i - 1]!
      const editDistance = levenshtein(last.translatedText, curr.translatedText)
      const editDistanceMultiplier = scale * editDistance / last.translatedText.length

      return { ...curr, editDistanceMultiplier }
    }
  )

export const createDecayMultiplier = (threshold: number = DEFAULT_DECAY_THRESHOLD) =>
  (them: Translation[]) =>
    rawMap(them, (curr, i, array): Translation & WithDecay => {
      if (i === 0) {
        return { ...curr, decayMultiplier: 1 };
      }

      const timeDiff = curr.contributedAtMs - array[0]!.contributedAtMs;
      const decayMultiplier = 1 - (timeDiff <= Number.MAX_SAFE_INTEGER ? Number(timeDiff) : Number.MAX_SAFE_INTEGER) / threshold

      return {
        ...curr,
        decayMultiplier: decayMultiplier > 0 ? Number(decayMultiplier) : 0
      };
    }
  )

export const debugLog = tap(it => console.debug('[DEBUG] ==> ', it))
