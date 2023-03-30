import { NostrRelay } from '../src/services/relay';
import { NOSTR_KIND_INSCRIPTION } from '../src/config/constants';
import { openOrdex } from '../src/services/open-ordex';
require('websocket-polyfill');

jest.mock('nostr-tools');
jest.mock('../src/services/open-ordex');

const MockSimplePool = require('nostr-tools').SimplePool;

class MockEventEmitter {
    private events: { [key: string]: Function[] } = {};

    on(eventName: string, listener: Function) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(listener);
    }

    emit(eventName: string, ...args: any[]) {
        if (this.events[eventName]) {
            for (const listener of this.events[eventName]) {
                listener(...args);
            }
        }
    }
}

class MockSub extends MockEventEmitter {
    unsub = jest.fn();
}

MockSimplePool.prototype.sub = jest.fn().mockImplementation(() => new MockSub());

describe('NostrRelay', () => {
    let relayInstance: NostrRelay;

    beforeEach(() => {
        relayInstance = new NostrRelay();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('unsubscribeOrders', () => {
        it('should unsubscribe from orders', () => {
            const mockUnsub = jest.fn();
            const mockSub = { ...new MockEventEmitter(), unsub: mockUnsub } as any;

            MockSimplePool.prototype.sub.mockReturnValue(mockSub);

            relayInstance.subscribeOrders({ limit: 10, onOrder: jest.fn(), onEose: jest.fn() });
            relayInstance.unsubscribeOrders();

            expect(mockUnsub).toHaveBeenCalledTimes(1);
        });
    });

    describe('subscribeOrders', () => {
        it('should subscribe to orders and process events', async () => {
            const mockParseOrderEvent = jest.fn().mockResolvedValue({ id: 'test' });
            (openOrdex.parseOrderEvent as jest.Mock) = mockParseOrderEvent;

            const onOrder = jest.fn();
            const onEose = jest.fn();

            const mockSub = { ...new MockEventEmitter(), unsub: jest.fn() } as any;
            MockSimplePool.prototype.sub.mockReturnValue(mockSub);

            const sub = relayInstance.subscribeOrders({ limit: 10, onOrder, onEose });

            expect(MockSimplePool.prototype.sub).toHaveBeenCalledWith(expect.any(Array), [
                { kinds: [NOSTR_KIND_INSCRIPTION], limit: 10 },
            ]);

            const event = { id: 'testEvent' };
            mockSub.emit('event', event);
            await new Promise((resolve) => setImmediate(resolve));
            expect(openOrdex.parseOrderEvent).toHaveBeenCalledWith(event);
            expect(onOrder).toHaveBeenCalledWith({ id: 'test' });

            mockSub.emit('eose');
            expect(onEose).toHaveBeenCalledTimes(1);
        });

        it('should throw an error when subscribing fails', () => {
            const error = new Error('Failed to subscribe');
            MockSimplePool.prototype.sub.mockImplementationOnce(() => {
                throw error;
            });

            const onOrder = jest.fn();
            const onEose = jest.fn();

            expect(() => relayInstance.subscribeOrders({ limit: 10, onOrder, onEose })).toThrow(error);
        });
    });
});
