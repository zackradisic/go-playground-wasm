
module.exports = {
  // Target must be serverless
  target: 'serverless',
  async headers() {
    // return []
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'unsafe-none'
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none'
          },
          {
          key: 'Cross-Origin-Resource-Policy',
          value: 'cross-origin'
          }
        ]
      }
    ]
  },
}
