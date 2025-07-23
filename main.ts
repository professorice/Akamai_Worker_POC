import { logger } from 'log';

import { LDMultiKindContext } from '@launchdarkly/akamai-server-base-sdk';

import { evaluateFlagFromCustomFeatureStore } from './ldClient.js';

const createLDContext = (request: EW.IngressClientRequest): LDMultiKindContext => {
  const userAgent = request.getHeader('User-Agent')?.[0] || 'unknown';
  const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
  
  return {
    kind: 'multi',
    user: {
      key: request.getHeader('X-User-ID')?.[0] || 'anonymous',
      anonymous: !request.getHeader('X-User-ID')?.[0]
    },
    location: {
      key: 'location-context',
      country: request.userLocation?.country || 'unknown'
    },
    device: {
      key: 'device-context',
      custom: {
        isMobile
      }
    }
  };
};

// Simple HTML response helper
const createResponse = (showAds: boolean) => {
  const adContent = showAds ? 
    '<div style="background: #fffacd; padding: 10px; margin: 10px 0; border: 1px dashed #ddd;">📢 Advertisement: Special Offer Available!</div>' : 
    '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>EdgeWorker Demo</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; }
        h1 { color: #333; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Hello from EdgeWorker!</h1>
        <p>This content is dynamically generated at the edge using LaunchDarkly feature flags.</p>
        ${adContent}
        <p><small>Powered by Akamai EdgeWorkers + LaunchDarkly</small></p>
      </div>
    </body>
    </html>
  `;
};

export async function onClientRequest(request: EW.IngressClientRequest) {
  try {
    logger.log(`Processing request: ${request.path}`);
    
    const context = createLDContext(request);
    
    // Evaluate single feature flag
    const showAds = await evaluateFlagFromCustomFeatureStore('enable-ads', context, false);
    
    logger.log(`Feature flag 'enable-ads': ${showAds}`);

    const responseBody = createResponse(showAds);

    request.respondWith(200, { 'Content-Type': 'text/html' }, responseBody);

  } catch (err) {
    logger.error(`EdgeWorker error: ${err?.toString()}`);
    
    const errorResponse = `
      <!DOCTYPE html>
      <html>
      <body>
        <h1>Service Unavailable</h1>
        <p>Please try again later.</p>
      </body>
      </html>
    `;

    request.respondWith(500, { 'Content-Type': 'text/html' }, errorResponse);
  }
}

export function onClientResponse(
  request: EW.EgressClientRequest,
  response: EW.EgressClientResponse,
) {
  logger.log(`Adding response header for: ${request.path}`);
  
  // Add single identification header
  response.setHeader('X-EdgeWorker-LaunchDarkly', 'enabled');
}
