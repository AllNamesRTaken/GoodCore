import { expect, describe, test, vi, afterAll } from 'vitest'
import { EventBus } from "../lib/standard/EventBus.ts";

describe("EventBus",
	() => {
		test("Emit is listened to",
			async () => {
				var bus = new EventBus<{
					"event1": (payload: { data: string }) => void
				}>();
				bus.on('event1', (payload) => {
					expect(payload.data).toBe('hello');
				});
				bus.emit('event1', { data: 'hello' });
			});

		test("Rpc Promise<T> result is returned",
			async () => {
				var bus = new EventBus<{
					"rpc1": (payload: { data: string }) => Promise<string>
				}>();
				bus.on('rpc1', async (payload) => {
					expect(payload.data).toBe('hello');
					return 'world';
				});
				const result = await bus.rpc('rpc1', { data: 'hello' });
				expect(result).toBe('world');
			});
		test("Rpc T result is returned",
			async () => {
				var bus = new EventBus<{
					"rpc1": (payload: { data: string }) => string
				}>();
				bus.on('rpc1', (payload) => {
					expect(payload.data).toBe('hello');
					return 'world';
				});
				const result = await bus.rpc('rpc1', { data: 'hello' });
				expect(result).toBe('world');
			});
		test("Rpc many returns results",
			async () => {
				var bus = new EventBus<{
					"rpc1": (payload: { data: string }) => Promise<string>
				}>();
				bus.on('rpc1', async (payload) => {
					expect(payload.data).toBe('hello');
					return 'world1';
				});
				bus.on('rpc1', async (payload) => {
					expect(payload.data).toBe('hello');
					return 'world2';
				});
				const result = await bus.rpcMany('rpc1', { data: 'hello' });
				expect(result).toEqual(['world1', 'world2']);
			});
		test("Rpc many with array argument returns results",
			async () => {
				var bus = new EventBus<{
					"rpc1": (payload: { data: string }) => Promise<string>
				}>();
				bus.on('rpc1', async (payload) => {
					expect(payload.data).toBe('hello');
					return 'world1';
				});
				bus.on('rpc1', async (payload) => {
					expect(payload.data).toBe('hello');
					return 'world2';
				});
				const result = await bus.rpcMany(['rpc1', { data: 'hello' }]);
				expect(result).toEqual(['world1', 'world2']);
			});
		test("Once is only called once",
			async () => {
				var bus = new EventBus<{
					"once1": (payload: { data: string }) => void
				}>();
				let counter = 0;
				bus.once('once1', async (payload) => {
					counter += 1;
				});
				bus.emit('once1', { data: 'hello' });
				bus.emit('once1', { data: 'hello' });
				expect(counter).toBe(1);
			});
		test("Once calls error handler on error",
			async () => {
				let errorHandlerMessage = "";
				var bus = new EventBus<{
					"once1": (payload: { data: string }) => void
				}>({onError: (e) => {
					errorHandlerMessage = e.message;
				}});
				let counter = 0;
				bus.once('once1', (payload) => {
					throw new Error('test error');
				});
				bus.emit('once1', { data: 'hello' });
				expect(errorHandlerMessage).toBe('test error');
			});
		test("Once calls error handler on promise rejection",
			async () => {
				let errorHandlerMessage = "";
				var bus = new EventBus<{
					"once1": (payload: { data: string }) => Promise<void>
				}>({onError: (e) => {
					errorHandlerMessage = e.message;
				}});
				bus.once('once1', async (payload) => {
					throw new Error('test error');
				});
				await bus.emit('once1', { data: 'hello' });
				expect(errorHandlerMessage).toBe('test error');
			});
		test("Error in handler is caught on RPC Error",
			async () => {
				var bus = new EventBus<{
					"error1": (payload: { data: string }) => Promise<string>
				}>();
				bus.on('error1', (payload) => {
					throw new Error('test error');
				});
				let error = null;
				try {
					const result = await bus.rpc('error1', { data: 'hello' });
				} catch (e) {
					error = e
				}
					expect(error.message).toBe('test error')
			});
		test("Error in handler is caught on RPC rejection",
			async () => {
				var bus = new EventBus<{
					"error1": (payload: { data: string }) => Promise<string>
				}>();
				bus.on('error1', async (payload) => {
					throw new Error('test error');
				});
				let error = null;
				try {
					const result = await bus.rpc('error1', { data: 'hello' });
				} catch (e) {
					error = e
				}
					expect(error.message).toBe('test error')
			});
		test("Error in handler does not throw on emit",
			async () => {
				var bus = new EventBus<{
					"error1": (payload: { data: string }) => Promise<string>
				}>();
				bus.on('error1', async (payload) => {
					throw new Error('test error');
				});
				bus.emit('error1', { data: 'hello' });
			});
		test("Error in handler does not throw on emit with promise rejection",
			async () => {
				var bus = new EventBus<{
					"error1": (payload: { data: string }) => Promise<string>
				}>();
				bus.on('error1', async (payload) => {
					return Promise.reject(new Error('test error'));
				});
				bus.emit('error1', { data: 'hello' });
			});
		test("Error handler is called on rpc error",
			async () => {
				let errorHandlerMessage = "";
				var bus = new EventBus<{
					"error1": (payload: { data: string }) => void
				}>({onError: (e) => {
					errorHandlerMessage = e.message;
				}});
				bus.on('error1', async (payload) => {
					throw new Error('test error');
				});
				let error = null;
				try {
					const result = await bus.rpc('error1', { data: 'hello' });
				} catch (e) {
					error = e
				}
				expect(error.message).toBe('test error');
				expect(errorHandlerMessage).toBe('test error');
			});
		test("Error handler is called on emit Error",
			async () => {
				let errorHandlerMessage = "";
				var bus = new EventBus<{
					"error1": (payload: { data: string }) => Promise<string>
				}>({onError: (e) => {
					errorHandlerMessage = e.message;
				}});
				bus.on('error1', async (payload) => {
					throw new Error('test error');
				});
				let error = null;
				try {
					const result = await bus.rpc('error1', { data: 'hello' });
				} catch (e) {
					error = e
				}
				expect(error.message).toBe('test error');
				expect(errorHandlerMessage).toBe('test error');
			});
		test("Error handler is called on emit with promise rejection",
			async () => {
				let errorHandlerMessage = "";
				var bus = new EventBus<{
					"error1": (payload: { data: string }) => Promise<string>
				}>({onError: (e) => {
					errorHandlerMessage = e.message;
				}});
				bus.on('error1', async (payload) => {
					return Promise.reject(new Error('test error'));
				});
				let error = null;
				try {
					const result = await bus.rpc('error1', { data: 'hello' });
				} catch (e) {
					error = e
				}
				expect(error.message).toBe('test error');
				expect(errorHandlerMessage).toBe('test error');
			});
		test("Non-existent RPC logs warning in verbose mode",
			async () => {
				var bus = new EventBus<{
					"rpc1": (payload: { data: string }) => void
				}>({verbose: 1});
				
				const consoleMock = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
				afterAll(() => {
					consoleMock.mockReset();
				});

				bus.rpc('rpc1', { data: 'hello' });

				expect(consoleMock).toHaveBeenCalledOnce();
    		expect(consoleMock).toHaveBeenLastCalledWith('No listener for emit to rpc1 [payload: [{"data":"hello"}]]');
			});
		test("Off removes handler",
			async () => {
				var bus = new EventBus<{
					"off1": (payload: { data: string }) => Promise<string>
				}>();
				const handler = async (payload: { data: string }) => {
					expect(payload.data).toBe('hello');
					return 'world';
				};
				bus.on('off1', handler);
				bus.off('off1', handler);
				const result = await bus.rpc('off1', { data: 'hello' });
				expect(result).toBe(undefined);
			}
		);
		test("Off on non-existent handler does nothing",
			async () => {
				var bus = new EventBus<{
					"off1": (payload: { data: string }) => Promise<string>
				}>();
				bus.off('off1', () => Promise.resolve(''));
			}
		);
		test("On return function is the off handler",
			async () => {
				var bus = new EventBus<{
					"off1": (payload: { data: string }) => Promise<string>
				}>();
				const handler = async (payload: { data: string }) => {
					expect(payload.data).toBe('hello');
					return 'world';
				};
				const off = bus.on('off1', handler);
				off();
				const result = await bus.rpc('off1', { data: 'hello' });
				expect(result).toBe(undefined);
			}
		);
	}
);
