import { AdaptiveTicker } from "./adaptive_ticker";
import { range } from "../../core/util/array";
export class LogTicker extends AdaptiveTicker {
    constructor(attrs) {
        super(attrs);
    }
    static init_LogTicker() {
        this.override({
            mantissas: [1, 5],
        });
    }
    get_ticks_no_defaults(data_low, data_high, _cross_loc, desired_n_ticks) {
        const num_minor_ticks = this.num_minor_ticks;
        const minor_ticks = [];
        const base = this.base;
        const log_low = Math.log(data_low) / Math.log(base);
        const log_high = Math.log(data_high) / Math.log(base);
        const log_interval = log_high - log_low;
        let ticks;
        if (!isFinite(log_interval)) {
            ticks = [];
        }
        else if (log_interval < 2) { // treat as linear ticker
            const interval = this.get_interval(data_low, data_high, desired_n_ticks);
            const start_factor = Math.floor(data_low / interval);
            const end_factor = Math.ceil(data_high / interval);
            ticks = range(start_factor, end_factor + 1)
                .filter((factor) => factor != 0)
                .map((factor) => factor * interval)
                .filter((tick) => data_low <= tick && tick <= data_high);
            if (num_minor_ticks > 0 && ticks.length > 0) {
                const minor_interval = interval / num_minor_ticks;
                const minor_offsets = range(0, num_minor_ticks).map((i) => i * minor_interval);
                for (const x of minor_offsets.slice(1)) {
                    minor_ticks.push(ticks[0] - x);
                }
                for (const tick of ticks) {
                    for (const x of minor_offsets) {
                        minor_ticks.push(tick + x);
                    }
                }
            }
        }
        else {
            const startlog = Math.ceil(log_low * 0.999999);
            const endlog = Math.floor(log_high * 1.000001);
            const interval = Math.ceil((endlog - startlog) / 9.0);
            ticks = range(startlog - 1, endlog + 1, interval)
                .map((i) => base ** i);
            if (num_minor_ticks > 0 && ticks.length > 0) {
                const minor_interval = base ** interval / num_minor_ticks;
                const minor_offsets = range(1, num_minor_ticks + 1).map((i) => i * minor_interval);
                for (const x of minor_offsets) {
                    minor_ticks.push(ticks[0] / x);
                }
                minor_ticks.push(ticks[0]);
                for (const tick of ticks) {
                    for (const x of minor_offsets) {
                        minor_ticks.push(tick * x);
                    }
                }
            }
        }
        return {
            major: ticks.filter((tick) => data_low <= tick && tick <= data_high),
            minor: minor_ticks.filter((tick) => data_low <= tick && tick <= data_high),
        };
    }
}
LogTicker.__name__ = "LogTicker";
LogTicker.init_LogTicker();
//# sourceMappingURL=log_ticker.js.map