import { Controller, Get } from '@nestjs/common';
import {
    DNSHealthIndicator,
    HealthCheck,
    HealthCheckService,
} from '@nestjs/terminus';

@Controller('/health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private dns: DNSHealthIndicator,
    ) {}

    private get router() {
        const route =
            process.env.NODE_ENV === 'production'
                ? 'https://desafio-cep.herokuapp.com'
                : `http://localhost:3000`;
        return route;
    }

    @Get('/check/cep')
    @HealthCheck()
    public check() {
        console.log(this.router);

        return this.health.check([
            () =>
                this.dns.pingCheck(
                    '/ GET cep',
                    `${this.router}/api/v1/cep/check`,
                ),
        ]);
    }
}
