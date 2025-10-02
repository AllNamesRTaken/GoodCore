import {
  expect,
  describe,
  test,
  vi,
  afterAll,
  beforeEach,
  afterEach,
} from 'vitest'
import { Pipeline } from '../lib/standard/Pipeline.ts'

const delay = (fn: () => any, ms = 0) =>
  new Promise<number>((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(fn())
      } catch (e) {
        reject(e)
      }
    }, ms)
  })

describe('Pipeline', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    // vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })
  test.sequential('Sync pipeline works', async function() {
    const pipe = Pipeline
			.add((_, step) => 10)
      .add((input, step) => input + 5)
      .add((input, step) => input.toString())

    const pipeWithInput = Pipeline
			.add((input: number, step) => input)
      .add((input, step) => input + 5)
      .add((input, step) => input.toString())

		const success = pipe.run()
		const successWithInput = pipeWithInput.run(20)
		await vi.runAllTimersAsync()
    const result = await success
    const resultWithInput = await successWithInput

    expect(result.value).toBe('15')
    expect(resultWithInput.value).toBe('25')
  })
  test.sequential('Async pipeline works', async function() {
    const pipe = Pipeline.add(async (_, step) => delay(() => 10))
      .add(async (input, step) => delay(() => input + 5))
      .add(async (input, step) => delay(() => input.toString()))

		const success = pipe.run()
		await vi.runAllTimersAsync()
    const result = await success

    expect(result.value).toBe('15')
  })
  test.sequential('at() returns result for named and indexed step', async function() {

    const pipe = Pipeline
			.add(function step1(input: number, step) { return input; })
      .add(function step2(input, step) { return input + 5; })
      .add(function step3(input, step) { return input.toString(); })

		const success = pipe.run(20)

    await vi.runAllTimersAsync()

    expect(pipe.at("step1")?.value).toBe(20)
    expect(pipe.at("nonexisting")).toBe(undefined)
    expect(pipe.at(1)?.value).toBe(25)
  })
  test.sequential('at() returns result for indexed step when not named', async function() {

    const pipe = Pipeline
			.add((input: number, step) => input)
      .add((input, step) => input + 5)
      .add((input, step) => input.toString())

		const success = pipe.run(20)

    await vi.runAllTimersAsync()

    expect(pipe.at("step1")?.value).toBe(undefined)
    expect(pipe.at("nonexisting")).toBe(undefined)
    expect(pipe.at(1)?.value).toBe(25)
  })
  test.sequential('at() inside step returns result for named step', async function() {

    const pipe = Pipeline
			.add(function step1(input: number, step) { return input; })
      .add(function step2(input, step) { return input + 5; })
      .addDependant(function step3(input: number[], step) { return input.reduce((acc, curr) => acc + curr, 0); }, { dependencies: ['step1', 'step2'] })

		const success = pipe.run(20)

    await vi.runAllTimersAsync()
    const result = await success

    expect(result?.value).toBe(45)
  })
  test.sequential('Sync pipeline retries works', async function() {
    const pipe = Pipeline.add((_, step) => 10)
      .add((input, step) => input + 5)
      .add((input, step) => {
        if (step.shouldRetry()) throw new Error('Retry')
        return input.toString()
      })

		const success = pipe.run()
		await vi.runAllTimersAsync()
    const result = await success

    expect(result.value).toBe('15')
    expect(pipe.steps[2].run).toBe(3)
  })
  test.sequential('Async pipeline retries works', async function() {
    const pipe = Pipeline.add(async (_, step) => delay(() => 10))
      .add(async (input, step) => delay(() => input + 5))
      .add(async (input, step) =>
        delay(() => {
          if (step.shouldRetry()) throw new Error('Retry')
          return input.toString()
        })
      )

		const success = pipe.run()
		await vi.runAllTimersAsync()
    const result = await success

    expect(result.value).toBe('15')
    expect(pipe.steps[2].run).toBe(3)
  })
  test.sequential('Async pipeline too many retries fail', async function() {
    const pipe = Pipeline.add(async (_, step) => delay(() => 10))
      .add(async (input, step) => delay(() => input + 5))
      .add(async (input, step) =>
        delay(() => {
          throw new Error('Retry')
        })
      )

		const success = pipe.run()
		await vi.runAllTimersAsync()
    const result = await success

    expect(result.success).toBe(false)
    expect(result.value).toBe('Error: Retry')
    expect(result.message).toBe('Failed at step 3')
  })
  test.sequential('Pipeline with retry strategy works', async function() {
    const pipe = Pipeline.configure({
      retries: 3,
      retryStrategy: (step) => step.run * 10,
    })
      .add((_, step) => 10)
      .add((input, step) => input + 5)
      .add((input, step) => {
        if (step.shouldRetry()) throw new Error('Retry')
        return input.toString()
      })

    const start = Date.now()
		const success = pipe.run()
		await vi.runAllTimersAsync()
    const result = await success
    const time = Date.now() - start

		expect(result.value).toBe('15')
    expect(pipe.steps[2].run).toBe(4)
    expect(time).toBe(10 + 20 + 30) // Sum of delays
  })
})
