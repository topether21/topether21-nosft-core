import { SimplePool, Event, Sub } from 'nostr-tools';
import { SaleOrder } from '../src/types/relay';
import { openOrdex } from '../src/services/open-ordex';
import { NostrRelay, SubscribeOrdersProps } from '../src/services/relay';

jest.mock('nostr-tools');
jest.mock('../src/services/open-ordex');

describe('NostrRelay', () => {
    let nostrRelay: NostrRelay;

    beforeEach(() => {
        (SimplePool as jest.Mock).mockClear();
        (openOrdex.parseOrderEvent as jest.Mock).mockClear();
        nostrRelay = new NostrRelay();
    });

    test('constructor initializes with correct properties', () => {
        expect(nostrRelay.getSubscriptionOrders()).toBeNull();
        expect(SimplePool).toHaveBeenCalledTimes(1);
    });

    test('unsubscribeOrders', () => {
        const mockSub = {} as Sub;
        mockSub.unsub = jest.fn();
        nostrRelay['subscriptionOrders'] = mockSub;

        nostrRelay.unsubscribeOrders();

        expect(mockSub.unsub).toHaveBeenCalledTimes(1);
        expect(nostrRelay.getSubscriptionOrders()).toBeNull();
    });

    test('subscribeOrders calls parseOrderEvent and onOrder', async () => {
        const mockEvent = {} as Event;
        const mockOrder = {} as SaleOrder;
        const mockSub = {} as Sub;

        (openOrdex.parseOrderEvent as jest.Mock).mockResolvedValue(mockOrder);
        nostrRelay['subscribe'] = jest.fn().mockImplementation((_, onEvent) => {
            onEvent(mockEvent);
            return mockSub;
        });

        const onOrder = jest.fn();
        const onEose = jest.fn();
        const props: SubscribeOrdersProps = { limit: 10, onOrder, onEose };

        nostrRelay.subscribeOrders(props);

        expect(nostrRelay['subscribe']).toHaveBeenCalledTimes(1);
        await new Promise(setImmediate); // Wait for async callbacks
        expect(openOrdex.parseOrderEvent).toHaveBeenCalledTimes(1);
        expect(openOrdex.parseOrderEvent).toHaveBeenCalledWith(mockEvent);
        expect(onOrder).toHaveBeenCalledTimes(1);
        expect(onOrder).toHaveBeenCalledWith(mockOrder);
    });
});
