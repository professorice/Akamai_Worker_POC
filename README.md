# Akamai EdgeWorker with LaunchDarkly Integration

This project demonstrates a Akamai EdgeWorker implementation that integrates with LaunchDarkly for feature flag management at the edge.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure LaunchDarkly**
   Update `ldClient.ts` with your LaunchDarkly environment details:
   ```typescript
   sdkKey: 'Your-launchdarkly-environment-client-id'
   ```

3. **Build the EdgeWorker**
   ```bash
   npm run build
   ```

4. **Deploy to Akamai**
   ```bash
   npm run validate 
   npm run dev     
   ```

The EdgeWorker adds one identification header:
- `X-EdgeWorker-LaunchDarkly`: Indicates LaunchDarkly integration is enabled

## Development

### Local Testing
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm run validate
```

## Learn More

- [Akamai EdgeWorkers Documentation](https://techdocs.akamai.com/edgeworkers/docs)
- [LaunchDarkly Akamai SDK](https://docs.launchdarkly.com/sdk/server-side/akamai)
- [EdgeWorkers Examples](https://github.com/akamai/edgeworkers-examples)
