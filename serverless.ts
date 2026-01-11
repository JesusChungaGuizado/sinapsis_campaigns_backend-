import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'sinapsis-campaigns-backend',
  frameworkVersion: '3',
  plugins: [
    "serverless-dotenv-plugin",
    'serverless-esbuild',
    'serverless-offline'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      DB_HOST: "${env:DB_HOST, 'NOT_FOUND'}",
      DB_PORT: "${env:DB_PORT, 'NOT_FOUND'}",
      DB_USER: "${env:DB_USER, 'NOT_FOUND'}",
      DB_PASSWORD: "${env:DB_PASSWORD, 'NOT_FOUND'}",
      DB_NAME: "${env:DB_NAME, 'NOT_FOUND'}",
    },
  },
  functions: {
    createCampaign: {
      handler: "src/handlers/campaign.create",
      events: [{ http: { path: "${self:custom.apiPrefix}/campaigns", method: "post" } }]
    },

    processCampaign: {
      handler: "src/handlers/campaign.process",
      events: [{ http: { path: "${self:custom.apiPrefix}/campaigns/{id}/process", method: "post" } }]
    },

    listCampaigns: {
      handler: "src/handlers/campaign.list",
      events: [{ http: { path: "${self:custom.apiPrefix}/campaigns", method: "get" } }]
    },

    campaignMessages: {
      handler: "src/handlers/campaign.messages",
      events: [{ http: { path: "${self:custom.apiPrefix}/campaigns/{id}/messages", method: "get" } }]
    }
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10
    },
    apiPrefix: "${env:API_PREFIX, 'api/v1'}"
  },
};

module.exports = serverlessConfiguration;
