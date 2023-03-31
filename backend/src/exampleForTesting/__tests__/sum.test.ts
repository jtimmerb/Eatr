import type * as TestFunctions from '../sum';

const {sum} = jest.requireActual<typeof TestFunctions>('../sum.ts');

const successCase = [
  {
    id: 0,
    input: {a: 0, b: 5},
    output: 5,
  },
  {
    id: 1,
    input: {a: 8, b: 2},
    output: 10,
  },
  {
    id: 2,
    input: {a: 6, b: 7},
    output: 13,
  },
];

describe('Test sum function', () => {
  it.each(successCase)('success case $id', ({input, output}) => {
    const {a, b} = input;
    expect(sum(a, b)).toBe(output);
  });
});
