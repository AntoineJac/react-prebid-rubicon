const defineGptSizeMappings = Symbol('define GTP size mappings (private method)');
const getGptSizeMapping = Symbol('get GPT size mapping (private method)');
const defineSlots = Symbol('define slots (private method)');
const displaySlots = Symbol('display slots (private method)');
const setupPrebid = Symbol('setup Prebid (private method)');
const teardownPrebid = Symbol('teardown Prebid (private method)');
const setupGpt = Symbol('setup GPT (private method)');
const teardownGpt = Symbol('teardown GPT (private method)');
const callAdserverSetup = Symbol('call DFP slots in setup (private method)');
const callAdserverId = Symbol('call DFP by activate (private method)');
const setupCustomEvents = Symbol('setup custom events (private method)');
const setupCustomEvent = Symbol('setup custom event (private method)');
const teardownCustomEvents = Symbol('teardown custom events (private method)');
const withQueue = Symbol('with queue (private method)');
const queueForGPT = Symbol('queue for GPT (private method)');
const queueForPrebid = Symbol('queue for Prebid (private method)');
const setDefaultConfig = Symbol('set default config (private method)');
const executePlugins = Symbol('execute plugins (private method)');

export default class Advertising {
    constructor(config, plugins = []) {
        this.config = config;
        this.slots = {};
        this.plugins = plugins;
        this.gptSizeMappings = {};
        this.customEventCallbacks = {};
        this.customEventHandlers = {};
        this.queue = [];
        this[setDefaultConfig]();
    }

    // ---------- PUBLIC METHODS ----------

    async setup() {
        const { slots, queue } = this;
        this[setupCustomEvents]();
        await Promise.all([
            Advertising[queueForPrebid](this[setupPrebid].bind(this)),
            Advertising[queueForGPT](this[setupGpt].bind(this))
        ]);
        if (queue.length === 0) {
            return;
        }
        for (const { id, customEventHandlers } of queue) {
            Object.keys(customEventHandlers).forEach(customEventId => {
                if (!this.customEventCallbacks[customEventId]) {
                    this.customEventCallbacks[customEventId] = {};
                }
                return (this.customEventCallbacks[customEventId][id] = customEventHandlers[customEventId]);
            });
        }
        const divIds = queue.map(({ id }) => id);
        const selectedSlots = queue.map(({ id }) => slots[id]);
        Advertising[queueForGPT](
            () =>
                Advertising[queueForPrebid](() =>
                    window.pbjs.rp.requestBids({
                        callback: this[callAdserverSetup],
                        gptSlotObjects: selectedSlots
                    })
                ),
            setTimeout(() => {
                this[callAdserverSetup](selectedSlots);
            }, 2000)
        );
    }

    async teardown() {
        this[teardownCustomEvents]();
        await Promise.all([
            Advertising[queueForPrebid](this[teardownPrebid].bind(this)),
            Advertising[queueForGPT](this[teardownGpt].bind(this))
        ]);
        this.slots = {};
        this.gptSizeMappings = {};
        this.queue = {};
    }

    activate(id, customEventHandlers = {}) {
        const { slots } = this;
        if (Object.values(slots).length === 0) {
            this.queue.push({ id, customEventHandlers });
            return;
        }
        Object.keys(customEventHandlers).forEach(customEventId => {
            if (!this.customEventCallbacks[customEventId]) {
                this.customEventCallbacks[customEventId] = {};
            }
            return (this.customEventCallbacks[customEventId][id] = customEventHandlers[customEventId]);
        });
        Advertising[queueForGPT](
            () =>
                Advertising[queueForPrebid](() =>
                    window.pbjs.rp.requestBids({
                        callback: this[callAdserverId],
                        gptSlotObjects: [slots[id]]
                    })
                ),
            setTimeout(() => {
                this[callAdserverId]([slots[id]]);
            }, 2000)
        );
    }

    // ---------- PRIVATE METHODS ----------

    [callAdserverSetup](slots) {
        if (window.pbjs.adserverRequestSent) return;
        window.pbjs.adserverRequestSent = true;
        window.googletag.pubads().refresh(slots);
    }

    [callAdserverId](slots) {
        const temp = slots[0].getSlotElementId();
        if (window.pbjs[temp]) return;
        window.pbjs[temp] = true;
        window.googletag.pubads().refresh(slots);
    }

