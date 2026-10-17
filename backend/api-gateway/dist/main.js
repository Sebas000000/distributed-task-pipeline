"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Distributed Task & Event Pipeline API')
        .setDescription('Asynchronous task processing architecture with Redis and BullMQ. Dispatches background jobs, monitors queue depths, and streams worker execution telemetry.')
        .setVersion('1.0.0')
        .addTag('Jobs Execution & Dispatch', 'Endpoints for enqueuing and inspecting background tasks')
        .addTag('Cluster Telemetry & Health', 'Cluster-wide queue metrics, throughput and telemetry')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        customSiteTitle: 'Distributed Task Pipeline - API Docs',
        customCss: '.swagger-ui .topbar { display: none }',
    });
    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`=======================================================`);
    logger.log(`🚀 API Gateway active on: http://localhost:${port}/api`);
    logger.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
    logger.log(`=======================================================`);
}
bootstrap();
//# sourceMappingURL=main.js.map