    [setupCustomEvents]() {
        if (!this.config.customEvents) {
            return;
        }
        Object.keys(this.config.customEvents).forEach(customEventId =>
            this[setupCustomEvent](customEventId, this.config.customEvents[customEventId])
        );
    }

    [setupCustomEvent](customEventId, { eventMessagePrefix, divIdPrefix }) {
        const { customEventCallbacks } = this;
        this.customEventHandlers[customEventId] = ({ data }) => {
            if (typeof data !== 'string' || !data.startsWith(`${eventMessagePrefix}`)) {
                return;
            }
            const divId = `${divIdPrefix || ''}${data.substr(eventMessagePrefix.length)}`;
            const callbacks = customEventCallbacks[customEventId];
            if (!callbacks) {
                return;
            }
            const callback = callbacks[divId];
            if (callback) {
                callback();
            }
        };
        window.addEventListener('message', this.customEventHandlers[customEventId]);
    }

    [teardownCustomEvents]() {
        if (!this.config.customEvents) {
            return;
        }
        Object.keys(this.config.customEvents).forEach(customEventId =>
            window.removeEventListener('message', this.customEventHandlers[customEventId])
        );
    }

    [defineGptSizeMappings]() {
        if (!this.config.sizeMappings) {
            return;
        }
        for (const [key, value] of Object.entries(this.config.sizeMappings)) {
            const sizeMapping = window.googletag.sizeMapping();
            for (const { viewPortSize, sizes } of value) {
                sizeMapping.addSize(viewPortSize, sizes);
            }
            this.gptSizeMappings[key] = sizeMapping.build();
        }
    }

    [getGptSizeMapping](sizeMappingName) {
        return sizeMappingName && this.gptSizeMappings[sizeMappingName] ? this.gptSizeMappings[sizeMappingName] : null;
    }

    [defineSlots]() {
        this.config.slots.forEach(({ id, path, collapseEmptyDiv, targeting = {}, sizes, sizeMappingName }) => {
            const slot = window.googletag.defineSlot(path || this.config.path, sizes, id);

            const sizeMapping = this[getGptSizeMapping](sizeMappingName);
            if (sizeMapping) {
                slot.defineSizeMapping(sizeMapping);
            }

            if (collapseEmptyDiv && collapseEmptyDiv.length && collapseEmptyDiv.length > 0) {
                slot.setCollapseEmptyDiv(...collapseEmptyDiv);
            }

            for (const [key, value] of Object.entries(targeting)) {
                slot.setTargeting(key, value);
            }

            slot.addService(window.googletag.pubads());

            this.slots[id] = slot;
        });
    }

    [displaySlots]() {
        this[executePlugins]('displaySlots');
        this.config.slots.forEach(({ id }) => window.googletag.display(id));
    }

    [setupPrebid]() {
        this[executePlugins]('setupPrebid');
        // const adUnits = getAdUnits(this.config.slots);
        // window.pbjs.addAdUnits(adUnits);
        // window.pbjs.setConfig(this.config.prebid);
    }

    [teardownPrebid]() {
        this[executePlugins]('teardownPrebid');
        // getAdUnits(this.config.slots).forEach(({ code }) => window.pbjs.removeAdUnit(code));
    }

    [setupGpt]() {
        this[executePlugins]('setupGpt');
        const pubads = window.googletag.pubads();
        const { targeting } = this.config;
        this[defineGptSizeMappings]();
        this[defineSlots]();
        for (const [key, value] of Object.entries(targeting)) {
            pubads.setTargeting(key, value);
        }
        pubads.disableInitialLoad();
        pubads.enableSingleRequest();

        window.googletag.enableServices();
        this[displaySlots]();
    }

    [teardownGpt]() {
        this[executePlugins]('teardownGpt');
        window.googletag.destroySlots();
    }

    [setDefaultConfig]() {
        if (!this.config.prebid) {
            this.config.prebid = {};
        }
        if (!this.config.metaData) {
            this.config.metaData = {};
        }
        if (!this.config.targeting) {
            this.config.targeting = {};
        }
    }

    [executePlugins](method) {
        for (const plugin of this.plugins) {
            const func = plugin[method];
            if (func) {
                func.call(this);
            }
        }
    }

    static [queueForGPT](func) {
        return Advertising[withQueue](window.googletag.cmd, func);
    }

    static [queueForPrebid](func) {
        return Advertising[withQueue](window.pbjs.que, func);
    }

    static [withQueue](queue, func) {
        return new Promise(resolve =>
            queue.push(() => {
                func();
                resolve();
            })
        );
    }
}
